<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Tree, Button, Modal, Form, Input, message, Tag } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

interface MenuRecord {
  key: string
  title: string
  icon?: string
  path: string
  component?: string
  type: 'directory' | 'menu' | 'button'
  permission?: string
  orderNum: number
  status: 'active' | 'inactive'
  children?: MenuRecord[]
}

const modalVisible = ref(false)
const modalTitle = ref('新增菜单')
const formRef = ref()
const expandedKeys = ref<string[]>(['system', 'system/dashboard', 'system/user'])
const selectedKey = ref<string>('')

const formState = reactive({
  id: undefined as string | undefined,
  parentId: 'system',
  title: '',
  name: '',
  path: '',
  icon: '',
  component: '',
  type: 'menu',
  permission: '',
  orderNum: 0,
  status: 'active',
})

const treeData = ref<MenuRecord[]>([
  {
    key: 'dashboard',
    title: '工作台',
    icon: 'DashboardOutlined',
    path: '/dashboard',
    component: '/views/dashboard/index.vue',
    type: 'menu',
    permission: 'dashboard',
    orderNum: 1,
    status: 'active',
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'SettingOutlined',
    path: '/system',
    type: 'directory',
    orderNum: 2,
    status: 'active',
    children: [
      {
        key: 'system/user',
        title: '用户管理',
        icon: 'UserOutlined',
        path: '/system/user',
        component: '/views/system/user/index.vue',
        type: 'menu',
        permission: 'system:user',
        orderNum: 1,
        status: 'active',
      },
      {
        key: 'system/role',
        title: '角色管理',
        icon: 'TeamOutlined',
        path: '/system/role',
        component: '/views/system/role/index.vue',
        type: 'menu',
        permission: 'system:role',
        orderNum: 2,
        status: 'active',
      },
      {
        key: 'system/menu',
        title: '菜单管理',
        icon: 'MenuOutlined',
        path: '/system/menu',
        component: '/views/system/menu/index.vue',
        type: 'menu',
        permission: 'system:menu',
        orderNum: 3,
        status: 'active',
      },
    ],
  },
])

const typeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
]

const iconOptions = [
  { label: '仪表盘', value: 'DashboardOutlined' },
  { label: '用户', value: 'UserOutlined' },
  { label: '团队', value: 'TeamOutlined' },
  { label: '设置', value: 'SettingOutlined' },
  { label: '菜单', value: 'MenuOutlined' },
  { label: '文件', value: 'FileOutlined' },
  { label: '文件夹', value: 'FolderOutlined' },
]

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    directory: 'purple',
    menu: 'blue',
    button: 'green',
  }
  return colorMap[type] || 'default'
}

const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    directory: '目录',
    menu: '菜单',
    button: '按钮',
  }
  return textMap[type] || type
}

const handleAdd = (parentKey?: string) => {
  modalTitle.value = '新增菜单'
  Object.assign(formState, {
    id: undefined,
    parentId: parentKey || 'root',
    title: '',
    name: '',
    path: '',
    icon: '',
    component: '',
    type: 'menu',
    permission: '',
    orderNum: 0,
    status: 'active',
  })
  modalVisible.value = true
}

const handleEdit = (record: MenuRecord) => {
  modalTitle.value = '编辑菜单'
  const keys = record.key.split('/')
  Object.assign(formState, {
    id: record.key,
    parentId: keys.length > 1 ? keys.slice(0, -1).join('/') : 'root',
    title: record.title,
    name: record.title,
    path: record.path,
    icon: record.icon || '',
    component: record.component || '',
    type: record.type,
    permission: record.permission || '',
    orderNum: record.orderNum,
    status: record.status,
  })
  modalVisible.value = true
}

