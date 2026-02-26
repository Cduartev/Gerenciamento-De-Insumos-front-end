<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap">
      <h1 class="text-h4 font-weight-bold mb-4 mb-sm-0 d-flex align-center">
        {{ t('dashboard.title', 'Dashboard') }}
      </h1>
      
      <div class="d-flex align-center">
        <v-menu v-model="menuNotificacoes" :close-on-content-click="false" location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" color="grey-darken-2" class="mr-4" v-bind="props">
              <v-badge
                v-if="notificationStore.unreadCount > 0"
                :content="notificationStore.unreadCount"
                color="error"
                floating
              >
                <v-icon>mdi-bell-outline</v-icon>
              </v-badge>
              <v-icon v-else>mdi-bell-outline</v-icon>
            </v-btn>
          </template>

          <v-card min-width="350" max-width="450" class="mt-2" elevation="4">
            <v-card-title class="d-flex justify-space-between align-center px-4 py-2 text-subtitle-1 font-weight-bold">
              {{ t('notifications.title') }}
              <v-btn
                v-if="notificationStore.notifications.length > 0"
                variant="text"
                size="small"
                color="primary"
                @click="notificationStore.markAllAsRead()"
              >
                {{ t('notifications.markAllRead') }}
              </v-btn>
            </v-card-title>
            
            <v-divider></v-divider>
            
            <v-list v-if="notificationStore.notifications.length > 0" class="pa-0" max-height="400" >
              <template v-for="(notif, idx) in notificationStore.notifications" :key="notif.id">
                <v-list-item
                  :class="{ 'bg-grey-lighten-4': !notif.read && !theme.global.current.value.dark, 'bg-grey-darken-3': !notif.read && theme.global.current.value.dark }"
                  class="py-3 px-4"
                  @click="notificationStore.markAsRead(notif.id)"
                >
                  <template v-slot:prepend>
                    <v-icon
                      :color="notif.type === 'error' ? 'error' : notif.type === 'warning' ? 'warning' : 'info'"
                      :icon="notif.type === 'error' ? 'mdi-alert-circle' : notif.type === 'warning' ? 'mdi-alert' : 'mdi-information'"
                      size="large"
                      class="mr-3"
                    ></v-icon>
                  </template>

                  <v-list-item-title class="font-weight-medium text-body-2 mb-1" style="white-space: normal">
                    {{ notif.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption" style="white-space: normal">
                    {{ notif.message }}
                  </v-list-item-subtitle>
                  
                  <template v-slot:append>
                    <v-btn
                      icon="mdi-close"
                      variant="text"
                      size="small"
                      color="grey"
                      @click.stop="notificationStore.removeNotification(notif.id)"
                    />
                  </template>
                </v-list-item>
                <v-divider v-if="idx < notificationStore.notifications.length - 1"></v-divider>
              </template>
            </v-list>
            
            <div v-else class="pa-6 text-center text-grey-darken-1 text-body-2">
              <v-icon icon="mdi-bell-sleep" size="large" class="mb-2"></v-icon>
              <div>{{ t('notifications.empty') }}</div>
            </div>
          </v-card>
        </v-menu>

        <v-chip color="primary" variant="flat" size="large">
          <v-icon start>mdi-account</v-icon>
          {{ user?.name || '' }} ({{ user?.role }})
        </v-chip>
      </div>
    </div>

    <!-- Overview Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4 border-l-primary rounded-lg" border="s-md">
          <div class="d-flex justify-space-between align-center">
            <div>
              <p class="text-subtitle-1 text-grey-darken-1 mb-1">{{ t('dashboard.totalProducts', 'Total Products') }}</p>
              <h2 class="text-h3 font-weight-bold">{{ products.length }}</h2>
            </div>
            <v-avatar color="primary-lighten-4" size="64" class="ml-4 flex-shrink-0">
              <v-icon color="primary" size="36">mdi-package-variant-closed</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4 border-l-success rounded-lg" border="s-md">
          <div class="d-flex justify-space-between align-center">
            <div>
              <p class="text-subtitle-1 text-grey-darken-1 mb-1">{{ t('dashboard.totalRawMaterials', 'Raw Materials Types') }}</p>
              <h2 class="text-h3 font-weight-bold">{{ rawMaterials.length }}</h2>
            </div>
            <v-avatar color="success-lighten-4" size="64" class="ml-4 flex-shrink-0">
              <v-icon color="success" size="36">mdi-leaf</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4 border-l-warning rounded-lg" border="s-md">
          <div class="d-flex justify-space-between align-center">
            <div>
              <p class="text-subtitle-1 text-grey-darken-1 mb-1">{{ t('dashboard.lowStock', 'Low Stock Items') }}</p>
              <h2 class="text-h3 font-weight-bold text-warning">{{ lowStockCount }}</h2>
            </div>
            <v-avatar color="warning-lighten-4" size="64" class="ml-4 flex-shrink-0">
              <v-icon color="warning" size="36">mdi-alert</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2" class="pa-4 rounded-lg fill-height">
          <h3 class="text-h6 font-weight-bold mb-4">{{ t('dashboard.stockLevels', 'Top 10 Raw Material Stock Levels') }}</h3>
          <div v-if="loading" class="d-flex justify-center my-10">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else style="height: 300px">
            <Bar :data="stockChartData" :options="barOptions" />
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4 rounded-lg fill-height">
          <h3 class="text-h6 font-weight-bold mb-4">{{ t('dashboard.productPrices', 'Top 5 Most Expensive Products') }}</h3>
          <div v-if="loading" class="d-flex justify-center my-10">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else style="height: 300px">
            <Doughnut :data="priceChartData" :options="doughnutOptions" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import * as productService from '@/services/productService'
import * as rawMaterialService from '@/services/rawMaterialService'
import type { Produto, MateriaPrima } from '@/types'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const { t } = useI18n()
const theme = useTheme()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const menuNotificacoes = ref(false)
const user = computed(() => authStore.user)
const loading = ref(true)

const products = ref<Produto[]>([])
const rawMaterials = ref<MateriaPrima[]>([])

const lowStockCount = computed(() => {
  return rawMaterials.value.filter(rm => rm.stockQuantity < 50).length
})

// Bar Chart - Stock Levels
const stockChartData = computed(() => {
  const top10 = [...rawMaterials.value].sort((a, b) => b.stockQuantity - a.stockQuantity).slice(0, 10)
  return {
    labels: top10.map(item => item.name),
    datasets: [
      {
        label: t('dashboard.stockQuantity', 'Stock Quantity'),
        backgroundColor: '#1976D2',
        data: top10.map(item => item.stockQuantity),
        borderRadius: 4
      }
    ]
  }
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

// Doughnut Chart - Product Prices
const priceChartData = computed(() => {
  const top5 = [...products.value].sort((a, b) => b.price - a.price).slice(0, 5)
  return {
    labels: top5.map(item => item.name),
    datasets: [
      {
        backgroundColor: ['#1976D2', '#4CAF50', '#FFC107', '#FF5252', '#9C27B0'],
        data: top5.map(item => item.price)
      }
    ]
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

onMounted(async () => {
  notificationStore.checkLowStock()
  try {
    const [prods, rms] = await Promise.all([
      productService.listarTodos(),
      rawMaterialService.listarTodas()
    ])
    products.value = prods
    rawMaterials.value = rms
  } catch (err) {
    console.error("Failed to load dashboard data", err)
  } finally {
    loading.value = false
  }
})

</script>

<style scoped>
.border-l-primary {
  border-left-color: #1976D2 !important;
}
.border-l-success {
  border-left-color: #4CAF50 !important;
}
.border-l-warning {
  border-left-color: #FFC107 !important;
}
</style>
