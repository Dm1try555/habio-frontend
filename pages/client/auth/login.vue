<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Вход в аккаунт</h1>
        <p>Управляйте своими виджетами и аналитикой</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="your@email.com"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading">Вход...</span>
          <span v-else>Войти</span>
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="auth-footer">
        <p>Нет аккаунта? <NuxtLink to="/client/auth/register">Зарегистрироваться</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'

const { login, isLoading, error, isAuthenticated } = useClientAuth()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await login(form.value)
    // Redirect to client dashboard
    await navigateTo('/client/dashboard')
  } catch (err) {
    // Error is handled by the composable
    console.error('Login error:', err)
  }
}

// Redirect if already authenticated
if (isAuthenticated.value) {
  await navigateTo('/client/dashboard')
}
</script>

<style src="~/assets/css/client/index.css"></style>
<style scoped></style>