const handleDelete = (key: string) => {
  const deleteNode = (nodes: MenuRecord[]): boolean => {
    const index = nodes.findIndex((node) => node.key === key)
    if (index !== -1) {
      nodes.splice(index, 1)
      return true
    }
    for (const node of nodes) {
      if (node.children && deleteNode(node.children)) {
        return true
      }
    }
    return false
  }
  deleteNode(treeData.value)
  message.success('删除成功')
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    message.success(`${formState.id ? '编辑' : '新增'}成功`)
    modalVisible.value = false
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

const handleSelect = (selectedKeys: string[]) => {
  selectedKey.value = selectedKeys[0] as string
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>菜单管理</h1>
      <p>配置系统菜单树结构</p>
    </div>

    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <Button type="primary" @click="handleAdd()">
          <PlusOutlined />
          新增
        </Button>
      </div>

      <a-row :gutter="24">
        <a-col :xs="24" :lg="12">
          <div class="menu-tree">
            <Tree
              :tree-data="treeData"
              :expanded-keys="expandedKeys"
              :selected-keys="[selectedKey]"
              @expand="(keys: any) => (expandedKeys = keys)"
              @select="handleSelect"
            >
              <template #title="node">
                <div class="tree-item-content">
                  <span>{{ node.title }}</span>
                  <Tag :color="getTypeColor(node.type)" size="small">
                    {{ getTypeText(node.type) }}
                  </Tag>
                </div>
                <div class="tree-actions">
                  <Button type="link" size="small" @click.stop="handleAdd(node.key)">
                    <PlusOutlined />
                  </Button>
                  <Button type="link" size="small" @click.stop="handleEdit(node)">
                    <EditOutlined />
                  </Button>
                  <Button type="link" size="small" danger @click.stop="handleDelete(node.key)">
                    <DeleteOutlined />
                  </Button>
                </div>
              </template>
            </Tree>
          </div>
        </a-col>
        <a-col :xs="24" :lg="12">
          <a-card title="菜单配置" size="small">
            <a-empty v-if="!selectedKey" description="请选择左侧菜单" />
            <a-descriptions v-else :column="1" bordered size="small">
              <a-descriptions-item label="菜单名称">{{ selectedKey }}</a-descriptions-item>
              <a-descriptions-item label="菜单路径">/{{ selectedKey }}</a-descriptions-item>
              <a-descriptions-item label="组件路径">/views/{{ selectedKey }}/index.vue</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <Modal
      v-model:open="modalVisible"
      :title="modalTitle"
      @ok="handleSubmit"
      width="600px"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item
          label="上级菜单"
          name="parentId"
        >
          <a-select v-model:value="formState.parentId">
            <a-select-option value="root">根目录</a-select-option>
            <a-select-option value="system">系统管理</a-select-option>
            <a-select-option value="dashboard">工作台</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="菜单类型"
          name="type"
          :rules="[{ required: true, message: '请选择菜单类型' }]"
        >
          <a-select v-model:value="formState.type">
            <a-select-option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="菜单名称"
          name="title"
          :rules="[{ required: true, message: '请输入菜单名称' }]"
        >
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item
          label="路由路径"
          name="path"
          :rules="[{ required: true, message: '请输入路由路径' }]"
        >
          <a-input v-model:value="formState.path" placeholder="如: /system/user" />
        </a-form-item>
        <a-form-item
          label="组件路径"
          name="component"
        >
          <a-input v-model:value="formState.component" placeholder="如: /views/system/user/index.vue" />
        </a-form-item>
        <a-form-item
          label="菜单图标"
          name="icon"
        >
          <a-select v-model:value="formState.icon" allow-clear>
            <a-select-option v-for="opt in iconOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="权限标识"
          name="permission"
        >
          <a-input v-model:value="formState.permission" placeholder="如: system:user" />
        </a-form-item>
        <a-form-item
          label="排序"
          name="orderNum"
        >
          <a-input-number v-model:value="formState.orderNum" :min="0" :max="999" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-switch v-model:checked="formState.status" checked-value="active" un-checked-value="inactive" />
        </a-form-item>
      </a-form>
    </Modal>
  </div>
</template>

<style scoped>
.menu-tree {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 16px;
  max-height: 600px;
  overflow-y: auto;
  background: #fafafa;
}

:deep(.ant-tree-node-content-wrapper) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.ant-tree-node-content-wrapper:hover) {
  background: #e6f7ff;
}

:deep(.ant-tree-title) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

:deep(.tree-item-content) {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

:deep(.tree-actions) {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

:deep(.ant-tree-node-content-wrapper:hover .tree-actions) {
  opacity: 1;
}
</style>
