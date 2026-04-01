<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import { useSettingsStore } from '@/store/settings'
import dayjs from 'dayjs'

const props = defineProps<{
  range?: string
}>()

const settingsStore = useSettingsStore()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const selectedRange = computed(() => props.range || 'week')

const chartData = computed(() => {
  const range = selectedRange.value
  let days = 7
  if (range === 'month') days = 30
  if (range === 'quarter') days = 90

  const dates: string[] = []
  const orders: number[] = []
  const revenue: number[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day')
    dates.push(date.format('MM-DD'))
    orders.push(Math.floor(Math.random() * 200) + 50)
    revenue.push(Math.floor(Math.random() * 20000) + 5000)
  }

  return { dates, orders, revenue }
})

const initChart = () => {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const isDark = settingsStore.theme.theme === 'dark'
  const data = chartData.value

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['订单量', '销售额'],
      top: 0,
      textStyle: {
        color: isDark ? '#fff' : '#666',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.dates,
      axisLine: {
        lineStyle: {
          color: isDark ? '#434343' : '#d9d9d9',
        },
      },
      axisLabel: {
        color: isDark ? '#fff' : '#666',
        rotate: data.dates.length > 30 ? 45 : 0,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '订单量',
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#1890ff',
          },
        },
        axisLabel: {
          color: isDark ? '#fff' : '#666',
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#303030' : '#f0f0f0',
          },
        },
      },
      {
        type: 'value',
        name: '销售额',
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#52c41a',
          },
        },
        axisLabel: {
          color: isDark ? '#fff' : '#666',
          formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '订单量',
        type: 'line',
        smooth: true,
        data: data.orders,
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
          ]),
        },
      },
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: data.revenue,
        itemStyle: {
          color: '#52c41a',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
          ]),
        },
      },
    ],
  }

  chartInstance.setOption(option)
}

const resizeChart = () => {
  chartInstance?.resize()
}

watch(
  [() => settingsStore.theme.theme, chartData],
  () => {
    initChart()
  },
  { deep: true }
)

watch(
  () => props.range,
  () => {
    initChart()
  }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})
</script>

<template>
  <div ref="chartRef" class="order-chart"></div>
</template>

<style scoped>
.order-chart {
  width: 100%;
  height: 320px;
}
</style>
