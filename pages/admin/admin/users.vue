<template>
  <div class="admin-section-page">
    <div class="section-header">
      <button class="back-link" @click="$router.push('/admin/admin/dashboard')">← Назад к панели</button>
      <h1>Управление пользователями</h1>
    </div>
    <UsersSection />
  </div>
</template>

<script setup>
import UsersSection from '~/components/admin/UsersSection.vue'
</script>

<style src="~/assets/css/admin/index.css"></style>
<style scoped>
.back-link {
  background: none;
  border: none;
  color: var(--admin-primary);
  text-decoration: none;
  margin-bottom: 1rem;
  display: inline-block;
  cursor: pointer;
  font-size: 1rem;
}

.back-link:hover {
  text-decoration: underline;
}
</style>