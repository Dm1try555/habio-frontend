<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Аналитика</h1>
      <p>Статистика и отчеты по системе</p>
    </div>

    <div class="page-content">
      <!-- Key Metrics -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Общий доход</h3>
          <p class="stat-number">${{ totalRevenue.toLocaleString() }}</p>
          <p class="stat-change stat-change--positive">+{{ revenueGrowth }}% за месяц</p>
        </div>
        <div class="stat-card">
          <h3>Пользователи</h3>
          <p class="stat-number">{{ totalUsers.toLocaleString() }}</p>
          <p class="stat-change stat-change--positive">+{{ userGrowth }}% за месяц</p>
        </div>
        <div class="stat-card">
          <h3>Активные подписки</h3>
          <p class="stat-number">{{ activeSubscriptions.toLocaleString() }}</p>
          <p class="stat-change stat-change--positive">{{ subscriptionRate }}% конверсия</p>
        </div>
        <div class="stat-card">
          <h3>Средний чек</h3>
          <p class="stat-number">${{ averageRevenuePerUser }}</p>
          <p class="stat-change stat-change--positive">+{{ arpuGrowth }}% за месяц</p>
        </div>
      </div>

      <!-- Charts, Plan Distribution, Top Users, Recent Activity -->
      <!-- ...оставляем как в оригинале... -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useCookie, useRoute, navigateTo } from '#imports'

const { $api } = useNuxtApp() // axios instance from plugin

// Filters
const revenuePeriod = ref('12')
const userGrowthPeriod = ref('12')

// Key metrics
const totalRevenue = ref(0)
const revenueGrowth = ref(0)
const totalUsers = ref(0)
const userGrowth = ref(0)
const activeSubscriptions = ref(0)
const subscriptionRate = ref(0)
const averageRevenuePerUser = ref(0)
const arpuGrowth = ref(0)

const planDistribution = ref([])
const topUsers = ref([])
const recentActivity = ref([])

const loadAnalytics = async () => {
  try {
    const response = await $api.get('/admin/analytics/')
    const data = response.data

    totalRevenue.value = data.totalRevenue
    revenueGrowth.value = data.revenueGrowth
    totalUsers.value = data.totalUsers
    userGrowth.value = data.userGrowth
    activeSubscriptions.value = data.activeSubscriptions
    subscriptionRate.value = data.subscriptionRate
    averageRevenuePerUser.value = data.averageRevenuePerUser
    arpuGrowth.value = data.arpuGrowth

    planDistribution.value = data.planDistribution
    topUsers.value = data.topUsers
    recentActivity.value = data.recentActivity
  } catch (error) {
    console.error('Не удалось загрузить аналитику:', error)
    
  }
}

onMounted(async () => {
  // Проверка авторизации через cookie
  const accessToken = useCookie('admin_access_token').value
  if (!accessToken) {
    const route = useRoute()
    await navigateTo('/admin/login?redirect=' + route.fullPath)
    return
  }

  await loadAnalytics()
})
</script>

<style scoped>

</style>
