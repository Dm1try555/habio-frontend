<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1>Панель администратора</h1>
      <p>Полный доступ к функционалу и настройкам системы</p>
    </div>

    <div class="profile-actions">
      <h2>Разделы</h2>
      <div class="actions-grid">
        <div class="action-card">
          <h3>Каналы</h3>
          <p>Управление каналами и настройками</p>
          <button class="btn-primary" @click="navigateTo('/admin/admin/channels')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Проекты</h3>
          <p>Управление проектами</p>
          <button class="btn-primary" @click="navigateTo('/admin/admin/projects')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Расписание</h3>
          <p>Рабочие часы и графики</p>
          <button class="btn-primary" @click="navigateTo('/admin/admin/schedule')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Настройки</h3>
          <p>Параметры системы</p>
          <button class="btn-primary" @click="navigateTo('/admin/admin/settings')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Пользователи</h3>
          <p>Управление пользователями</p>
          <button class="btn-primary" @click="navigateTo('/admin/admin/users')">Перейти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style src="~/assets/css/admin/index.css"></style>
