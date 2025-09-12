<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h2>Чат с клиентами</h2>
    </div>
    
    <div class="chat-container">
      <div class="chat-sessions">
        <h3>Активные сессии</h3>
        <div class="sessions-list">
          <div
            v-for="session in chatSessions"
            :key="session.id"
            :class="['session-item', { 'session-item--active': selectedSession?.id === session.id }]"
            @click="handleSelectSession(session)"
          >
            <div class="session-info">
              <div class="session-client">{{ session.client_id }}</div>
              <div class="session-time">{{ formatDate(session.updated_at) }}</div>
            </div>
            <div class="session-status">
              <span :class="['status-dot', session.is_active ? 'status-dot--active' : 'status-dot--inactive']"></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-messages" v-if="selectedSession">
        <div class="chat-header">
          <h4>Сессия {{ selectedSession.id }}</h4>
          <button @click="selectedSession = null" class="btn btn--small">Закрыть</button>
        </div>
        
        <div class="messages-container" ref="messagesContainer">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            :class="['message', `message--${message.message_type}`]"
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.created_at) }}</div>
          </div>
        </div>
        
        <div class="message-input">
          <form @submit.prevent="sendAdminMessage">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Введите сообщение..."
              class="message-field"
            />
            <button type="submit" class="btn btn--primary btn--small">Отправить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChat } from '~/composables/admin/useChat'

const {
  chatSessions,
  chatMessages,
  selectedSession,
  newMessage,
  handleSelectSession,
  sendAdminMessage,
  formatTime,
  formatDate
} = useChat()
</script>