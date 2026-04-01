<script setup lang="ts">
import { ref } from 'vue'
import { Tabs } from 'ant-design-vue'
import { CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import type { TabsProps } from 'ant-design-vue'

const activeKey = ref('dashboard')

const tabItems: TabsProps['items'] = [
  {
    key: 'dashboard',
    label: '工作台',
  },
  {
    key: 'user',
    label: '用户管理',
  },
]

const handleEdit: TabsProps['onEdit'] = (targetKey, action) => {
  if (action === 'remove') {
    console.log('remove tab:', targetKey)
  }
}
</script>

<template>
  <div class="app-tabs">
    <Tabs
      v-model:activeKey="activeKey"
      type="editable-card"
      :items="tabItems"
      @edit="handleEdit"
      hide-add
    />
  </div>
</template>

<style scoped>
.app-tabs {
  background: #ffffff;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

:deep(.ant-tabs-tab) {
  border: 1px solid #d9d9d9 !important;
  margin-right: 4px !important;
  background: #fafafa !important;
}

:deep(.ant-tabs-tab-active) {
  background: #ffffff !important;
  border-bottom: 1px solid #ffffff !important;
}

html[data-theme='dark'] .app-tabs {
  background: #141414;
  border-bottom: 1px solid #303030;
}

html[data-theme='dark'] :deep(.ant-tabs-tab) {
  border-color: #303030 !important;
  background: #1f1f1f !important;
}

html[data-theme='dark'] :deep(.ant-tabs-tab-active) {
  background: #141414 !important;
  border-bottom-color: #141414 !important;
}
</style>
