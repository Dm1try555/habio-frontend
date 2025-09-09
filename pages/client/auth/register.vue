<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Создать аккаунт</h1>
        <p>Начните использовать виджеты уже сегодня</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Имя</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Ваше имя"
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

const { register, isLoading, error } = useClientAuth()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const isFormValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.password && 
         form.value.password === form.value.confirmPassword &&
         form.value.agreeToTerms
})

const handleRegister = async () => {
  if (!isFormValid.value) return

  try {
    await register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
    await navigateTo('/client/dashboard')
  } catch (err) {
    // Error is handled by the composable
  }
}

// Redirect if already authenticated
const { isAuthenticated } = useClientAuth()
if (isAuthenticated.value) {
  await navigateTo('/client/dashboard')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.auth-header p {
  color: #666;
  font-size: 16px;
}

.auth-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-hint {
  display: block;
  margin-top: 4px;
  color: #666;
  font-size: 14px;
}

.checkbox-group {
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.checkbox-label a {
  color: #667eea;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
  text-align: center;
}

.auth-footer {
  text-align: center;
  margin-bottom: 30px;
}

.auth-footer p {
  margin: 8px 0;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.pricing-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.pricing-preview h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.pricing-preview ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pricing-preview li {
  padding: 4px 0;
  color: #666;
  font-size: 14px;
}
</style>