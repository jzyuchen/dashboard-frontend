<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Card, Form, Input, Switch, Button, Select, Tabs, Divider, message, Tag, Space } from 'ant-design-vue'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()
const activeKey = ref('general')
const loading = ref(false)

const generalSettings = reactive({
  siteName: '中台产品框架',
  siteDescription: '基于 Vue 3 + Ant Design Vue 的中台解决方案',
  logo: '',
  favicon: '',
})

const themeSettings = reactive({
  primaryColor: settingsStore.theme.primaryColor,
  darkMode: settingsStore.theme.theme === 'dark',
  borderRadius: settingsStore.theme.borderRadius,
  compactMode: false,
})

const layoutSettings = reactive({
  fixedHeader: settingsStore.layout.fixedHeader,
  fixedSidebar: settingsStore.layout.fixedSidebar,
  splitMenu: settingsStore.layout.splitMenu,
  compactSidebar: settingsStore.layout.compactSidebar,
})

const notificationSettings = reactive({
  emailNotification: true,
  systemNotification: true,
  orderNotification: true,
  messageNotification: true,
})

const securitySettings = reactive({
  sessionTimeout: 30,
  loginRetryLimit: 5,
  passwordExpiration: 90,
  twoFactorAuth: false,
})

const paymentSettings = reactive({
  alipayEnabled: true,
  wechatPayEnabled: true,
  unionPayEnabled: false,
  paymentCallbackUrl: '',
  refundCallbackUrl: '',
  merchantId: '',
  appId: '',
})

const smsSettings = reactive({
  aliyunSmsEnabled: false,
  tencentSmsEnabled: true,
  accessKeyId: '',
  accessKeySecret: '',
  signName: '',
  templateCodes: {
    verification: '',
    notification: '',
    marketing: '',
  },
})

const pushSettings = reactive({
  jPushEnabled: false,
  getuiEnabled: false,
  fcmEnabled: false,
  appKey: '',
  masterSecret: '',
  iosProduction: true,
})

watch(
  () => themeSettings.darkMode,
  (newValue) => {
    if (newValue !== (settingsStore.theme.theme === 'dark')) {
      settingsStore.toggleTheme()
    }
  }
)

watch(
  () => themeSettings.primaryColor,
  (newValue) => {
    settingsStore.setThemeConfig({ primaryColor: newValue })
  }
)

watch(
  () => themeSettings.borderRadius,
  (newValue) => {
    settingsStore.setThemeConfig({ borderRadius: newValue })
  }
)

watch(
  () => layoutSettings,
  (newValue) => {
    settingsStore.setLayoutConfig(newValue)
  },
  { deep: true }
)

