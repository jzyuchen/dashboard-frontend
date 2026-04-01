<script setup lang="ts">
import { ref, h } from 'vue'
import { Card, List, Avatar, Tag, Tabs, Empty, Space, Badge } from 'ant-design-vue'
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  CheckOutlined
} from '@ant-design/icons-vue'
import { formatDate } from '@/utils'

const activeKey = ref('all')
const loading = ref(false)

interface Notification {
  id: number
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  content: string
  time: number
  read: boolean
}

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'info',
    title: '系统通知',
    content: '系统将于今晚 22:00 进行例行维护，请提前保存数据。',
    time: Date.now() - 100000,
    read: false,
  },
  {
    id: 2,
    type: 'success',
    title: '订单完成',
    content: '您的订单 #12345 已完成支付，金额 ¥8999.00。',
    time: Date.now() - 300000,
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: '库存预警',
    content: '商品 "iPhone 15 Pro" 库存不足，当前剩余 5 件。',
    time: Date.now() - 600000,
    read: true,
  },
  {
    id: 4,
    type: 'info',
    title: '版本更新',
    content: '系统已更新至 v2.0.1 版本，新增多项功能优化。',
    time: Date.now() - 3600000,
    read: true,
  },
  {
    id: 5,
    type: 'success',
    title: '工单完成',
    content: '您提交的工单 #789 已处理完成，请查收。',
    time: Date.now() - 7200000,
    read: true,
  },
])

const unreadCount = ref(2)

const getTypeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    info: InfoCircleOutlined,
    success: CheckCircleOutlined,
    warning: WarningOutlined,
    error: ClockCircleOutlined,
  }
  return iconMap[type] || BellOutlined
}

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    info: 'blue',
    success: 'green',
    warning: 'orange',
    error: 'red',
  }
  return colorMap[type] || 'default'
}

const getTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    info: '信息',
    success: '成功',
    warning: '警告',
    error: '错误',
  }
  return tagMap[type] || '通知'
}

const handleMarkAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.read) {
    notification.read = true
    unreadCount.value--
  }
}

const handleMarkAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = false
  })
  unreadCount.value = notifications.value.length
}

const handleDelete = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    const notification = notifications.value[index]
    if (!notification.read) {
      unreadCount.value--
    }
    notifications.value.splice(index, 1)
  }
}

const handleDeleteAll = () => {
  notifications.value = []
  unreadCount.value = 0
}

const filteredNotifications = () => {
  if (activeKey.value === 'all') {
    return notifications.value
  } else if (activeKey.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  } else {
    return notifications.value.filter(n => n.read)
  }
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1>消息通知</h1>
      <p>查看和处理系统通知消息</p>
    </div>

    <Card :bordered="false">
      <div class="notification-header">
        <Space>
          <Badge :count="unreadCount" :offset="[10, 0]">
            <span class="unread-text">未读消息</span>
          </Badge>
        </Space>
        <Space>
          <Button @click="handleMarkAllAsRead">
            <CheckOutlined />
            全部标为已读
          </Button>
          <Button danger @click="handleDeleteAll">
            <DeleteOutlined />
            清空通知
          </Button>
        </Space>
      </div>

      <a-tabs v-model:activeKey="activeKey" class="notification-tabs">
        <a-tab-pane key="all">
          <template #tab>
            <span>全部通知</span>
          </template>
        </a-tab-pane>
        <a-tab-pane key="unread">
          <template #tab>
            <span>未读消息 <Badge :count="unreadCount" /></span>
          </template>
        </a-tab-pane>
        <a-tab-pane key="read">
          <template #tab>
            <span>已读消息</span>
          </template>
        </a-tab-pane>
      </a-tabs>

      <List
        :data-source="filteredNotifications()"
        :loading="loading"
      >
        <template #renderItem="{ item }">
          <List.Item
            class="notification-item"
            :class="{ unread: !item.read }"
          >
            <List.Item.Meta>
              <template #avatar>
                <Avatar
                  :style="{ backgroundColor: getTypeColor(item.type) }"
                  :icon="h(getTypeIcon(item.type))"
                />
              </template>
              <template #title>
                <Space>
                  <span>{{ item.title }}</span>
                  <Tag :color="getTypeColor(item.type)" size="small">
                    {{ getTypeTag(item.type) }}
                  </Tag>
                  <Badge v-if="!item.read" status="error" text="未读" />
                </Space>
              </template>
              <template #description>
                <div class="notification-content">{{ item.content }}</div>
                <div class="notification-time">
                  <ClockCircleOutlined style="margin-right: 4px" />
                  {{ formatDate(item.time) }}
                </div>
              </template>
            </List.Item.Meta>
            <template #actions>
              <Button
                v-if="!item.read"
                type="link"
                size="small"
                @click="handleMarkAsRead(item.id)"
              >
                <CheckOutlined />
                标为已读
              </Button>
              <Button
                type="link"
                size="small"
                danger
                @click="handleDelete(item.id)"
              >
                <DeleteOutlined />
                删除
              </Button>
            </template>
          </List.Item>
        </template>
      </List>
    </Card>
  </div>
</template>

<style scoped>
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.unread-text {
  font-size: 16px;
  font-weight: 600;
}

.notification-tabs {
  margin-bottom: 16px;
}

.notification-item {
  padding: 16px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-item.unread {
  background-color: #e6f7ff;
}

.notification-item.unread:hover {
  background-color: #bae7ff;
}

.notification-content {
  margin: 8px 0;
  color: rgba(0, 0, 0, 0.65);
}

.notification-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

[data-theme='dark'] .notification-item:hover {
  background-color: #262626;
}

[data-theme='dark'] .notification-item.unread {
  background-color: #111d2c;
}

[data-theme='dark'] .notification-item.unread:hover {
  background-color: #0d1521;
}
</style>
