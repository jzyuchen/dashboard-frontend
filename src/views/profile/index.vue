<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { Card, Form, Input, Button, Avatar, Upload, message, Row, Col, Descriptions, Tag, Divider, Modal, Tabs, Table, Switch, Space, Popconfirm } from 'ant-design-vue'
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined, WechatOutlined, AlipayCircleOutlined, GithubOutlined, LockOutlined, SafetyOutlined, LogoutOutlined, DesktopOutlined, MobileOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'
import dayjs from 'dayjs'

const userStore = useUserStore()
const isEditing = ref(false)
const loading = ref(false)
const activeKey = ref('basic')
const passwordModalVisible = ref(false)
const changePhoneModalVisible = ref(false)
const changeEmailModalVisible = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const newPhoneForm = reactive({
  phone: '',
  code: '',
})

const newEmailForm = reactive({
  email: '',
  code: '',
})

const formState = reactive({
  name: userStore.userInfo?.name || '管理员',
  username: userStore.userInfo?.username || 'admin',
  email: 'admin@example.com',
  phone: '138****8000',
  department: '技术部',
  position: '系统管理员',
  bio: '负责系统运维和技术支持工作。',
  location: '北京市',
  website: 'https://example.com',
})

const socialBindings = reactive({
  wechat: true,
  alipay: true,
  github: false,
})

const securitySettings = reactive({
  twoFactorAuth: false,
  loginNotification: true,
  sessionTimeout: 30,
})

const activityLogs = ref([
  { id: 1, action: '登录系统', device: 'Chrome / Windows', ip: '192.168.1.100', location: '北京市', time: Date.now() - 100000, status: 'success' },
  { id: 2, action: '修改个人信息', device: 'Chrome / Windows', ip: '192.168.1.100', location: '北京市', time: Date.now() - 3600000, status: 'success' },
  { id: 3, action: '查看工作台', device: 'Safari / macOS', ip: '192.168.1.101', location: '上海市', time: Date.now() - 7200000, status: 'success' },
  { id: 4, action: '登录系统', device: 'Firefox / Linux', ip: '192.168.1.102', location: '广州市', time: Date.now() - 86400000, status: 'failed' },
])

const devices = ref([
  { id: 1, device: 'Chrome / Windows', location: '北京市', lastActive: Date.now() - 100000, current: true },
  { id: 2, device: 'Safari / macOS', location: '上海市', lastActive: Date.now() - 3600000, current: false },
  { id: 3, device: 'Mobile App / iOS', location: '广州市', lastActive: Date.now() - 86400000, current: false },
])

const activityColumns = [
  { title: '操作', dataIndex: 'action', key: 'action' },
  { title: '设备', dataIndex: 'device', key: 'device' },
  { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
  { title: '位置', dataIndex: 'location', key: 'location' },
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '状态', dataIndex: 'status', key: 'status' },
]

const deviceColumns = [
  { title: '设备', dataIndex: 'device', key: 'device' },
  { title: '位置', dataIndex: 'location', key: 'location' },
  { title: '最后活跃', dataIndex: 'lastActive', key: 'lastActive' },
  { title: '操作', key: 'action' },
]

const handleEdit = () => {
  isEditing.value = true
}

const handleCancel = () => {
  isEditing.value = false
}

const handleSave = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('保存成功')
    isEditing.value = false
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleAvatarChange = (info: any) => {
  if (info.file.status === 'done') {
    message.success('头像上传成功')
  }
}

const handleChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('密码修改成功')
    passwordModalVisible.value = false
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    message.error('密码修改失败')
  } finally {
    loading.value = false
  }
}

const handleChangePhone = async () => {
  if (!newPhoneForm.phone || !newPhoneForm.code) {
    message.error('请填写完整信息')
    return
  }
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('手机号修改成功')
    changePhoneModalVisible.value = false
    formState.phone = newPhoneForm.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    newPhoneForm.phone = ''
    newPhoneForm.code = ''
  } catch (error) {
    message.error('手机号修改失败')
  } finally {
    loading.value = false
  }
}

