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
import { useWidgetAnalytics } from '~/composables/shared/useWidgetAnalytics'

interface ChatMessage {
  id: number
  content: string
  message_type: 'user' | 'admin' | 'system'
  created_at: string
}

const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  apiBase: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const { trackEvent, getClientId } = useWidgetAnalytics()

const messages = ref<ChatMessage[]>([])
const newMessage = ref('')
const loading = ref(false)
const sessionId = ref<string | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)
let pollInterval: number | null = null

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
      const data: ChatMessage[] = await response.json()
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

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
/* Widget styles are now imported globally in nuxt.config.ts */
</style>