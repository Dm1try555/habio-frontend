<template>
  <div class="universal-page">
    <div class="admin-header">
      <h1>Панель администратора</h1>
      <p>Полный доступ к функционалу и настройкам системы</p>
    </div>

    <div class="profile-actions">
      <h2>Разделы</h2>
      <div class="actions-grid">
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
        <div class="action-card">
          <h3>Аналитика</h3>
          <p>Просмотр аналитики</p>
          <button class="btn-primary" @click="navigateTo('/admin/admin/analytics')">Перейти</button>
        </div>
        <div class="action-card">
          <h3>Пейменты</h3>
          <p>Просмотр пейментов</p>
          <button class="btn-primary" @click="navigateTo('/admin/admin/payments')">Перейти</button>
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
