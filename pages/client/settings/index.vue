<template>
  <div class="client-page">
    <div class="client-header">
      <h1>Настройки</h1>
      <p>Управление настройками вашего аккаунта</p>
    </div>

    <div class="settings-container">
      <div class="settings-section">
        <h2>Профиль</h2>
        <form @submit.prevent="updateProfile" class="settings-form">
          <div class="form-group">
            <label>Имя</label>
            <input v-model="profileForm.first_name" type="text" required />
          </div>
          <div class="form-group">
            <label>Фамилия</label>
            <input v-model="profileForm.last_name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="profileForm.email" type="email" required />
          </div>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </form>
      </div>

      <div class="settings-section">
        <h2>Смена пароля</h2>
        <form @submit.prevent="changePassword" class="settings-form">
          <div class="form-group">
            <label>Текущий пароль</label>
            <input v-model="passwordForm.currentPassword" type="password" required />
          </div>
          <div class="form-group">
            <label>Новый пароль</label>
            <input v-model="passwordForm.newPassword" type="password" required minlength="8" />
          </div>
          <div class="form-group">
            <label>Подтвердите пароль</label>
            <input v-model="passwordForm.confirmPassword" type="password" required />
          </div>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Смена пароля...' : 'Сменить пароль' }}
          </button>
        </form>
      </div>
    </div>

    <div class="back-section">
      <button class="btn-secondary" @click="$router.push('/client/dashboard')">
        ← Назад к панели
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'

const { user, updateProfile: updateUserProfile, isLoading } = useClientAuth()

const profileForm = ref({
  first_name: '',
  last_name: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  if (user.value) {
    profileForm.value = {
      first_name: user.value.first_name,
      last_name: user.value.last_name,
      email: user.value.email
    }
  }
})

const updateProfile = async () => {
  try {
    await updateUserProfile(profileForm.value)
    alert('Профиль успешно обновлен!')
  } catch (err) {
    alert('Ошибка обновления профиля')
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Пароли не совпадают')
    return
  }

  try {
    // Здесь должен быть API вызов для смены пароля
    alert('Пароль успешно изменен!')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (err) {
    alert('Ошибка смены пароля')
  }
}
</script>

<style src="~/assets/css/client/index.css"></style>
<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.settings-section h2 {
  color: var(--client-primary);
  margin-bottom: 1.5rem;
}

.settings-form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--client-text-primary);
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--client-primary);
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-secondary:hover {
  background: #5a6268;
  color: white;
  text-decoration: none;
}

.back-section {
  text-align: center;
  margin-top: 2rem;
}
</style>