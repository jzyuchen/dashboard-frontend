<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Table,
  Space,
  Tag,
  Modal,
  message,
  Avatar,
  Popconfirm,
} from 'ant-design-vue'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

interface UserRecord {
  id: number
  username: string
  name: string
  email: string
  phone: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
}

const searchState = reactive({
  keyword: '',
  status: undefined,
})

const loading = ref(false)
const modalVisible = ref(false)
const modalTitle = ref('新增用户')
const formRef = ref()

const formState = reactive({
  id: undefined,
  username: '',
  name: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active',
})

const columns = [
  { title: '用户ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '角色', dataIndex: 'role', key: 'role' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 150 },
]

const dataSource = ref<UserRecord[]>([
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    role: '超级管理员',
    status: 'active',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    username: 'zhangsan',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    role: '普通用户',
    status: 'active',
    createTime: '2024-01-15 14:30:00',
  },
  {
    id: 3,
    username: 'lisi',
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    role: '普通用户',
    status: 'inactive',
    createTime: '2024-02-01 09:15:00',
  },
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 3,
})

const roleOptions = [
  { label: '超级管理员', value: 'admin' },
  { label: '管理员', value: 'manager' },
  { label: '普通用户', value: 'user' },
]

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
]

const handleSearch = () => {
  console.log('Search:', searchState)
}

const handleReset = () => {
  searchState.keyword = ''
  searchState.status = undefined
}

const handleAdd = () => {
  modalTitle.value = '新增用户'
  Object.assign(formState, {
    id: undefined,
    username: '',
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
  })
  modalVisible.value = true
}

const handleEdit = (record: UserRecord) => {
  modalTitle.value = '编辑用户'
  Object.assign(formState, { ...record })
  modalVisible.value = true
}

const handleDelete = (id: number) => {
  dataSource.value = dataSource.value.filter((item) => item.id !== id)
  message.success('删除成功')
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    if (formState.id) {
      const index = dataSource.value.findIndex((item) => item.id === formState.id)
      if (index !== -1) {
        dataSource.value[index] = { ...formState, createTime: dataSource.value[index].createTime }
      }
      message.success('编辑成功')
    } else {
      dataSource.value.unshift({
        ...formState,
        id: Date.now(),
        createTime: new Date().toLocaleString(),
      })
      message.success('新增成功')
    }
    modalVisible.value = false
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

const handleTableChange = (pag: { current?: number; pageSize?: number }) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>用户管理</h1>
      <p>管理系统用户，支持新增、编辑、删除等操作</p>
    </div>

    <a-card :bordered="false">
      <div class="search-bar">
        <a-space wrap>
          <a-input
            v-model:value="searchState.keyword"
            placeholder="搜索用户名/姓名"
            style="width: 200px"
            allow-clear
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
          <a-select
            v-model:value="searchState.status"
            placeholder="状态筛选"
            style="width: 120px"
            allow-clear
          >
            <a-select-option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="handleSearch">
            <SearchOutlined />
            搜索
          </a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
        <a-button type="primary" @click="handleAdd">
          <PlusOutlined />
          新增
        </a-button>
      </div>

      <Table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <Avatar :size="32">{{ record.name?.charAt(0) }}</Avatar>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="record.status === 'active' ? 'success' : 'error'">
              {{ record.status === 'active' ? '启用' : '禁用' }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined />
                编辑
              </a-button>
              <Popconfirm
                title="确定删除该用户吗？"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" size="small" danger>
                  <DeleteOutlined />
                  删除
                </a-button>
              </Popconfirm>
            </Space>
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
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="formState.username" :disabled="!!formState.id" />
        </a-form-item>
        <a-form-item
          label="姓名"
          name="name"
          :rules="[{ required: true, message: '请输入姓名' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          label="邮箱"
          name="email"
          :rules="[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item
          label="手机号"
          name="phone"
          :rules="[{ required: true, message: '请输入手机号' }]"
        >
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item
          label="角色"
          name="role"
          :rules="[{ required: true, message: '请选择角色' }]"
        >
          <a-select v-model:value="formState.role">
            <a-select-option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-switch v-model:checked="formState.status" checked-value="active" un-checked-value="inactive" />
        </a-form-item>
      </a-form>
    </Modal>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
</style>
