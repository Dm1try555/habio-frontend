<template>
  <div class="client-page">
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
          <label>Статус:</label>
          <span>{{ user?.is_active ? 'Активен' : 'Неактивен' }}</span>
        </div>
      </div>
    </div>

    <div class="profile-actions">
      <h2>Разделы</h2>
      <div class="actions-grid">
        <div class="action-card">
          <h3>Аналитика</h3>
          <p>Просмотр статистики и отчетов</p>
          <button class="btn-primary" @click="navigateTo('/client/analytics')">Перейти</button>
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
