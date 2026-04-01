<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form, Input, Button, Card, message, Checkbox } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formState = ref({
  username: 'admin',
  password: '123456',
  remember: true,
})

const loading = ref(false)

const onFinish = async () => {
  loading.value = true
  try {
    await userStore.login(formState.value.username, formState.value.password)
    message.success('登录成功')
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (error) {
    message.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <Card class="login-card">
        <div class="login-header">
          <h1 class="title">中台产品框架</h1>
          <p class="subtitle">基于 Ant Design Vue v4</p>
        </div>

        <Form
          :model="formState"
          @finish="onFinish"
          class="login-form"
        >
          <Form.Item
            name="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
          >
            <Input
              v-model:value="formState.username"
              size="large"
              placeholder="用户名: admin"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </Input>
          </Form.Item>

          <Form.Item
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <Input.Password
              v-model:value="formState.password"
              size="large"
              placeholder="密码: 123456"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </Input.Password>
          </Form.Item>

          <Form.Item name="remember">
            <Checkbox v-model:checked="formState.remember">记住密码</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #1890ff 100%);
}

.login-content {
  width: 420px;
  padding: 20px;
}

.login-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #999999;
}

.login-form {
  margin-top: 24px;
}
</style>