const handleSave = async (section: string) => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success(`${section}设置保存成功`)
  } catch (error) {
    message.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  themeSettings.primaryColor = '#1890ff'
  themeSettings.darkMode = false
  themeSettings.borderRadius = 4
  message.success('已恢复默认设置')
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>系统设置</h1>
      <p>配置系统全局设置和偏好选项</p>
    </div>

    <Card :bordered="false">
      <a-tabs v-model:activeKey="activeKey" tab-position="left" class="settings-tabs">
        <a-tab-pane key="general">
          <template #tab>
            <span>通用设置</span>
          </template>
          
          <div class="settings-section">
            <h3 class="section-title">通用设置</h3>
            <p class="section-desc">配置系统基本信息和全局选项</p>
            
            <Form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <Form.Item label="系统名称">
                <Input v-model:value="generalSettings.siteName" placeholder="请输入系统名称" />
              </Form.Item>
              
              <Form.Item label="系统描述">
                <Input.TextArea
                  v-model:value="generalSettings.siteDescription"
                  :rows="3"
                  placeholder="请输入系统描述"
                />
              </Form.Item>
              
              <Form.Item :wrapper-col="{ span: 16, offset: 6 }">
                <Button type="primary" :loading="loading" @click="handleSave('通用')">
                  <SaveOutlined />
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="theme">
          <template #tab>
            <span>主题设置</span>
          </template>
          
          <div class="settings-section">
            <h3 class="section-title">主题设置</h3>
            <p class="section-desc">自定义系统主题颜色和显示效果</p>
            
            <Form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
              <Form.Item label="主题色">
                <div class="color-picker-wrapper">
                  <input
                    type="color"
                    v-model="themeSettings.primaryColor"
                    class="color-picker"
                  />
                  <span class="color-value">{{ themeSettings.primaryColor }}</span>
                </div>
              </Form.Item>
              
              <Form.Item label="暗色模式">
                <Switch v-model:checked="themeSettings.darkMode" />
              </Form.Item>
              
              <Form.Item label="圆角设置">
                <Select v-model:value="themeSettings.borderRadius" style="width: 200px">
                  <a-select-option :value="0">无圆角</a-select-option>
                  <a-select-option :value="2">2px</a-select-option>
                  <a-select-option :value="4">4px</a-select-option>
                  <a-select-option :value="8">8px</a-select-option>
                </Select>
              </Form.Item>
              
              <Form.Item :wrapper-col="{ span: 16, offset: 6 }">
                <Space>
                  <Button type="primary" :loading="loading" @click="handleSave('主题')">
                    <SaveOutlined />
                    保存设置
                  </Button>
                  <Button @click="handleReset">
                    <ReloadOutlined />
                    恢复默认
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="layout">
          <template #tab>
            <span>布局设置</span>
          </template>
          
          <div class="settings-section">
            <h3 class="section-title">布局设置</h3>
            <p class="section-desc">配置系统布局和导航选项</p>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="固定头部">
                <Switch v-model:checked="layoutSettings.fixedHeader" />
                <span class="setting-hint">头部导航栏固定在页面顶部</span>
              </Form.Item>
              
              <Form.Item label="固定侧边栏">
                <Switch v-model:checked="layoutSettings.fixedSidebar" />
                <span class="setting-hint">侧边菜单固定在页面左侧</span>
              </Form.Item>
              
              <Form.Item label="分割菜单">
                <Switch v-model:checked="layoutSettings.splitMenu" />
                <span class="setting-hint">顶部和侧边栏同时显示菜单</span>
              </Form.Item>
              
              <Form.Item label="紧凑模式">
                <Switch v-model:checked="layoutSettings.compactSidebar" />
                <span class="setting-hint">侧边栏收起为紧凑模式</span>
              </Form.Item>
              
              <Form.Item :wrapper-col="{ span: 14, offset: 8 }">
                <Button type="primary" :loading="loading" @click="handleSave('布局')">
                  <SaveOutlined />
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="notification">
          <template #tab>
            <span>通知设置</span>
          </template>
          
          <div class="settings-section">
            <h3 class="section-title">通知设置</h3>
            <p class="section-desc">配置系统通知和消息推送</p>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="邮件通知">
                <Switch v-model:checked="notificationSettings.emailNotification" />
              </Form.Item>
              
              <Form.Item label="系统通知">
                <Switch v-model:checked="notificationSettings.systemNotification" />
              </Form.Item>
              
              <Form.Item label="订单通知">
                <Switch v-model:checked="notificationSettings.orderNotification" />
              </Form.Item>
              
              <Form.Item label="消息通知">
                <Switch v-model:checked="notificationSettings.messageNotification" />
              </Form.Item>
              
              <Form.Item :wrapper-col="{ span: 14, offset: 8 }">
                <Button type="primary" :loading="loading" @click="handleSave('通知')">
                  <SaveOutlined />
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="security">
          <template #tab>
            <span>安全设置</span>
          </template>
          
          <div class="settings-section">
            <h3 class="section-title">安全设置</h3>
            <p class="section-desc">配置系统安全策略和权限</p>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="会话超时">
                <Select v-model:value="securitySettings.sessionTimeout" style="width: 200px">
                  <a-select-option :value="15">15 分钟</a-select-option>
                  <a-select-option :value="30">30 分钟</a-select-option>
                  <a-select-option :value="60">1 小时</a-select-option>
                  <a-select-option :value="120">2 小时</a-select-option>
                </Select>
              </Form.Item>
              
              <Form.Item label="登录重试限制">
                <Select v-model:value="securitySettings.loginRetryLimit" style="width: 200px">
                  <a-select-option :value="3">3 次</a-select-option>
                  <a-select-option :value="5">5 次</a-select-option>
                  <a-select-option :value="10">10 次</a-select-option>
                </Select>
              </Form.Item>
              
              <Form.Item label="密码过期时间">
                <Select v-model:value="securitySettings.passwordExpiration" style="width: 200px">
                  <a-select-option :value="30">30 天</a-select-option>
                  <a-select-option :value="60">60 天</a-select-option>
                  <a-select-option :value="90">90 天</a-select-option>
                  <a-select-option :value="0">永不过期</a-select-option>
                </Select>
              </Form.Item>
              
              <Form.Item label="两步验证">
                <Switch v-model:checked="securitySettings.twoFactorAuth" />
              </Form.Item>
              
              <Form.Item :wrapper-col="{ span: 14, offset: 8 }">
                <Button type="primary" :loading="loading" @click="handleSave('安全')">
                  <SaveOutlined />
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="payment">
          <template #tab>
            <span>支付设置</span>
          </template>
          
          <div class="settings-section">
            <h3 class="section-title">支付设置</h3>
            <p class="section-desc">配置第三方支付渠道和参数</p>
            
            <Divider orientation="left">支付渠道</Divider>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="支付宝">
                <Space>
                  <Switch v-model:checked="paymentSettings.alipayEnabled" />
                  <Tag :color="paymentSettings.alipayEnabled ? 'green' : 'default'">
                    {{ paymentSettings.alipayEnabled ? '已启用' : '已禁用' }}
                  </Tag>
                </Space>
              </Form.Item>
              
              <Form.Item label="微信支付">
                <Space>
                  <Switch v-model:checked="paymentSettings.wechatPayEnabled" />
                  <Tag :color="paymentSettings.wechatPayEnabled ? 'green' : 'default'">
                    {{ paymentSettings.wechatPayEnabled ? '已启用' : '已禁用' }}
                  </Tag>
                </Space>
              </Form.Item>
              
              <Form.Item label="银联支付">
                <Space>
                  <Switch v-model:checked="paymentSettings.unionPayEnabled" />
                  <Tag :color="paymentSettings.unionPayEnabled ? 'green' : 'default'">
                    {{ paymentSettings.unionPayEnabled ? '已启用' : '已禁用' }}
                  </Tag>
                </Space>
              </Form.Item>
            </Form>
            
            <Divider orientation="left">商户配置</Divider>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="商户号">
                <Input v-model:value="paymentSettings.merchantId" placeholder="请输入商户号" />
              </Form.Item>
              
              <Form.Item label="应用ID">
                <Input v-model:value="paymentSettings.appId" placeholder="请输入应用ID" />
              </Form.Item>
              
              <Form.Item label="支付回调地址">
                <Input v-model:value="paymentSettings.paymentCallbackUrl" placeholder="请输入支付回调地址" />
              </Form.Item>
              
              <Form.Item label="退款回调地址">
                <Input v-model:value="paymentSettings.refundCallbackUrl" placeholder="请输入退款回调地址" />
              </Form.Item>
              
              <Form.Item :wrapper-col="{ span: 14, offset: 8 }">
                <Button type="primary" :loading="loading" @click="handleSave('支付')">
                  <SaveOutlined />
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="sms">
          <template #tab>
            <span>短信设置</span>
          </template>
          
          <div class="settings-section">
            <h3 class="section-title">短信设置</h3>
            <p class="section-desc">配置短信服务商和模板</p>
            
            <Divider orientation="left">短信服务商</Divider>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="阿里云短信">
                <Space>
                  <Switch v-model:checked="smsSettings.aliyunSmsEnabled" />
                  <Tag :color="smsSettings.aliyunSmsEnabled ? 'green' : 'default'">
                    {{ smsSettings.aliyunSmsEnabled ? '已启用' : '已禁用' }}
                  </Tag>
                </Space>
              </Form.Item>
              
              <Form.Item label="腾讯云短信">
                <Space>
                  <Switch v-model:checked="smsSettings.tencentSmsEnabled" />
                  <Tag :color="smsSettings.tencentSmsEnabled ? 'green' : 'default'">
                    {{ smsSettings.tencentSmsEnabled ? '已启用' : '已禁用' }}
                  </Tag>
                </Space>
              </Form.Item>
            </Form>
            
            <Divider orientation="left">API 配置</Divider>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="AccessKey ID">
                <Input v-model:value="smsSettings.accessKeyId" placeholder="请输入 AccessKey ID" />
              </Form.Item>
              
              <Form.Item label="AccessKey Secret">
                <Input.Password v-model:value="smsSettings.accessKeySecret" placeholder="请输入 AccessKey Secret" />
              </Form.Item>
              
              <Form.Item label="短信签名">
                <Input v-model:value="smsSettings.signName" placeholder="请输入短信签名" />
              </Form.Item>
            </Form>
            
            <Divider orientation="left">模板配置</Divider>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="验证码模板">
                <Input v-model:value="smsSettings.templateCodes.verification" placeholder="请输入验证码模板ID" />
              </Form.Item>
              
              <Form.Item label="通知模板">
                <Input v-model:value="smsSettings.templateCodes.notification" placeholder="请输入通知模板ID" />
              </Form.Item>
              
              <Form.Item label="营销模板">
                <Input v-model:value="smsSettings.templateCodes.marketing" placeholder="请输入营销模板ID" />
              </Form.Item>
              
              <Form.Item :wrapper-col="{ span: 14, offset: 8 }">
                <Button type="primary" :loading="loading" @click="handleSave('短信')">
                  <SaveOutlined />
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="push">
          <template #tab>
            <span>推送设置</span>
          </template>
          
          <div class="settings-section">
            <h3 class="section-title">推送设置</h3>
            <p class="section-desc">配置消息推送服务商</p>
            
            <Divider orientation="left">推送渠道</Divider>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="极光推送">
                <Space>
                  <Switch v-model:checked="pushSettings.jPushEnabled" />
                  <Tag :color="pushSettings.jPushEnabled ? 'green' : 'default'">
                    {{ pushSettings.jPushEnabled ? '已启用' : '已禁用' }}
                  </Tag>
                </Space>
              </Form.Item>
              
              <Form.Item label="个推">
                <Space>
                  <Switch v-model:checked="pushSettings.getuiEnabled" />
                  <Tag :color="pushSettings.getuiEnabled ? 'green' : 'default'">
                    {{ pushSettings.getuiEnabled ? '已启用' : '已禁用' }}
                  </Tag>
                </Space>
              </Form.Item>
              
              <Form.Item label="Firebase Cloud Messaging">
                <Space>
                  <Switch v-model:checked="pushSettings.fcmEnabled" />
                  <Tag :color="pushSettings.fcmEnabled ? 'green' : 'default'">
                    {{ pushSettings.fcmEnabled ? '已启用' : '已禁用' }}
                  </Tag>
                </Space>
              </Form.Item>
            </Form>
            
            <Divider orientation="left">推送配置</Divider>
            
            <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <Form.Item label="AppKey">
                <Input v-model:value="pushSettings.appKey" placeholder="请输入 AppKey" />
              </Form.Item>
              
              <Form.Item label="MasterSecret">
                <Input.Password v-model:value="pushSettings.masterSecret" placeholder="请输入 MasterSecret" />
              </Form.Item>
              
              <Form.Item label="iOS 生产环境">
                <Switch v-model:checked="pushSettings.iosProduction" />
                <span class="setting-hint">关闭则使用开发环境证书</span>
              </Form.Item>
              
              <Form.Item :wrapper-col="{ span: 14, offset: 8 }">
                <Button type="primary" :loading="loading" @click="handleSave('推送')">
                  <SaveOutlined />
                  保存设置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </Card>
  </div>
</template>

<style scoped>
.settings-tabs {
  min-height: 600px;
}

.settings-tabs :deep(.ant-tabs-tab) {
  margin: 0;
  padding: 12px 24px;
  text-align: left;
}

.settings-section {
  padding: 24px;
  max-width: 800px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.section-desc {
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 24px;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-picker {
  width: 80px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.color-value {
  font-family: monospace;
  color: rgba(0, 0, 0, 0.65);
}

.setting-hint {
  margin-left: 12px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

[data-theme='dark'] .section-title {
  color: rgba(255, 255, 255, 0.85);
}
</style>
