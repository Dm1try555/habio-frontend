<template>
  <div class="channels-settings">
    <div class="settings-header">
      <h1>Каналы связи</h1>
    </div>

    <div class="settings-content">
      <div class="channels-list">
        <div class="channel-item" v-for="channel in channels" :key="channel.id">
          <div class="channel-info">
            <div class="channel-icon">{{ getChannelIcon(channel.type) }}</div>
            <div class="channel-details">
              <h3>{{ channel.name }}</h3>
              <p>{{ channel.description }}</p>
            </div>
          </div>
          <div class="channel-actions">
            <label class="toggle">
              <input type="checkbox" v-model="channel.enabled" />
              <span class="toggle-slider"></span>
            </label>
            <button @click="editChannel(channel)" class="btn-edit">Редактировать</button>
          </div>
        </div>

        <button @click="addChannel" class="btn-add-channel">
          <span>+</span>
          Добавить канал
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'

const { user, isAuthenticated } = useClientAuth()

const channels = ref([
  {
    id: 1,
    type: 'telegram',
    name: 'Telegram',
    description: 'Быстрые сообщения и уведомления',
    enabled: true
  },
  {
    id: 2,
    type: 'whatsapp',
    name: 'WhatsApp',
    description: 'Популярный мессенджер',
    enabled: true
  },
  {
    id: 3,
    type: 'email',
    name: 'Email',
    description: 'Официальная переписка',
    enabled: false
  },
  {
    id: 4,
    type: 'phone',
    name: 'Телефон',
    description: 'Голосовые звонки',
    enabled: false
  }
])

const getChannelIcon = (type: string) => {
  const icons: Record<string, string> = {
    telegram: '📱',
    whatsapp: '💬',
    email: '📧',
    phone: '📞'
  }
  return icons[type] || '📞'
}

const editChannel = (channel: any) => {
  console.log('Edit channel:', channel)
}

const addChannel = () => {
  console.log('Add new channel')
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/client/auth/login')
    return
  }
})
</script>

<style scoped>
.channels-settings {
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
  max-width: 800px;
}

.channels-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.channel-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.channel-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  background: #f0f4ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-details h3 {
  margin: 0 0 8px 0;
  color: #1a1a1a;
  font-size: 18px;
}

.channel-details p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.channel-actions {
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

.btn-add-channel {
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

.btn-add-channel span {
  font-size: 20px;
}
</style>