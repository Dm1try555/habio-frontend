<template>
  <div class="marketing-section-page">
    <div class="section-header">
      <NuxtLink to="/admin/marketing/dashboard" class="back-link">← Назад к панели</NuxtLink>
      <h1>Параметры профиля</h1>
    </div>
    <SettingsSection />
  </div>
</template>

<script setup>
import SettingsSection from '~/components/admin/SettingsSection.vue'
</script>

<style src="~/assets/css/marketing/index.css"></style>
<style scoped></style>