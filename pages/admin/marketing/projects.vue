<template>
  <div class="marketing-section-page">
    <div class="section-header">
      <NuxtLink to="/admin/marketing/dashboard" class="back-link">← Назад к панели</NuxtLink>
      <h1>Управление проектами</h1>
    </div>
    <ProjectsSection />
  </div>
</template>

<script setup>
import ProjectsSection from '~/components/admin/ProjectsSection.vue'
</script>

<style src="~/assets/css/marketing/index.css"></style>
<style scoped></style>