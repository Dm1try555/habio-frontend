<template>
  <div class="universal-page">
    <ClientDashboardHeader />

    <div class="client-header">
      <h1>Панель клиента</h1>
      <p>Добро пожаловать, {{ user?.first_name }} {{ user?.last_name }}!</p>
    </div>

    <div class="user-info">
      <h2>Информация о пользователе</h2>
      <div class="info-grid">
        <div class="info-item">
          <label>Email:</label>
          <span>{{ user?.email }}</span>
        </div>
        <div class="info-item">
          <label>Имя:</label>
          <span>{{ user?.first_name }} {{ user?.last_name }}</span>
        </div>
        <div class="info-item">
          <label>Тариф:</label>
          <span class="plan-badge" :class="`plan-badge--${user?.plan || 'free'}`">
            {{ user?.plan === 'pro' ? 'Pro' : 'Free' }}
          </span>
        </div>
        <div class="info-item">
          <label>Статус:</label>
          <span>{{ user?.is_active ? 'Активен' : 'Неактивен' }}</span>
        </div>
      </div>
    </div>

    <div class="profile-actions">
      <h2>Разделы</h2>
      <div class="actions-grid">
        <div class="action-card">
          <h3>Чат</h3>
          <p>Общение с клиентами</p>
          <button class="btn-primary" @click="navigateTo('/client/chat')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Лиды</h3>
          <p>Управление заявками</p>
          <button class="btn-primary" @click="navigateTo('/client/leads')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Проекты</h3>
          <p>Управление проектами</p>
          <button class="btn-primary" @click="navigateTo('/client/projects')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Аналитика</h3>
          <p>Просмотр статистики и отчетов</p>
          <button class="btn-primary" @click="navigateTo('/client/analytics')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Тарифы</h3>
          <p>Управление подпиской</p>
          <button class="btn-primary" @click="navigateTo('/client/pricing')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Настройки</h3>
          <p>Управление настройками аккаунта</p>
          <button class="btn-primary" @click="goToSettings">Перейти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClientDashboardHeader from '~/components/client/dashboard/ClientDashboardHeader.vue'
import { useRouter } from 'vue-router'
import { useClientAuth } from '~/composables/client/useClientAuth'

const router = useRouter()
const { user } = useClientAuth()

const navigateTo = (path: string) => {
  router.push(path)
}

const goToSettings = () => {
  router.push('/client/settings')
}
</script>

<style scoped src="~/assets/css/client/client-dashboard.css"></style>
<style scoped>
.plan-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.plan-badge--free {
  background: #e5e7eb;
  color: #374151;
}

.plan-badge--pro {
  background: #10b981;
  color: white;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.action-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-card h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 18px;
}

.action-card p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}
</style>
