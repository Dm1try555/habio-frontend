<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Создать аккаунт</h1>
        <p>Начните использовать виджеты уже сегодня</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="first_name">Имя</label>
          <input
            id="first_name"
            v-model="form.first_name"
            type="text"
            required
            placeholder="Ваше имя"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="last_name">Фамилия</label>
          <input
            id="last_name"
            v-model="form.last_name"
            type="text"
            required
            placeholder="Ваша фамилия"
            :disabled="isLoading"
          />
        </div>

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
            minlength="8"
          />
          <small class="form-hint">Минимум 8 символов</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Подтвердите пароль</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="form.agreeToTerms"
              type="checkbox"
              required
              :disabled="isLoading"
            />
            <span>Я согласен с <a href="/terms" target="_blank">условиями использования</a></span>
          </label>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading || !isFormValid">
          <span v-if="isLoading">Создание аккаунта...</span>
          <span v-else>Создать аккаунт</span>
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="auth-footer">
        <p>Уже есть аккаунт? <NuxtLink to="/client/auth/login">Войти</NuxtLink></p>
      </div>

      <div class="pricing-preview">
        <h3>Начните бесплатно</h3>
        <ul>
          <li>✓ До 3 проектов</li>
          <li>✓ 3 языка</li>
          <li>✓ 5 тем</li>
          <li>✓ Базовая аналитика</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'

const { register, isLoading, error, isAuthenticated } = useClientAuth()

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const isFormValid = computed(() => {
  return form.value.first_name && 
         form.value.last_name &&
         form.value.email && 
         form.value.password && 
         form.value.password === form.value.confirmPassword &&
         form.value.agreeToTerms
})

const handleRegister = async () => {
  if (!isFormValid.value) return

  try {
    await register({
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password
    })
    // Redirect to client dashboard after successful registration
    await navigateTo('/client/dashboard')
  } catch (err) {
    // Error is handled by the composable
    console.error('Registration error:', err)
  }
}

// Redirect if already authenticated
if (isAuthenticated.value) {
  await navigateTo('/client/dashboard')
}
</script>

<style src="~/assets/css/client/index.css"></style>
<style scoped></style>