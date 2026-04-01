import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppRouteRecordRaw } from '@/router'

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<AppRouteRecordRaw[]>([])
  const menuList = ref<any[]>([])

  const generateRoutes = async () => {
    const mockRoutes: AppRouteRecordRaw[] = [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '工作台',
          icon: 'DashboardOutlined',
          permission: ['dashboard'],
        },
      },
      {
        path: '/system',
        name: 'System',
        meta: {
          title: '系统管理',
          icon: 'SettingOutlined',
          permission: ['system'],
        },
        children: [
          {
            path: '/system/user',
            name: 'UserManagement',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
              title: '用户管理',
              permission: ['system:user'],
            },
          },
          {
            path: '/system/role',
            name: 'RoleManagement',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
              title: '角色管理',
              permission: ['system:role'],
            },
          },
          {
            path: '/system/menu',
            name: 'MenuManagement',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
              title: '菜单管理',
              permission: ['system:menu'],
            },
          },
        ],
      },
    ]

    routes.value = mockRoutes

    menuList.value = mockRoutes.map(route => ({
      path: route.path,
      name: route.name,
      meta: route.meta,
      children: route.children?.map(child => ({
        path: child.path,
        name: child.name,
        meta: child.meta,
      }))
    }))

    return mockRoutes
  }

  const setRoutes = (newRoutes: AppRouteRecordRaw[]) => {
    routes.value = newRoutes
  }

  const resetRoutes = () => {
    routes.value = []
    menuList.value = []
  }

  return {
    routes,
    menuList,
    generateRoutes,
    setRoutes,
    resetRoutes,
  }
})
