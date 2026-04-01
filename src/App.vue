<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useSettingsStore } from '@/store/settings'
import { computed } from 'vue'

const settingsStore = useSettingsStore()

const antdTheme = computed(() => {
  const isDark = settingsStore.theme.theme === 'dark'
  
  return {
    token: {
      colorPrimary: settingsStore.theme.primaryColor,
      borderRadius: settingsStore.theme.borderRadius,
      colorBgContainer: isDark ? '#141414' : '#ffffff',
      colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
      colorBgLayout: isDark ? '#000000' : '#f0f2f5',
      colorBgSpotlight: isDark ? '#262626' : '#ffffff',
      colorText: isDark ? '#ffffff' : 'rgba(0, 0, 0, 0.88)',
      colorTextSecondary: isDark ? '#a6a6a6' : 'rgba(0, 0, 0, 0.65)',
      colorTextTertiary: isDark ? '#8c8c8c' : 'rgba(0, 0, 0, 0.45)',
      colorTextQuaternary: isDark ? '#595959' : 'rgba(0, 0, 0, 0.25)',
      colorBorder: isDark ? '#434343' : '#d9d9d9',
      colorBorderSecondary: isDark ? '#303030' : '#f0f0f0',
    },
    algorithm: isDark ? theme.darkAlgorithm : undefined,
  }
})
</script>

<template>
  <ConfigProvider
    :locale="zhCN"
    :theme="antdTheme"
  >
    <router-view />
  </ConfigProvider>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
