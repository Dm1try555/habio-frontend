<template>
  <div class="marketing-section-page">
    <div class="section-header">
      <NuxtLink to="/admin/marketing/dashboard" class="back-link">← Назад к панели</NuxtLink>
      <h1>Настройка каналов</h1>
    </div>
    <ChannelsSection />
  </div>
</template>

<script setup>
import ChannelsSection from '~/components/admin/ChannelsSection.vue'
</script>

<style src="~/assets/css/marketing/index.css"></style>
<style scoped></style>