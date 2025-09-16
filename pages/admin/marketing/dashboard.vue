<template>
  <div class="marketing-page">
    <div class="marketing-header">
      <h1>Панель маркетинга</h1>
      <p>Управление проектами, каналами и аналитикой</p>
    </div>

    <div class="profile-actions">
      <h2>Разделы</h2>
      <div class="actions-grid">
        <div class="action-card">
          <h3>Каналы</h3>
          <p>Управление каналами и настройками</p>
          <NuxtLink class="btn-primary" to="/admin/marketing/channels">Перейти</NuxtLink>
        </div>
        <div class="action-card">
          <h3>Настройки</h3>
          <p>Параметры системы</p>
          <NuxtLink class="btn-primary" to="/admin/marketing/settings">Перейти</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style src="~/assets/css/marketing/index.css"></style>
<style scoped></style>