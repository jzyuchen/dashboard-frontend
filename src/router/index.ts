import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import type { RouteMeta } from 'vue-router'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'

export interface AppRouteRecordRaw extends RouteRecordRaw {
  meta?: RouteMeta & {
    title?: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
    permission?: string[]
  }
}

const routes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/dashboard',
    meta: {
      title: '主布局',
    },
    children: [
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
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'UserOutlined',
        },
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: {
          title: '系统设置',
          icon: 'ToolOutlined',
        },
      },
      {
        path: '/notifications',
        name: 'Notifications',
        component: () => import('@/views/notifications/index.vue'),
        meta: {
          title: '消息通知',
          icon: 'BellOutlined',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hidden: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (to.path === '/login') {
    next()
    return
  }

  if (!userStore.token && import.meta.env.DEV) {
    await userStore.login('admin', '123456')
  }

  if (!userStore.token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (permissionStore.routes.length === 0) {
    try {
      await permissionStore.generateRoutes()
    } catch (error) {
      console.error('Failed to generate routes:', error)
    }
  }

  next()
})

export default router
