<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h2>Настройки системы</h2>
    </div>
    
    <div class="settings-grid">
      <div class="settings-card">
        <h3>Webhook интеграции</h3>
        <form @submit.prevent="handleSaveWebhookSettings">
          <div class="form-group">
            <label>Webhook URL</label>
            <input v-model="webhookSettings.url" type="url" placeholder="https://your-crm.com/webhook" />
          </div>
          <div class="form-group">
            <label>Webhook Secret</label>
            <input v-model="webhookSettings.secret" type="text" placeholder="your-secret-key" />
          </div>
          <button type="submit" class="btn btn--primary">Сохранить</button>
        </form>
      </div>

      <div class="settings-card">
        <h3>Локализация</h3>
        <form @submit.prevent="handleSaveLocaleSettings">
          <div class="form-group">
            <label>Язык по умолчанию</label>
            <select v-model="localeSettings.default">
              <option value="en">English</option>
              <option value="uk">Українська</option>
              <option value="ru">Русский</option>
            </select>
          </div>
          <div class="form-group">
            <label>Поддерживаемые языки</label>
            <div class="checkbox-group">
              <label v-for="lang in availableLanguages" :key="lang.code">
                <input v-model="localeSettings.supported" :value="lang.code" type="checkbox" />
                {{ lang.name }}
              </label>
            </div>
          </div>
          <button type="submit" class="btn btn--primary">Сохранить</button>
        </form>
      </div>

      <div class="settings-card">
        <h3>Безопасность</h3>
        <div class="security-settings">
          <div class="form-group">
            <label>
              <input v-model="securitySettings.requireHttps" type="checkbox" />
              Требовать HTTPS
            </label>
          </div>
          <div class="form-group">
            <label>
              <input v-model="securitySettings.enableCors" type="checkbox" />
              Включить CORS
            </label>
          </div>
          <div class="form-group">
            <label>
              <input v-model="securitySettings.rateLimit" type="checkbox" />
              Ограничение запросов
            </label>
          </div>
          <button @click="handleSaveSecuritySettings" class="btn btn--primary">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettings } from '~/composables/admin/useSettings'

const {
  webhookSettings,
  localeSettings,
  securitySettings,
  availableLanguages,
  handleSaveWebhookSettings,
  handleSaveLocaleSettings,
  handleSaveSecuritySettings
} = useSettings()
</script>