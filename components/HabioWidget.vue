<template>
  <div class="habio-widget" :class="{ 'habio-widget--open': isOpen }">
    <!-- Floating Action Button -->
    <button 
      class="habio-fab"
      @click="toggleWidget"
      :aria-label="isOpen ? 'Закрыть панель связи' : 'Открыть панель связи'"
    >
      <svg v-if="!isOpen" class="habio-fab__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
      <svg v-else class="habio-fab__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <!-- Widget Panel -->
    <div v-if="isOpen" class="habio-panel">
      <div class="habio-panel__header">
        <h3 class="habio-panel__title">Свяжитесь с нами</h3>
        <div v-if="!isOnline" class="habio-panel__badge">
          Доступно с {{ nextAvailable }}
        </div>
      </div>

      <div class="habio-panel__content">
        <!-- Top Actions -->
        <div class="habio-panel__top-actions">
          <button
            v-for="channel in topChannels"
            :key="channel.id"
            class="habio-channel habio-channel--primary"
            @click="handleChannelClick(channel)"
          >
            <span class="habio-channel__icon">{{ getChannelIcon(channel.type) }}</span>
            <span class="habio-channel__label">{{ channel.label }}</span>
            <span v-if="channel.type === 'call' && !isOnline" class="habio-channel__badge">
              Доступно с {{ nextAvailable }}
            </span>
          </button>
        </div>

        <!-- Other Channels -->
        <div v-if="otherChannels.length > 0" class="habio-panel__other-channels">
          <h4 class="habio-panel__subtitle">Другие способы связи</h4>
          <div class="habio-panel__channels-grid">
            <button
              v-for="channel in otherChannels"
              :key="channel.id"
              class="habio-channel habio-channel--secondary"
              @click="handleChannelClick(channel)"
            >
              <span class="habio-channel__icon">{{ getChannelIcon(channel.type) }}</span>
              <span class="habio-channel__label">{{ channel.label }}</span>
            </button>
          </div>
        </div>

        <!-- Callback Form -->
        <div v-if="showCallbackForm" class="habio-callback-form">
          <h4 class="habio-panel__subtitle">Заказать звонок</h4>
          <form @submit.prevent="submitCallback">
            <div class="habio-form__group">
              <input
                v-model="callbackForm.phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                class="habio-form__input"
                required
              />
            </div>
            <div class="habio-form__group">
              <input
                v-model="callbackForm.preferred_time"
                type="datetime-local"
                class="habio-form__input"
              />
            </div>
            <div class="habio-form__group">
              <textarea
                v-model="callbackForm.message"
                placeholder="Сообщение (необязательно)"
                class="habio-form__textarea"
                rows="3"
              ></textarea>
            </div>
            <button type="submit" class="habio-form__submit">
              Заказать звонок
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Channel {
  id: number
  type: 'call' | 'callback' | 'messenger' | 'chat' | 'form'
  label: string
  link?: string
  priority: number
  show_in_top: boolean
  icon?: string
  description?: string
}

interface WidgetConfig {
  channels: Channel[]
  is_online: boolean
  next_available?: string
}

const props = defineProps<{
  projectId: string
  apiBase?: string
}>()

const isOpen = ref(false)
const config = ref<WidgetConfig>({
  channels: [],
  is_online: false
})
const loading = ref(false)
const callbackForm = ref({
  phone: '',
  preferred_time: '',
  message: ''
})

const apiBase = props.apiBase || 'http://127.0.0.1:8000/api'

const isOnline = computed(() => config.value.is_online)
const nextAvailable = computed(() => config.value.next_available || '09:00')

const topChannels = computed(() => {
  return config.value.channels
    .filter(channel => channel.show_in_top)
    .slice(0, 2)
})

const otherChannels = computed(() => {
  return config.value.channels
    .filter(channel => !channel.show_in_top)
})

const showCallbackForm = ref(false)

const getChannelIcon = (type: string) => {
  const icons = {
    call: '📞',
    callback: '⏰',
    messenger: '💬',
    chat: '💭',
    form: '📝'
  }
  return icons[type as keyof typeof icons] || '📞'
}

