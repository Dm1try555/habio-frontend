import { ref } from 'vue'
import { useApi } from './useApi'

export interface ChatSession {
  id: number
  project: number
  client_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: number
  session: number
  message_type: string
  content: string
  created_at: string
}

export const useChat = () => {
  const { api } = useApi()
  const sessions = ref<ChatSession[]>([])
  const messages = ref<ChatMessage[]>([])
  const selectedSession = ref<ChatSession | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadSessions = async () => {
    try {
      loading.value = true
      error.value = null
      sessions.value = (await api.get<ChatSession[]>('/chat-sessions/')).data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load chat sessions'
      console.error('Failed to load chat sessions:', err)
    } finally {
      loading.value = false
    }
  }

  const loadMessages = async (sessionId: number | undefined | null) => {
    if (!sessionId) return
    try {
      loading.value = true
      error.value = null
      messages.value = (await api.get<ChatMessage[]>(`/chat-sessions/${sessionId}/messages/`)).data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load messages'
      console.error('Failed to load messages:', err)
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (sessionId: number, content: string, messageType: string = 'admin') => {
    try {
      loading.value = true
      error.value = null
      const message = (await api.post<ChatMessage>('/chat-messages/', {
        session: sessionId,
        message_type: messageType,
        content
      })).data
      messages.value.push(message as ChatMessage)
      return message
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to send message'
      throw err
    } finally {
      loading.value = false
    }
  }

  const selectSession = async (session: ChatSession | null | undefined) => {
    if (!session || !session.id) return
    selectedSession.value = session
    await loadMessages(session.id)
  }

  const closeSession = () => {
    selectedSession.value = null
    messages.value = []
  }

  return {
    sessions,
    messages,
    selectedSession,
    loading,
    error,
    loadSessions,
    loadMessages,
    sendMessage,
    selectSession,
    closeSession
  }
}