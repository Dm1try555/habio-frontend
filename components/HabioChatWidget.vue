<template>
  <div class="habio-chat-widget">
    <div class="habio-chat__header">
      <h4 class="habio-panel__subtitle">Онлайн чат</h4>
      <button @click="$emit('close')" class="habio-form__back">← Назад</button>
    </div>
    
    <div class="habio-chat__messages" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['habio-message', `habio-message--${message.message_type}`]"
      >
        <div class="habio-message__content">{{ message.content }}</div>
        <div class="habio-message__time">{{ formatTime(message.created_at) }}</div>
      </div>
    </div>
    
    <div class="habio-chat__input">
      <form @submit.prevent="sendMessage">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Введите сообщение..."
          class="habio-chat__input-field"
          :disabled="loading"
        />
        <button type="submit" class="habio-chat__send" :disabled="loading || !newMessage.trim()">
          {{ loading ? '...' : '→' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useWidgetAnalytics } from '~/composables/useWidgetAnalytics'

const props = defineProps<{
  projectId: string
  apiBase: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { trackEvent, getClientId } = useWidgetAnalytics()

const messages = ref([])
const newMessage = ref('')
const loading = ref(false)
const sessionId = ref(null)
const messagesContainer = ref(null)
let pollInterval = null

onMounted(async () => {
  await startChat()
  startPolling()
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

const startChat = async () => {
  try {
    const response = await fetch(`${props.apiBase}/widget/${props.projectId}/start_chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: getClientId(),
        page_url: window.location.href
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      sessionId.value = data.id
      messages.value = data.messages || []
      trackEvent('start_chat', { session_id: data.id })
    }
  } catch (error) {
    console.error('Failed to start chat:', error)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || loading.value) return
  
  const messageText = newMessage.value.trim()
  newMessage.value = ''
  loading.value = true
  
  try {
    const response = await fetch(`${props.apiBase}/widget/${props.projectId}/send_message/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: getClientId(),
        content: messageText,
        message_type: 'user'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      messages.value.push(data)
      await nextTick()
      scrollToBottom()
      
      trackEvent('send_message', { 
        session_id: sessionId.value,
        message_length: messageText.length 
      })
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    loading.value = false
  }
}

const loadMessages = async () => {
  if (!sessionId.value) return
  
  try {
    const response = await fetch(
      `${props.apiBase}/widget/${props.projectId}/chat_messages/?client_id=${getClientId()}`
    )
    
    if (response.ok) {
      const data = await response.json()
      const oldLength = messages.value.length
      messages.value = data
      
      // Scroll to bottom if new messages arrived
      if (data.length > oldLength) {
        await nextTick()
        scrollToBottom()
      }
    }
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

const startPolling = () => {
  pollInterval = setInterval(loadMessages, 2000) // Poll every 2 seconds
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
@import '~/assets/css/widget-forms.css';

.habio-chat-widget {
  display: flex;
  flex-direction: column;
  height: 400px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.habio-chat__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.habio-chat__messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
}

.habio-message {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.habio-message--user {
  align-items: flex-end;
}

.habio-message--admin {
  align-items: flex-start;
}

.habio-message--system {
  align-items: center;
}

.habio-message__content {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.habio-message--user .habio-message__content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.habio-message--admin .habio-message__content {
  background: white;
  color: #333;
  border: 1px solid #e1e5e9;
  border-bottom-left-radius: 4px;
}

.habio-message--system .habio-message__content {
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-style: italic;
  text-align: center;
}

.habio-message__time {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

.habio-chat__input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e1e5e9;
}

.habio-chat__input form {
  display: flex;
  gap: 8px;
}

.habio-chat__input-field {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.habio-chat__input-field:focus {
  border-color: #667eea;
}

.habio-chat__send {
  width: 40px;
  height: 40px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

.habio-chat__send:hover:not(:disabled) {
  transform: scale(1.05);
}

.habio-chat__send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>