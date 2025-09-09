<template>
  <div class="dashboard">
    <ClientDashboardHeader />
    
    <div class="dashboard-content">
      <div class="dashboard-grid">
        <!-- Overview Metrics -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <h3>{{ totalClicks }}</h3>
              <p>Всего кликов</p>
              <span class="metric-change positive">+12%</span>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🎯</div>
            <div class="metric-content">
              <h3>{{ totalConversions }}</h3>
              <p>Конверсии</p>
              <span class="metric-change positive">+8%</span>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📱</div>
            <div class="metric-content">
              <h3>{{ conversionRate }}%</h3>
              <p>Конверсия</p>
              <span class="metric-change positive">+2.1%</span>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <h3>{{ totalRevenue || 'N/A' }}</h3>
              <p>Доход</p>
              <span class="metric-change positive">+15%</span>
            </div>
          </div>
        </div>

        <!-- Channel Performance -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Производительность каналов</h3>
            <select v-model="selectedPeriod" @change="refreshData">
              <option value="7">7 дней</option>
              <option value="30">30 дней</option>
              <option value="90">90 дней</option>
            </select>
          </div>
          <ClientChannelChart :data="channelAnalytics" />
        </div>

        <!-- Recent Activity -->
        <div class="activity-card">
          <div class="card-header">
            <h3>Последняя активность</h3>
            <NuxtLink to="/client/analytics" class="view-all">Все</NuxtLink>
          </div>
          <ClientActivityFeed :activities="recentActivities" />
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-card">
          <h3>Быстрые действия</h3>
          <div class="actions-grid">
            <NuxtLink to="/client/settings/widget" class="action-item">
              <div class="action-icon">⚙️</div>
              <div class="action-content">
                <h4>Настройки виджета</h4>
                <p>Изменить внешний вид</p>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/client/settings/channels" class="action-item">
              <div class="action-icon">📞</div>
              <div class="action-content">
                <h4>Каналы связи</h4>
                <p>Управление каналами</p>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/client/settings/languages" class="action-item">
              <div class="action-icon">🌍</div>
              <div class="action-content">
                <h4>Языки</h4>
                <p>Настройка переводов</p>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/client/analytics" class="action-item">
              <div class="action-icon">📈</div>
              <div class="action-content">
                <h4>Аналитика</h4>
                <p>Подробная статистика</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Subscription Status -->
        <div class="subscription-card">
          <div class="subscription-header">
            <h3>Подписка</h3>
            <span :class="['subscription-badge', subscriptionType]">
              {{ subscriptionType === 'free' ? 'Бесплатная' : 'Премиум' }}
            </span>
          </div>
          
          <div class="subscription-content">
            <div class="subscription-stats">
              <div class="stat">
                <span class="stat-value">{{ user?.projects_count || 0 }}</span>
                <span class="stat-label">из {{ user?.max_projects || 3 }} проектов</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ user?.max_languages || 3 }}</span>
                <span class="stat-label">языков</span>
              </div>
            </div>
            
            <div v-if="subscriptionType === 'free'" class="upgrade-prompt">
              <p>Обновитесь до Премиум для больше возможностей</p>
              <button @click="navigateTo('/client/subscription')" class="btn-upgrade">
                Обновить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const { user, isAuthenticated } = useClientAuth()
const { currentPlan } = useSubscription()
const { 
  channelAnalytics, 
  getTotalClicks, 
  getTotalConversions, 
  getOverallConversionRate,
  loadOverviewMetrics,
  setDateRange
} = useClientAnalytics()

const selectedPeriod = ref('30')
const recentActivities = ref([
  { id: 1, type: 'click', channel: 'Telegram', time: '2 минуты назад' },
  { id: 2, type: 'lead', message: 'Новая заявка от клиента', time: '15 минут назад' },
  { id: 3, type: 'conversion', channel: 'WhatsApp', time: '1 час назад' }
])

const subscriptionType = computed(() => currentPlan.value?.type || 'free')
const totalClicks = computed(() => getTotalClicks.value)
const totalConversions = computed(() => getTotalConversions.value)
const conversionRate = computed(() => getOverallConversionRate.value.toFixed(1))
const totalRevenue = computed(() => {
  // This would come from analytics in a real implementation
  return null
})

const refreshData = async () => {
  const days = parseInt(selectedPeriod.value)
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
  
  setDateRange(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  )
  
  await loadOverviewMetrics()
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/client/auth/login')
    return
  }
  
  await refreshData()
})

// Redirect if not authenticated
if (!isAuthenticated.value) {
  await navigateTo('/client/auth/login')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.metrics-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: #f0f4ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.metric-content p {
  color: #666;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.metric-change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.metric-change.positive {
  background: #d4edda;
  color: #155724;
}

.chart-card {
  grid-column: 1 / 8;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-header h3 {
  margin: 0;
  color: #1a1a1a;
}

.chart-header select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.activity-card {
  grid-column: 8 / -1;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  color: #1a1a1a;
}

.view-all {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.quick-actions-card {
  grid-column: 1 / 7;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-actions-card h3 {
  margin: 0 0 20px 0;
  color: #1a1a1a;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.action-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.action-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  background: #f0f4ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-content h4 {
  margin: 0 0 4px 0;
  color: #1a1a1a;
  font-size: 16px;
}

.action-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.subscription-card {
  grid-column: 7 / -1;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.subscription-header h3 {
  margin: 0;
  color: #1a1a1a;
}

.subscription-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.subscription-badge.free {
  background: #e2e8f0;
  color: #4a5568;
}

.subscription-badge.premium {
  background: #667eea;
  color: white;
}

.subscription-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.upgrade-prompt {
  background: #f0f4ff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.upgrade-prompt p {
  margin: 0 0 12px 0;
  color: #4a5568;
  font-size: 14px;
}

.btn-upgrade {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-upgrade:hover {
  background: #5a6fd8;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card,
  .activity-card,
  .quick-actions-card,
  .subscription-card {
    grid-column: 1;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>