const handleChangeEmail = async () => {
  if (!newEmailForm.email || !newEmailForm.code) {
    message.error('请填写完整信息')
    return
  }
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('邮箱修改成功')
    changeEmailModalVisible.value = false
    formState.email = newEmailForm.email
    newEmailForm.email = ''
    newEmailForm.code = ''
  } catch (error) {
    message.error('邮箱修改失败')
  } finally {
    loading.value = false
  }
}

const handleLogoutDevice = (id: number) => {
  devices.value = devices.value.filter(d => d.id !== id)
  message.success('设备已登出')
}

const handleLogoutAllDevices = () => {
  devices.value = devices.value.filter(d => d.current)
  message.success('已登出所有其他设备')
}

const formatTime = (time: number) => {
  const diff = Date.now() - time
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const getStatusColor = (status: string) => {
  return status === 'success' ? 'success' : 'error'
}

const getStatusText = (status: string) => {
  return status === 'success' ? '成功' : '失败'
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>个人中心</h1>
      <p>管理个人信息、账号安全和偏好设置</p>
    </div>

    <Card :bordered="false">
      <Tabs v-model:activeKey="activeKey">
        <a-tab-pane key="basic" tab="基本信息" />
        <a-tab-pane key="security" tab="账号安全" />
        <a-tab-pane key="activity" tab="活动日志" />
      </Tabs>

      <div v-if="activeKey === 'basic'" class="tab-content">
        <Row :gutter="24">
          <Col :xs="24" :lg="8">
            <Card :bordered="false">
              <div class="profile-card">
                <div class="avatar-section">
                  <Upload
                    name="avatar"
                    :show-upload-list="false"
                    :before-upload="() => false"
                    @change="handleAvatarChange"
                  >
                    <Avatar :size="120" :src="userStore.userInfo?.avatar">
                      {{ formState.name?.charAt(0) }}
                    </Avatar>
                    <div class="avatar-mask">
                      <EditOutlined />
                    </div>
                  </Upload>
                  <h2 class="username">{{ formState.name }}</h2>
                  <p class="role">{{ formState.position }}</p>
                </div>

                <Divider />

                <div class="info-list">
                  <div class="info-item">
                    <UserOutlined class="info-icon" />
                    <span>{{ formState.username }}</span>
                  </div>
                  <div class="info-item">
                    <MailOutlined class="info-icon" />
                    <span>{{ formState.email }}</span>
                  </div>
                  <div class="info-item">
                    <PhoneOutlined class="info-icon" />
                    <span>{{ formState.phone }}</span>
                  </div>
                </div>

                <Divider />

                <div class="tags-section">
                  <Tag color="blue">系统管理</Tag>
                  <Tag color="green">数据查看</Tag>
                  <Tag color="orange">工单处理</Tag>
                </div>
              </div>
            </Card>

            <Card :bordered="false" style="margin-top: 16px">
              <template #title>社交账号绑定</template>
              
              <div class="bind-list">
                <div class="bind-item">
                  <Space>
                    <WechatOutlined style="font-size: 24px; color: #07c160" />
                    <span>微信</span>
                  </Space>
                  <Tag :color="socialBindings.wechat ? 'success' : 'default'">
                    {{ socialBindings.wechat ? '已绑定' : '未绑定' }}
                  </Tag>
                </div>
                <Divider />
                <div class="bind-item">
                  <Space>
                    <AlipayCircleOutlined style="font-size: 24px; color: #1677ff" />
                    <span>支付宝</span>
                  </Space>
                  <Tag :color="socialBindings.alipay ? 'success' : 'default'">
                    {{ socialBindings.alipay ? '已绑定' : '未绑定' }}
                  </Tag>
                </div>
                <Divider />
                <div class="bind-item">
                  <Space>
                    <GithubOutlined style="font-size: 24px; color: #333" />
                    <span>GitHub</span>
                  </Space>
                  <Button type="link" size="small" :disabled="socialBindings.github">
                    {{ socialBindings.github ? '已绑定' : '立即绑定' }}
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          <Col :xs="24" :lg="16">
            <Card :bordered="false">
              <template #title>
                <div class="card-title">
                  <span>个人信息</span>
                  <Button
                    v-if="!isEditing"
                    type="primary"
                    @click="handleEdit"
                  >
                    <EditOutlined />
                    编辑
                  </Button>
                  <Space v-else>
                    <Button @click="handleCancel">取消</Button>
                    <Button type="primary" :loading="loading" @click="handleSave">
                      <SaveOutlined />
                      保存
                    </Button>
                  </Space>
                </div>
              </template>

              <Form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                <Form.Item label="姓名">
                  <Input v-model:value="formState.name" :disabled="!isEditing" />
                </Form.Item>
                <Form.Item label="用户名">
                  <Input v-model:value="formState.username" disabled />
                </Form.Item>
                <Form.Item label="邮箱">
                  <Input v-model:value="formState.email" :disabled="!isEditing" />
                </Form.Item>
                <Form.Item label="手机号">
                  <Input v-model:value="formState.phone" disabled />
                </Form.Item>
                <Form.Item label="部门">
                  <Input v-model:value="formState.department" :disabled="!isEditing" />
                </Form.Item>
                <Form.Item label="职位">
                  <Input v-model:value="formState.position" :disabled="!isEditing" />
                </Form.Item>
                <Form.Item label="所在地">
                  <Input v-model:value="formState.location" :disabled="!isEditing" />
                </Form.Item>
                <Form.Item label="个人网站">
                  <Input v-model:value="formState.website" :disabled="!isEditing" />
                </Form.Item>
                <Form.Item label="个人简介">
                  <Input.TextArea
                    v-model:value="formState.bio"
                    :rows="4"
                    :disabled="!isEditing"
                    placeholder="请输入个人简介..."
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      <div v-if="activeKey === 'security'" class="tab-content">
        <Row :gutter="24">
          <Col :xs="24" :lg="12">
            <Card :bordered="false">
              <template #title>
                <Space>
                  <LockOutlined />
                  <span>密码安全</span>
                </Space>
              </template>
              
              <Descriptions :column="1" bordered size="small">
                <Descriptions.Item label="当前密码">
                  <Space>
                    <span>••••••••</span>
                    <Button type="link" size="small" @click="passwordModalVisible = true">
                      修改密码
                    </Button>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="密码强度">
                  <Space>
                    <Tag color="green">强</Tag>
                    <span style="color: #999">包含大小写字母、数字和特殊字符</span>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card :bordered="false" style="margin-top: 16px">
              <template #title>
                <Space>
                  <SafetyOutlined />
                  <span>两步验证</span>
                </Space>
              </template>
              
              <Descriptions :column="1" bordered size="small">
                <Descriptions.Item label="手机验证">
                  <Space>
                    <Switch v-model:checked="securitySettings.twoFactorAuth" />
                    <Tag :color="securitySettings.twoFactorAuth ? 'success' : 'default'">
                      {{ securitySettings.twoFactorAuth ? '已开启' : '未开启' }}
                    </Tag>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="登录通知">
                  <Switch v-model:checked="securitySettings.loginNotification" />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col :xs="24" :lg="12">
            <Card :bordered="false">
              <template #title>
                <Space>
                  <MobileOutlined />
                  <span>绑定管理</span>
                </Space>
              </template>
              
              <Descriptions :column="1" bordered size="small">
                <Descriptions.Item label="绑定手机">
                  <Space>
                    <span>{{ formState.phone }}</span>
                    <Tag color="green">已验证</Tag>
                    <Button type="link" size="small" @click="changePhoneModalVisible = true">
                      更换手机
                    </Button>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="绑定邮箱">
                  <Space>
                    <span>{{ formState.email }}</span>
                    <Tag color="green">已验证</Tag>
                    <Button type="link" size="small" @click="changeEmailModalVisible = true">
                      更换邮箱
                    </Button>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card :bordered="false" style="margin-top: 16px">
              <template #title>
                <Space>
                  <DesktopOutlined />
                  <span>设备管理</span>
                </Space>
              </template>

              <div class="device-list">
                <div v-for="device in devices" :key="device.id" class="device-item">
                  <Space>
                    <DesktopOutlined />
                    <div>
                      <div>{{ device.device }}</div>
                      <div style="font-size: 12px; color: #999">
                        {{ device.location }} · {{ formatTime(device.lastActive) }}
                        <Tag v-if="device.current" color="blue" size="small">当前设备</Tag>
                      </div>
                    </div>
                  </Space>
                  <Button
                    v-if="!device.current"
                    type="link"
                    danger
                    size="small"
                    @click="handleLogoutDevice(device.id)"
                  >
                    登出
                  </Button>
                </div>
              </div>

              <div style="margin-top: 16px">
                <Popconfirm
                  title="确定要登出所有其他设备吗？"
                  @confirm="handleLogoutAllDevices"
                >
                  <Button danger>登出所有其他设备</Button>
                </Popconfirm>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <div v-if="activeKey === 'activity'" class="tab-content">
        <Card :bordered="false">
          <template #title>活动日志</template>
          
          <Table
            :columns="activityColumns"
            :data-source="activityLogs"
            row-key="id"
            :pagination="{ pageSize: 10 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <Tag :color="getStatusColor(record.status)">
                  {{ getStatusText(record.status) }}
                </Tag>
              </template>
              <template v-else-if="column.key === 'time'">
                {{ formatTime(record.time) }}
              </template>
            </template>
          </Table>
        </Card>
      </div>
    </Card>

    <Modal
      v-model:open="passwordModalVisible"
      title="修改密码"
      @ok="handleChangePassword"
      :loading="loading"
    >
      <Form :model="passwordForm" layout="vertical">
        <Form.Item label="当前密码" required>
          <Input.Password v-model:value="passwordForm.oldPassword" placeholder="请输入当前密码" />
        </Form.Item>
        <Form.Item label="新密码" required>
          <Input.Password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item label="确认密码" required>
          <Input.Password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      v-model:open="changePhoneModalVisible"
      title="更换手机号"
      @ok="handleChangePhone"
      :loading="loading"
    >
      <Form :model="newPhoneForm" layout="vertical">
        <Form.Item label="新手机号" required>
          <Input v-model:value="newPhoneForm.phone" placeholder="请输入新手机号" />
        </Form.Item>
        <Form.Item label="验证码" required>
          <Space>
            <Input v-model:value="newPhoneForm.code" placeholder="请输入验证码" style="width: 120px" />
            <Button>获取验证码</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      v-model:open="changeEmailModalVisible"
      title="更换邮箱"
      @ok="handleChangeEmail"
      :loading="loading"
    >
      <Form :model="newEmailForm" layout="vertical">
        <Form.Item label="新邮箱地址" required>
          <Input v-model:value="newEmailForm.email" placeholder="请输入新邮箱地址" />
        </Form.Item>
        <Form.Item label="验证码" required>
          <Space>
            <Input v-model:value="newEmailForm.code" placeholder="请输入验证码" style="width: 120px" />
            <Button>获取验证码</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<style scoped>
.tab-content {
  margin-top: 24px;
}

.profile-card {
  text-align: center;
  padding: 20px;
}

.avatar-section {
  position: relative;
  display: inline-block;
}

.avatar-section :deep(.ant-upload) {
  position: relative;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.avatar-section:hover .avatar-mask {
  opacity: 1;
}

.username {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.role {
  color: #999;
  font-size: 14px;
  margin-top: 4px;
}

.info-list {
  text-align: left;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: rgba(0, 0, 0, 0.65);
}

.info-icon {
  margin-right: 12px;
  color: #1890ff;
}

.tags-section {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bind-list {
  padding: 8px 0;
}

.bind-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

html[data-theme='dark'] .username {
  color: rgba(255, 255, 255, 0.85);
}

html[data-theme='dark'] .info-item {
  color: rgba(255, 255, 255, 0.65);
}

html[data-theme='dark'] .device-item {
  background: #1f1f1f;
}
</style>
