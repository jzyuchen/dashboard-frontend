<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'
import { usePermissionStore } from '@/store/permission'
import { useSettingsStore } from '@/store/settings'

const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()

const selectedKeys = ref<string[]>([route.path])
const openKeys = ref<string[]>([])

watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath]
    const paths = newPath.split('/').filter(Boolean)
    openKeys.value = paths.map((_, index) => '/' + paths.slice(0, index + 1).join('/'))
  },
  { immediate: true }
)

const handleOpenChange = (keys: string[]) => {
  openKeys.value = keys
}

const getIcon = (icon: string) => {
  return (Icons as any)[icon] || Icons.DashboardOutlined
}

const menuItems = computed<MenuProps['items']>(() => {
  return permissionStore.menuList.map(item => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.path,
        icon: () => h(getIcon(item.meta?.icon || 'SettingOutlined')),
        label: item.meta?.title,
        children: item.children.map(child => ({
          key: child.path,
          label: child.meta?.title,
        })),
      }
    }
    return {
      key: item.path,
      icon: () => h(getIcon(item.meta?.icon || 'FileOutlined')),
      label: item.meta?.title,
    }
  })
})

const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  router.push(key)
}
</script>

<template>
  <a-layout-sider
    :width="208"
    :collapsed="settingsStore.layout.compactSidebar"
    :collapsed-width="80"
    :theme="'light'"
    :trigger="null"
    collapsible
    class="app-sider"
  >
    <div class="logo">
      <img src="/vite.svg" alt="logo" class="logo-img" />
      <h1 v-if="!settingsStore.layout.compactSidebar" class="logo-text">中台框架</h1>
    </div>
    <a-menu
      mode="inline"
      v-model:selectedKeys="selectedKeys"
      :open-keys="openKeys"
      :items="menuItems"
      @click="handleMenuClick"
      @open-change="handleOpenChange"
      class="side-menu"
    />
  </a-layout-sider>
</template>

<style scoped>
.app-sider {
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  margin-left: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
  white-space: nowrap;
}

.side-menu {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

html[data-theme='dark'] .logo {
  background: #141414;
  border-bottom-color: #303030;
}

html[data-theme='dark'] .logo-text {
  color: #1890ff;
}
</style>
