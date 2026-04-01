<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/Header.vue'
import AppSider from '../components/Sider.vue'
import AppTabs from '../components/Tabs.vue'
import { useSettingsStore } from '@/store/settings'

const route = useRoute()
const settingsStore = useSettingsStore()

const containerClass = computed(() => ({
  'app-container': true,
  'fixed-header': settingsStore.layout.fixedHeader,
  'fixed-sidebar': settingsStore.layout.fixedSidebar,
  'compact-sidebar': settingsStore.layout.compactSidebar,
}))
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: settingsStore.theme.primaryColor,
      },
    }"
  >
    <a-layout class="app-layout">
      <AppSider v-if="settingsStore.layout.fixedSidebar" />
      <a-layout class="main-layout">
        <AppHeader />
        <AppTabs v-if="settingsStore.layout.fixedHeader" />
        <a-layout-content class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.main-layout {
  min-height: 100vh;
}

.main-content {
  margin: 0;
  min-height: calc(100vh - 64px);
  padding: 0;
  background: #f0f2f5;
  transition: background 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