const toggleWidget = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && config.value.channels.length === 0) {
    loadConfig()
  }
}

const loadConfig = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop'
    const response = await fetch(`${apiBase}/widget/${props.projectId}/channels/?device=${deviceType}`)
    const data = await response.json()
    
    config.value = {
      channels: data.channels || [],
      is_online: data.is_online || false,
      next_available: data.next_available
    }
  } catch (error) {
    console.error('Failed to load widget config:', error)
  } finally {
    loading.value = false
  }
}

const handleChannelClick = (channel: Channel) => {
  switch (channel.type) {
    case 'call':
      if (channel.link) {
        window.location.href = channel.link
      }
      break
    case 'callback':
      showCallbackForm.value = true
      break
    case 'messenger':
      if (channel.link) {
        window.open(channel.link, '_blank')
      }
      break
    case 'chat':
      // Implement chat functionality
      console.log('Open chat:', channel)
      break
    case 'form':
      // Implement form functionality
      console.log('Open form:', channel)
      break
  }
  
  // Track analytics
  trackEvent('channel_click', {
    channel_id: channel.id,
    channel_type: channel.type,
    is_online: isOnline.value
  })
}

const submitCallback = async () => {
  try {
    const response = await fetch(`${apiBase}/widget/${props.projectId}/create_callback/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: callbackForm.value.phone,
        preferred_time: callbackForm.value.preferred_time,
        message: callbackForm.value.message,
        page_url: window.location.href,
        client_id: getClientId()
      })
    })
    
    if (response.ok) {
      alert('Заявка на звонок отправлена!')
      showCallbackForm.value = false
      callbackForm.value = { phone: '', preferred_time: '', message: '' }
    } else {
      throw new Error('Failed to submit callback request')
    }
  } catch (error) {
    console.error('Failed to submit callback:', error)
    alert('Ошибка при отправке заявки. Попробуйте еще раз.')
  }
}

const getClientId = () => {
  let clientId = localStorage.getItem('habio_client_id')
  if (!clientId) {
    clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('habio_client_id', clientId)
  }
  return clientId
}

const trackEvent = (eventName: string, data: any) => {
  // Google Analytics 4 tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'habio_widget',
      ...data
    })
  }
  
  // Console log for development
  console.log('Track event:', eventName, data)
}

onMounted(() => {
  // Load config on mount
  loadConfig()
})
</script>

<style scoped>
.habio-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.habio-fab {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #007bff;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
}

.habio-fab:hover {
  background: #0056b3;
  transform: scale(1.05);
}

.habio-fab__icon {
  width: 24px;
  height: 24px;
}

.habio-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 320px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.habio-panel__header {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.habio-panel__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #212529;
}

.habio-panel__badge {
  margin-top: 4px;
  font-size: 12px;
  color: #6c757d;
}

.habio-panel__content {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.habio-panel__top-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.habio-panel__other-channels {
  margin-top: 16px;
}

.habio-panel__subtitle {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.habio-panel__channels-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.habio-channel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
}

.habio-channel:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.habio-channel--primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.habio-channel--primary:hover {
  background: #0056b3;
}

.habio-channel--secondary {
  flex-direction: column;
  text-align: center;
  padding: 8px;
}

.habio-channel__icon {
  font-size: 20px;
}

.habio-channel__label {
  font-weight: 500;
}

.habio-channel__badge {
  font-size: 10px;
  opacity: 0.8;
  margin-top: 2px;
}

.habio-callback-form {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.habio-form__group {
  margin-bottom: 12px;
}

.habio-form__input,
.habio-form__textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.habio-form__input:focus,
.habio-form__textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.habio-form__submit {
  width: 100%;
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.habio-form__submit:hover {
  background: #218838;
}

@media (max-width: 480px) {
  .habio-panel {
    width: 280px;
    right: -10px;
  }
  
  .habio-panel__channels-grid {
    grid-template-columns: 1fr;
  }
}
</style>