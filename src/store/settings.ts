import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface ThemeConfig {
  primaryColor: string
  borderRadius: number
  theme: 'light' | 'dark'
}

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<ThemeConfig>({
    primaryColor: '#1890ff',
    borderRadius: 4,
    theme: 'light',
  })

  const layout = ref<{
    fixedHeader: boolean
    fixedSidebar: boolean
    splitMenu: boolean
    compactSidebar: boolean
  }>({
    fixedHeader: true,
    fixedSidebar: true,
    splitMenu: false,
    compactSidebar: false,
  })

  const setThemeConfig = (config: Partial<ThemeConfig>) => {
    theme.value = { ...theme.value, ...config }
  }

  const setLayoutConfig = (config: Partial<typeof layout.value>) => {
    layout.value = { ...layout.value, ...config }
  }

  const toggleTheme = () => {
    theme.value.theme = theme.value.theme === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  const applyTheme = () => {
    const isDark = theme.value.theme === 'dark'
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', theme.value.theme)
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      theme.value.theme = savedTheme
    }
    applyTheme()
  }

  return {
    theme,
    layout,
    setThemeConfig,
    setLayoutConfig,
    toggleTheme,
    initTheme,
  }
})
