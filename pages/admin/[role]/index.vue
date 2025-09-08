<template>
  <div class="profile-page">
    <div class="profile-header">
      <h1>{{ getRoleLabel(user?.role) }}</h1>
      <p>{{ getRoleDescription(user?.role) }}</p>
    </div>

    <div class="profile-content">
      <div class="profile-info">
        <h2>Информация о пользователе</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Email:</label>
            <span>{{ user?.email }}</span>
          </div>
          <div class="info-item">
            <label>Роль:</label>
            <span class="role-badge" :class="getRoleColor(user?.role)">{{ getRoleLabel(user?.role) }}</span>
          </div>
          <div class="info-item">
            <label>Статус:</label>
            <span class="status active">Активен</span>
          </div>
        </div>
      </div>

      <div class="profile-actions">
        <h2>Доступные действия</h2>
        <div class="actions-grid">
          <div
            v-for="action in getRoleActions(user?.role)"
            :key="action.action"
            class="action-card"
          >
            <h3>{{ action.title }}</h3>
            <p>{{ action.description }}</p>
            <NuxtLink :to="action.url" class="btn-primary">Перейти</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProfileScripts } from '~/scripts/profile'


const {
  user,
  getRoleLabel,
  getRoleColor,
  getRoleDescription,
  getRoleActions
} = useProfileScripts()
</script>

<style scoped>
@import '~/assets/css/profile.css';
</style>

