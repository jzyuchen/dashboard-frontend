<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Breadcrumb, Dropdown, Avatar, Space, Button, Badge, Tooltip } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import { BellOutlined, SettingOutlined, UserOutlined, LogoutOutlined, BulbOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'
import { useSettingsStore } from '@/store/settings'

const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const isDark = computed(() => settingsStore.theme.theme === 'dark')

const breadcrumbItems = computed(() => {
  const matched = router.currentRoute.value.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({
    title: item.meta?.title as string,
  }))
})

const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    label: '个人中心',
  },
  {
    key: 'settings',
    label: '系统设置',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: '退出登录',
    danger: true,
  },
]

const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
  if (key === 'logout') {
    userStore.logout()
    router.push('/login')
  } else if (key === 'profile') {
    router.push('/profile')
  } else if (key === 'settings') {
    router.push('/settings')
  }
}

const toggleSidebar = () => {
  settingsStore.setLayoutConfig({
    compactSidebar: !settingsStore.layout.compactSidebar,
  })
}

const toggleTheme = () => {
  settingsStore.toggleTheme()
}
</script>

<template>
  <a-layout-header class="app-header">
    <div class="header-left">
      <Button
        type="text"
        @click="toggleSidebar"
        class="menu-toggle"
      >
        <template #icon>
          <span class="menu-icon">☰</span>
        </template>
      </Button>
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item.title">
          {{ item.title }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="header-right">
      <Space size="middle">
        <Tooltip :title="isDark ? '日间模式' : '夜间模式'">
          <Button type="text" @click="toggleTheme">
            <template #icon>
              <BulbOutlined :style="{ fontSize: '18px', color: isDark ? '#faad14' : '#1890ff' }" />
            </template>
          </Button>
        </Tooltip>
        <Badge :count="3" :offset="[-2, 2]">
          <Button type="text" @click="router.push('/notifications')">
            <BellOutlined style="font-size: 18px" />
          </Button>
        </Badge>
        <Dropdown :trigger="['click']">
          <Space class="user-info">
            <Avatar :src="userStore.userInfo?.avatar" :size="32">
              {{ userStore.userInfo?.name?.charAt(0) || 'U' }}
            </Avatar>
            <span class="username">{{ userStore.userInfo?.name || '用户' }}</span>
          </Space>
          <template #overlay>
            <a-menu @click="handleUserMenuClick" :items="userMenuItems" />
          </template>
        </Dropdown>
      </Space>
    </div>
  </a-layout-header>
</template>

<style scoped>
.app-header {
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(29, 35, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  margin-right: 16px;
  font-size: 18px;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.user-info:hover {
  background: rgba(0, 0, 0, 0.028);
}

.username {
  font-size: 14px;
}

html[data-theme='dark'] .app-header {
  background: #141414;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
}
</style>
