import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  id: string
  username: string
  name: string
  avatar?: string
  email?: string
  phone?: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  const login = async (username: string, password: string) => {
    const mockToken = 'mock-token-' + Date.now()
    const mockUserInfo: UserInfo = {
      id: '1',
      username,
      name: username,
      roles: ['admin'],
      permissions: ['dashboard', 'system', 'system:user', 'system:role', 'system:menu'],
    }

    setToken(mockToken)
    setUserInfo(mockUserInfo)

    return { token: mockToken, userInfo: mockUserInfo }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  const initUserInfo = () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!userInfo.value) return false
    return userInfo.value.permissions.includes(permission)
  }

  const hasRole = (role: string): boolean => {
    if (!userInfo.value) return false
    return userInfo.value.roles.includes(role)
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    login,
    logout,
    initUserInfo,
    hasPermission,
    hasRole,
  }
})
