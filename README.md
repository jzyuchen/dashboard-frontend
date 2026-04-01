# 中台产品框架

基于 Vue 3 + Ant Design Vue v4 + TypeScript 的中台产品框架

## 技术栈

- **前端框架**: Vue 3.4 + Composition API
- **构建工具**: Vite 5
- **UI 组件库**: Ant Design Vue 4.x
- **路由管理**: Vue Router 4
- **状态管理**: Pinia 2
- **HTTP 客户端**: Axios
- **语言**: TypeScript 5
- **样式**: Less + CSS

## 项目结构

```
src
├── assets/              # 静态资源
├── components/         # 公共组件
├── layouts/            # 布局组件
│   ├── components/    # 布局子组件
│   │   ├── Header.vue  # 头部导航
│   │   ├── Sider.vue  # 侧边栏
│   │   └── Tabs.vue   # 标签页
│   └── main/          # 主布局
├── router/            # 路由配置
├── store/             # 状态管理
│   ├── user.ts       # 用户状态
│   ├── permission.ts # 权限状态
│   └── settings.ts   # 设置状态
├── styles/            # 全局样式
├── utils/             # 工具函数
│   ├── request.ts    # Axios 封装
│   ├── types.ts      # 类型定义
│   └── index.ts      # 工具函数库
├── views/             # 页面组件
│   ├── login/        # 登录页
│   ├── dashboard/    # 工作台
│   ├── system/      # 系统管理
│   │   ├── user/    # 用户管理
│   │   ├── role/    # 角色管理
│   │   └── menu/    # 菜单管理
│   └── error/       # 错误页面
├── App.vue           # 根组件
└── main.ts          # 入口文件
```

## 主要功能

### 🎨 布局系统
- 响应式侧边栏（可折叠）
- 固定头部导航
- 标签页切换
- 面包屑导航

### 🔐 权限管理
- 基于角色的权限控制（RBAC）
- 动态路由生成
- 按钮级权限控制

### 📊 状态管理
- 用户信息管理
- 权限路由管理
- 系统设置管理

### 🌐 请求封装
- 统一错误处理
- 请求拦截器（Token 自动注入）
- 响应拦截器

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 类型检查

```bash
npm run type-check
```

## 登录说明

框架使用模拟登录，可使用以下账号登录：

- 用户名: `admin`
- 密码: `123456`

## 开发指南

### 添加新页面

1. 在 `src/views` 目录下创建页面组件
2. 在 `src/router/index.ts` 中配置路由
3. 在权限菜单中添加菜单配置

### 添加新组件

1. 在 `src/components` 目录下创建组件
2. 如需全局注册，在 `src/components/index.ts` 中导出

### 使用状态管理

```typescript
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const { token, userInfo } = storeToRefs(userStore)
```

### 使用工具函数

```typescript
import { formatDate, deepClone, debounce } from '@/utils'

formatDate(new Date())
deepClone(obj)
debounce(fn, 300)
```

## 配置说明

### 环境变量

- `.env` - 通用配置
- `.env.development` - 开发环境
- `.env.production` - 生产环境

### 主题配置

在 `src/store/settings.ts` 中配置主题颜色、圆角等。

## License

MIT
