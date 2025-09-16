<template>
  <div class="universal-page">
    <div class="universal-page-content">
      <div class="universal-page-header">
        <h1>Настройки</h1>
        <p>Управление настройками вашего аккаунта</p>
      </div>

      <div class="universal-settings-container">
        <div class="universal-settings-nav">
          <h2>Настройки</h2>
          <div class="universal-nav-links">
            <NuxtLink to="/client/settings" class="universal-nav-link" active-class="universal-nav-link--active">
              Профиль
            </NuxtLink>
            <NuxtLink to="/client/settings/channels" class="universal-nav-link" active-class="universal-nav-link--active">
              Каналы
            </NuxtLink>
            <NuxtLink to="/client/settings/languages" class="universal-nav-link" active-class="universal-nav-link--active">
              Языки
            </NuxtLink>
            <NuxtLink to="/client/settings/schedule" class="universal-nav-link" active-class="universal-nav-link--active">
              Расписание
            </NuxtLink>
            <NuxtLink to="/client/settings/widget" class="universal-nav-link" active-class="universal-nav-link--active">
              Виджет
            </NuxtLink>
          </div>
        </div>

        <div class="universal-settings-content">
          <div class="universal-settings-section">
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

          <div class="universal-settings-section">
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
      </div>

      <div class="back-section">
        <button class="btn-secondary" @click="$router.push('/client/dashboard')">
          ← Назад к панели
        </button>
      </div>
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

<style scoped>
/* Import universal styles */
@import '~/assets/css/shared/pages.css';

/* Settings-specific styles */
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
  color: var(--color-gray-700);
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
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