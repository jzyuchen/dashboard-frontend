<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Table, Button, Tag, Modal, Form, Input, message, Popconfirm, Card, Descriptions, Switch } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import type { TableProps } from 'ant-design-vue'

interface RoleRecord {
  id: number
  name: string
  code: string
  description: string
  status: 'active' | 'inactive'
  userCount: number
  createTime: string
  permissions: string[]
}

const loading = ref(false)
const modalVisible = ref(false)
const detailVisible = ref(false)
const modalTitle = ref('新增角色')
const formRef = ref()

const formState = reactive({
  id: undefined,
  name: '',
  code: '',
  description: '',
  status: 'active',
  permissions: [] as string[],
})

const columns = [
  { title: '角色ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '角色编码', dataIndex: 'code', key: 'code' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '用户数', dataIndex: 'userCount', key: 'userCount' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 200 },
]

const dataSource = ref<RoleRecord[]>([
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限',
    status: 'active',
    userCount: 2,
    createTime: '2024-01-01 10:00:00',
    permissions: ['*'],
  },
  {
    id: 2,
    name: '管理员',
    code: 'admin',
    description: '拥有大部分管理权限',
    status: 'active',
    userCount: 5,
    createTime: '2024-01-15 14:30:00',
    permissions: ['dashboard', 'system', 'system:user', 'system:role'],
  },
  {
    id: 3,
    name: '普通用户',
    code: 'user',
    description: '普通功能权限',
    status: 'active',
    userCount: 100,
    createTime: '2024-02-01 09:15:00',
    permissions: ['dashboard'],
  },
])

const currentRole = ref<RoleRecord | null>(null)

const permissionList = [
  { label: '工作台', value: 'dashboard' },
  { label: '系统管理', value: 'system' },
  { label: '用户管理', value: 'system:user' },
  { label: '角色管理', value: 'system:role' },
  { label: '菜单管理', value: 'system:menu' },
]

const handleAdd = () => {
  modalTitle.value = '新增角色'
  Object.assign(formState, {
    id: undefined,
    name: '',
    code: '',
    description: '',
    status: 'active',
    permissions: [],
  })
  modalVisible.value = true
}

const handleEdit = (record: RoleRecord) => {
  modalTitle.value = '编辑角色'
  Object.assign(formState, { ...record, permissions: [...record.permissions] })
  modalVisible.value = true
}

const handleDelete = (id: number) => {
  dataSource.value = dataSource.value.filter((item) => item.id !== id)
  message.success('删除成功')
}

const handleView = (record: RoleRecord) => {
  currentRole.value = record
  detailVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    if (formState.id) {
      const index = dataSource.value.findIndex((item) => item.id === formState.id)
      if (index !== -1) {
        dataSource.value[index] = { ...dataSource.value[index], ...formState }
      }
      message.success('编辑成功')
    } else {
      dataSource.value.unshift({
        ...formState,
        id: Date.now(),
        userCount: 0,
        createTime: new Date().toLocaleString(),
      })
      message.success('新增成功')
    }
    modalVisible.value = false
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

const handleStatusChange = (checked: boolean, record: RoleRecord) => {
  record.status = checked ? 'active' : 'inactive'
  message.success(`角色${checked ? '启用' : '禁用'}成功`)
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>角色管理</h1>
      <p>管理系统角色，配置角色权限</p>
    </div>

    <a-card :bordered="false">
      <div style="margin-bottom: 16px; text-align: right">
        <a-button type="primary" @click="handleAdd">
          <PlusOutlined />
          新增
        </a-button>
      </div>

      <Table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Switch
              :checked="record.status === 'active'"
              @change="(checked: boolean) => handleStatusChange(checked, record)"
              checked-children="启用"
              un-checked-children="禁用"
            />
          </template>
          <template v-else-if="column.key === 'permissions'">
            <Tag v-for="perm in record.permissions.slice(0, 3)" :key="perm" color="blue">
              {{ perm }}
            </Tag>
            <Tag v-if="record.permissions.length > 3">+{{ record.permissions.length - 3 }}</Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="link" size="small" @click="handleView(record)">详情</Button>
            <Button type="link" size="small" @click="handleEdit(record)">
              <EditOutlined />
              编辑
            </Button>
            <Popconfirm
              title="确定删除该角色吗？"
              @confirm="handleDelete(record.id)"
            >
              <Button type="link" size="small" danger :disabled="record.code === 'super_admin'">
                <DeleteOutlined />
                删除
              </Button>
            </Popconfirm>
          </template>
        </template>
      </Table>
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
          label="角色名称"
          name="name"
          :rules="[{ required: true, message: '请输入角色名称' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          label="角色编码"
          name="code"
          :rules="[{ required: true, message: '请输入角色编码' }]"
        >
          <a-input v-model:value="formState.code" :disabled="!!formState.id" />
        </a-form-item>
        <a-form-item
          label="描述"
          name="description"
        >
          <a-textarea v-model:value="formState.description" :rows="3" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <Switch v-model:checked="formState.status" checked-value="active" un-checked-value="inactive" />
        </a-form-item>
        <a-form-item label="权限配置" name="permissions">
          <a-checkbox-group v-model:value="formState.permissions">
            <a-row>
              <a-col :span="12" v-for="perm in permissionList" :key="perm.value">
                <a-checkbox :value="perm.value">{{ perm.label }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </Modal>

    <Modal
      v-model:open="detailVisible"
      title="角色详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions v-if="currentRole" :column="1" bordered>
        <a-descriptions-item label="角色名称">{{ currentRole.name }}</a-descriptions-item>
        <a-descriptions-item label="角色编码">{{ currentRole.code }}</a-descriptions-item>
        <a-descriptions-item label="描述">{{ currentRole.description }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <Tag :color="currentRole.status === 'active' ? 'success' : 'error'">
            {{ currentRole.status === 'active' ? '启用' : '禁用' }}
          </Tag>
        </a-descriptions-item>
        <a-descriptions-item label="用户数">{{ currentRole.userCount }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ currentRole.createTime }}</a-descriptions-item>
        <a-descriptions-item label="权限">
          <Tag v-for="perm in currentRole.permissions" :key="perm" color="blue">{{ perm }}</Tag>
        </a-descriptions-item>
      </a-descriptions>
    </Modal>
  </div>
</template>
