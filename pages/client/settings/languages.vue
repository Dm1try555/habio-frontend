<template>
  <div class="universal-page">
    <div class="universal-page-content">
      <div class="universal-page-header">
        <h1>Языки</h1>
        <div v-if="!canAccessFeature('languages')" class="upgrade-banner">
          <div class="upgrade-content">
            <span class="upgrade-icon">🔒</span>
            <div class="upgrade-text">
              <h3>Доступно в Pro тарифе</h3>
              <p>Настройка языков доступна только в платном тарифе</p>
              <button @click="goToPricing" class="upgrade-button">Перейти к тарифам</button>
            </div>
          </div>
        </div>
      </div>

      <div class="universal-settings-content" v-if="canAccessFeature('languages')">
        <div class="universal-section">
          <div class="universal-section-header">
            <h2 class="universal-section-title">Настройка языков</h2>
          </div>
          <div class="languages-list">
            <div class="language-item" v-for="language in languages" :key="language.code">
              <div class="language-info">
                <div class="language-flag">{{ language.flag }}</div>
                <div class="language-details">
                  <h3>{{ language.name }}</h3>
                  <p>{{ language.nativeName }}</p>
                </div>
              </div>
              <div class="language-actions">
                <label class="toggle">
                  <input type="checkbox" v-model="language.enabled" />
                  <span class="toggle-slider"></span>
                </label>
                <button @click="editLanguage(language)" class="btn-edit">Редактировать</button>
              </div>
            </div>

            <button @click="addLanguage" class="btn-add-language">
              <span>+</span>
              Добавить язык
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'
import { useSubscription } from '~/composables/useSubscription'

const { user, isAuthenticated } = useClientAuth()
const { canAccessFeature } = useSubscription()

const languages = ref([
  {
    code: 'ru',
    name: 'Русский',
    nativeName: 'Русский',
    flag: '🇷🇺',
    enabled: true
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    enabled: true
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    enabled: false
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    enabled: false
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    enabled: false
  }
])

const editLanguage = (language: any) => {
  console.log('Edit language:', language)
}

const addLanguage = () => {
  console.log('Add new language')
}

const goToPricing = () => {
  navigateTo('/client/pricing')
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/client/auth/login')
    return
  }
})
</script>

<style scoped>
/* Import universal styles */
@import '~/assets/css/shared/pages.css';

/* Language-specific styles */
.languages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.language-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.language-flag {
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: #f0f4ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.language-details h3 {
  margin: 0 0 8px 0;
  color: #1a1a1a;
  font-size: 18px;
}

.language-details p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.language-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: #667eea;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.btn-edit {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-add-language {
  background: #667eea;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.btn-add-language span {
  font-size: 20px;
}

.upgrade-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
  color: white;
}

.upgrade-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upgrade-icon {
  font-size: 32px;
}

.upgrade-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.upgrade-text p {
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.upgrade-button {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upgrade-button:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}
</style>