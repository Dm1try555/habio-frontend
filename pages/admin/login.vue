<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <h1>HABIO-CHAT</h1>
          <p>Admin Panel</p>
        </div>
      </div>
      
      <div class="login-form-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <h2>Вход в систему</h2>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required 
              placeholder="admin@example.com"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Пароль</label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              required 
              placeholder="Введите пароль"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="role">Роль</label>
            <select id="role" v-model="form.role" required class="form-select">
              <option value="">Выберите роль</option>
              <option value="admin">Администратор</option>
              <option value="marketing">Маркетинг</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            :disabled="loading" 
            class="btn btn--primary btn--full"
          >
            <span v-if="loading">Вход...</span>
            <span v-else>Войти</span>
          </button>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>
      
      <div class="login-footer">
        <p>&copy; 2025 HABIO-CHAT. Все права защищены.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/admin/useAdminAuth'
import { useForm } from '~/composables/shared/useForm'
import { useRouter } from 'vue-router'

const { login } = useAuth()
const router = useRouter()

const { form, loading, error, withLoading } = useForm({
  email: '',
  password: '',
  role: ''
})

const handleLogin = async () => {
  if (!form.value.email || !form.value.password || !form.value.role) {
    error.value = 'Заполните все поля'
    return
  }

  await withLoading(async () => {
    const result = await login({ 
      email: form.value.email, 
      password: form.value.password,
      role: form.value.role
    })
    
    // Redirect based on selected role
    const role = String(form.value.role)
    if (role === 'admin') {
      await router.push('/admin/admin/dashboard')
      return
    }
    if (role === 'marketing') {
      await router.push('/admin/marketing/dashboard')
      return
    }
    await router.push('/admin/login')
  })
}
</script>

<style scoped>
@import '~/assets/css/client/login.css';
</style>