<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Row, Col, Card, Statistic, Table, List, Avatar, Tag, Progress, Select } from 'ant-design-vue'
import {
  UserOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
import OrderTrendChart from '@/components/OrderTrendChart.vue'
import { formatDate } from '@/utils'

const loading = ref(false)
const chartRange = ref('week')
const chartRangeOptions = [
  { label: '近7天', value: 'week' },
  { label: '近30天', value: 'month' },
  { label: '近90天', value: 'quarter' },
]

const statsData = ref([
  {
    title: '总用户数',
    value: 10248,
    icon: UserOutlined,
    suffix: '人',
    trend: 12.5,
  },
  {
    title: '今日订单',
    value: 1568,
    icon: ShoppingCartOutlined,
    suffix: '单',
    trend: 8.2,
  },
  {
    title: '总收入',
    value: 258960,
    icon: DollarOutlined,
    suffix: '元',
    trend: 15.3,
  },
  {
    title: '待处理',
    value: 89,
    icon: ClockCircleOutlined,
    suffix: '件',
    trend: -3.5,
  },
])

const recentOrders = ref([
  { id: 1, user: '张三', product: 'iPhone 15 Pro', amount: 8999, status: 'completed', time: Date.now() - 100000 },
  { id: 2, user: '李四', product: 'MacBook Pro', amount: 15999, status: 'pending', time: Date.now() - 200000 },
  { id: 3, user: '王五', product: 'AirPods Pro', amount: 1899, status: 'completed', time: Date.now() - 300000 },
  { id: 4, user: '赵六', product: 'iPad Air', amount: 4599, status: 'processing', time: Date.now() - 400000 },
])

const orderColumns = [
  { title: '订单号', dataIndex: 'id', key: 'id' },
  { title: '用户', dataIndex: 'user', key: 'user' },
  { title: '商品', dataIndex: 'product', key: 'product' },
  { title: '金额', dataIndex: 'amount', key: 'amount' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '时间', dataIndex: 'time', key: 'time' },
]

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    completed: 'success',
    pending: 'warning',
    processing: 'processing',
    cancelled: 'error',
  }
  return colorMap[status] || 'default'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    completed: '已完成',
    pending: '待处理',
    processing: '处理中',
    cancelled: '已取消',
  }
  return textMap[status] || status
}

const activities = ref([
  { id: 1, user: '系统管理员', action: '发布了新版本 v2.0', time: Date.now() - 60000 },
  { id: 2, user: '张三', action: '完成了订单 #12345', time: Date.now() - 120000 },
  { id: 3, user: '李四', action: '更新了个人信息', time: Date.now() - 180000 },
  { id: 4, user: '王五', action: '提交了工单 #789', time: Date.now() - 240000 },
])

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="dashboard-container">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="6" v-for="(stat, index) in statsData" :key="index">
        <Card :bordered="false" class="stat-card">
          <Statistic
            :value="stat.value"
            :suffix="stat.suffix"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <component :is="stat.icon" style="margin-right: 8px" />
            </template>
            <template #suffix>
              <span style="font-size: 14px; color: #999">{{ stat.suffix }}</span>
            </template>
          </Statistic>
          <div class="stat-footer">
            <span>{{ stat.title }}</span>
            <span :style="{ color: stat.trend >= 0 ? '#52c41a' : '#ff4d4f' }">
              <RiseOutlined :style="{ transform: stat.trend >= 0 ? 'rotate(0)' : 'rotate(180deg)' }" />
              {{ Math.abs(stat.trend) }}%
            </span>
          </div>
        </Card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :xs="24" :lg="16">
        <Card :bordered="false" class="card">
          <template #title>
            <div class="card-title">
              <span>订单趋势</span>
              <Select
                v-model:value="chartRange"
                :options="chartRangeOptions"
                style="width: 120px"
              />
            </div>
          </template>
          <OrderTrendChart :range="chartRange" />
        </Card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <Card title="产品销量" :bordered="false" class="card">
          <div class="progress-list">
            <div class="progress-item">
              <div class="progress-header">
                <span>iPhone 15 Pro</span>
                <span>1,256 件</span>
              </div>
              <Progress :percent="85" :show-info="false" />
            </div>
            <div class="progress-item">
              <div class="progress-header">
                <span>MacBook Pro</span>
                <span>856 件</span>
              </div>
              <Progress :percent="62" :show-info="false" status="active" />
            </div>
            <div class="progress-item">
              <div class="progress-header">
                <span>AirPods Pro</span>
                <span>2,156 件</span>
              </div>
              <Progress :percent="78" :show-info="false" status="exception" />
            </div>
            <div class="progress-item">
              <div class="progress-header">
                <span>iPad Air</span>
                <span>1,089 件</span>
              </div>
              <Progress :percent="92" :show-info="false" status="active" />
            </div>
          </div>
        </Card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :xs="24" :lg="16">
        <Card title="最近订单" :bordered="false" class="card">
          <Table
            :columns="orderColumns"
            :data-source="recentOrders"
            :pagination="false"
            :loading="loading"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusText(record.status) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'amount'">
                ¥{{ record.amount.toLocaleString() }}
              </template>
              <template v-else-if="column.key === 'time'">
                {{ formatDate(record.time) }}
              </template>
            </template>
          </Table>
        </Card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <Card title="最新动态" :bordered="false" class="card">
          <List
            :data-source="activities"
            :loading="loading"
          >
            <template #renderItem="{ item }">
              <List.Item>
                <List.Item.Meta>
                  <template #avatar>
                    <Avatar style="background-color: #1890ff">{{ item.user.charAt(0) }}</Avatar>
                  </template>
                  <template #title>
                    <span>{{ item.user }}</span>
                  </template>
                  <template #description>
                    <div>{{ item.action }}</div>
                    <div style="color: #999; font-size: 12px">{{ formatDate(item.time) }}</div>
                  </template>
                </List.Item.Meta>
              </List.Item>
            </template>
          </List>
        </Card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 24px;
}

.stat-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
</style>
