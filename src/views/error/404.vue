<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}

const handleGoBack = () => {
  router.back()
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-title">抱歉，您访问的页面不存在</div>
      <div class="error-description">
        请检查您输入的网址是否正确，或点击下面的按钮返回首页
      </div>
      <div class="error-actions">
        <Button type="primary" size="large" @click="handleGoHome">
          返回首页
        </Button>
        <Button size="large" @click="handleGoBack">
          返回上一页
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.error-content {
  text-align: center;
  padding: 48px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #1890ff;
  line-height: 1.2;
  margin-bottom: 24px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.error-description {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
