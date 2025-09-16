<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Чат поддержки</h1>
      <p>Общение с клиентами через виджет</p>
    </div>

    <div class="page-content">
      <div class="chat-layout">
        <!-- Chat Sessions List -->
        <div class="sessions-sidebar">
          <div class="sessions-header">
            <h3>Активные чаты</h3>
            <button class="base-button base-button--primary base-button--small" @click="refreshSessions">
              Обновить
            </button>
          </div>
          
          <div class="sessions-list">
            <div 
              v-for="session in sessions" 
              :key="session.id"
              class="session-item"
              :class="{ active: selectedSession?.id === session.id }"
              @click="selectSession(session)"
            >
              <div class="session-avatar">
                {{ getSessionAvatar(session.client_name) }}
              </div>
              <div class="session-info">
                <div class="session-name">{{ session.client_name || 'Анонимный клиент' }}</div>
                <div class="session-preview">{{ session.last_message || 'Нет сообщений' }}</div>
                <div class="session-time">{{ formatTime(session.updated_at) }}</div>
              </div>
              <div class="session-status">
                <span class="status-indicator" :class="`status-indicator--${session.is_active ? 'online' : 'offline'}`">
                  {{ session.is_active ? 'Онлайн' : 'Офлайн' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="chat-main">
          <div v-if="selectedSession" class="chat-container">
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="chat-client-info">
                <div class="client-avatar">
                  {{ getSessionAvatar(selectedSession.client_name) }}
                </div>
                <div class="client-details">
                  <h4>{{ selectedSession.client_name || 'Анонимный клиент' }}</h4>
                  <p>{{ selectedSession.page_url }}</p>
                </div>
              </div>
              <div class="chat-actions">
                <button class="base-button base-button--outline base-button--small" @click="endSession">
                  Завершить чат
                </button>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="messages-container" ref="messagesContainer">
              <div v-for="message in selectedSession.messages" :key="message.id" class="message" :class="`message--${message.message_type}`">
                <div class="message-avatar" v-if="message.message_type === 'user'">
                  {{ getSessionAvatar(selectedSession.client_name) }}
                </div>
                <div class="message-content">
                  <div class="message-text">{{ message.content }}</div>
                  <div class="message-time">{{ formatTime(message.created_at) }}</div>
                </div>
                <div class="message-avatar" v-if="message.message_type === 'admin'">
                  {{ getAdminAvatar() }}
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="message-input">
              <div class="input-container">
                <input 
                  type="text" 
                  v-model="newMessage" 
                  @keypress.enter="sendMessage"
                  placeholder="Введите сообщение..."
                  class="base-input"
                  :disabled="!selectedSession.is_active"
                />
                <button 
                  @click="sendMessage" 
                  class="base-button base-button--primary"
                  :disabled="!newMessage.trim() || !selectedSession.is_active"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>

          <!-- No Session Selected -->
          <div v-else class="no-session">
            <div class="no-session-content">
              <div class="no-session-icon">💬</div>
              <h3>Выберите чат</h3>
              <p>Выберите активный чат из списка слева для начала общения</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'
import { useApi } from '~/composables/shared/useApi'

const { user, isAuthenticated } = useClientAuth()
const { api } = useApi()

const sessions = ref([])
const selectedSession = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)

const loadSessions = async () => {
  try {
    const response = await api.get('/chat/sessions/')
    sessions.value = response.data
  } catch (error) {
    console.error('Failed to load sessions:', error)
    // Mock data for demo
    sessions.value = [
      {
        id: 1,
        client_name: 'Иван Петров',
        client_id: 'client_123',
        page_url: 'https://example.com',
        is_active: true,
        last_message: 'Здравствуйте, у меня вопрос по продукту',
        updated_at: new Date().toISOString(),
        messages: [
          {
            id: 1,
            message_type: 'user',
            content: 'Здравствуйте, у меня вопрос по продукту',
            created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            message_type: 'admin',
            content: 'Здравствуйте! Конечно, отвечу на ваши вопросы. Что именно вас интересует?',
            created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 2,
        client_name: 'Мария Сидорова',
        client_id: 'client_456',
        page_url: 'https://example.com/pricing',
        is_active: false,
        last_message: 'Спасибо за помощь!',
        updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        messages: [
          {
            id: 3,
            message_type: 'user',
            content: 'Какие у вас тарифы?',
            created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            message_type: 'admin',
            content: 'У нас есть бесплатный тариф и платный за $29/месяц. Хотите узнать подробности?',
            created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            message_type: 'user',
            content: 'Спасибо за помощь!',
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          }
        ]
      }
    ]
  }
}

const selectSession = (session: any) => {
  selectedSession.value = session
  scrollToBottom()
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedSession.value) return

  try {
    const response = await api.post(`/chat/sessions/${selectedSession.value.id}/messages/`, {
      content: newMessage.value,
      message_type: 'admin'
    })
    
    // Add message to current session
    selectedSession.value.messages.push(response.data)
    selectedSession.value.last_message = newMessage.value
    selectedSession.value.updated_at = new Date().toISOString()
    
    newMessage.value = ''
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

const endSession = async () => {
  if (!selectedSession.value) return

  try {
    await api.patch(`/chat/sessions/${selectedSession.value.id}/`, {
      is_active: false
    })
    
    selectedSession.value.is_active = false
    selectedSession.value = null
  } catch (error) {
    console.error('Failed to end session:', error)
  }
}

const refreshSessions = () => {
  loadSessions()
}

const getSessionAvatar = (name: string) => {
  if (!name) return '👤'
  return name.charAt(0).toUpperCase()
}

const getAdminAvatar = () => {
  return '👨‍💼'
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60 * 1000) return 'только что'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} мин назад`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} ч назад`
  
  return date.toLocaleDateString('ru-RU')
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Auto-scroll when new messages arrive
watch(() => selectedSession.value?.messages?.length, () => {
  nextTick(() => scrollToBottom())
})

onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/client/auth/login')
    return
  }
  
  await loadSessions()
})
</script>

<style scoped>
.chat-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  height: calc(100vh - 200px);
}

.sessions-sidebar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.sessions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.sessions-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.sessions-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.session-item:hover {
  background: #f8f9fa;
}

.session-item.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.session-avatar {
  width: 40px;
  height: 40px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
}

.session-preview {
  color: #666;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.session-time {
  color: #999;
  font-size: 11px;
}

.session-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat-main {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.chat-client-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.client-avatar {
  width: 40px;
  height: 40px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.client-details h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 16px;
}

.client-details p {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.message--user {
  flex-direction: row;
}

.message--admin {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  background: #6c757d;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  flex-shrink: 0;
}

.message--admin .message-avatar {
  background: #007bff;
}

.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message--user .message-content {
  align-items: flex-start;
}

.message--admin .message-content {
  align-items: flex-end;
}

.message-text {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
}

.message--admin .message-text {
  background: #007bff;
  color: white;
}

.message-time {
  font-size: 11px;
  color: #999;
  padding: 0 4px;
}

.message-input {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.input-container .base-input {
  flex: 1;
  margin: 0;
}

.no-session {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f8f9fa;
}

.no-session-content {
  text-align: center;
  color: #666;
}

.no-session-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-session-content h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.no-session-content p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .chat-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .sessions-sidebar {
    height: 200px;
  }
  
  .chat-main {
    height: 400px;
  }
}
</style>