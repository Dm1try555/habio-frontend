<template>
  <div class="widget-settings">
    <div class="settings-header">
      <h1>Настройки виджета</h1>
    </div>

    <div class="settings-content">
      <div class="settings-form">
        <div class="form-group">
          <label>Цветовая схема</label>
          <select v-model="widgetConfig.theme">
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
            <option value="auto">Автоматически</option>
          </select>
        </div>

        <div class="form-group">
          <label>Позиция виджета</label>
          <select v-model="widgetConfig.position">
            <option value="bottom-right">Справа внизу</option>
            <option value="bottom-left">Слева внизу</option>
            <option value="top-right">Справа вверху</option>
            <option value="top-left">Слева вверху</option>
          </select>
        </div>

        <div class="form-group">
          <label>Размер виджета</label>
          <select v-model="widgetConfig.size">
            <option value="small">Маленький</option>
            <option value="medium">Средний</option>
            <option value="large">Большой</option>
          </select>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" v-model="widgetConfig.showAvatar" />
            Показывать аватар
          </label>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" v-model="widgetConfig.showOnlineStatus" />
            Показывать статус онлайн
          </label>
        </div>

        <div class="form-actions">
          <button @click="saveSettings" class="btn-save">Сохранить</button>
          <button @click="resetSettings" class="btn-reset">Сбросить</button>
        </div>
      </div>

      <div class="preview-section">
        <h3>Предварительный просмотр</h3>
        <div class="widget-preview">
          <div :class="['preview-widget', `theme-${widgetConfig.theme}`, `size-${widgetConfig.size}`]">
            <div class="widget-avatar" v-if="widgetConfig.showAvatar">👤</div>
            <div class="widget-content">
              <div class="widget-title">Чат поддержки</div>
              <div class="widget-status" v-if="widgetConfig.showOnlineStatus">Онлайн</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'

const { user, isAuthenticated } = useClientAuth()

const widgetConfig = ref({
  theme: 'light',
  position: 'bottom-right',
  size: 'medium',
  showAvatar: true,
  showOnlineStatus: true
})

const saveSettings = () => {
  // Save widget settings logic here
  console.log('Saving widget settings:', widgetConfig.value)
}

const resetSettings = () => {
  widgetConfig.value = {
    theme: 'light',
    position: 'bottom-right',
    size: 'medium',
    showAvatar: true,
    showOnlineStatus: true
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/client/auth/login')
    return
  }
})
</script>

<style scoped>
.widget-settings {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 24px;
}

.settings-header {
  margin-bottom: 32px;
}

.settings-header h1 {
  margin: 0;
  color: #1a1a1a;
}

.settings-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 1200px;
}

.settings-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1a1a1a;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn-save {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-reset {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.preview-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-section h3 {
  margin: 0 0 24px 0;
  color: #1a1a1a;
}

.widget-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-widget {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-widget.theme-light {
  background: white;
  color: #1a1a1a;
}

.preview-widget.theme-dark {
  background: #2d3748;
  color: white;
}

.preview-widget.size-small {
  transform: scale(0.8);
}

.preview-widget.size-large {
  transform: scale(1.2);
}

.widget-avatar {
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.widget-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.widget-title {
  font-weight: 600;
  font-size: 14px;
}

.widget-status {
  font-size: 12px;
  color: #10b981;
}

@media (max-width: 768px) {
  .settings-content {
    grid-template-columns: 1fr;
  }
}
</style>