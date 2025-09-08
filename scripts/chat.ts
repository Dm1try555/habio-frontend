import { ref, onMounted, watch } from 'vue'
import { useChat } from '~/composables/useChat'
import { formatDate } from '~/utils/dateUtils'

export const useChatScripts = () => {
  const {
    sessions: chatSessions,
    messages: chatMessages,
    selectedSession,
    loadSessions,
    sendMessage,
    selectSession,
    closeSession
  } = useChat()

  const newMessage = ref('')

  onMounted(async () => {
    try {
      await loadSessions()
      if (!selectedSession.value && chatSessions.value.length > 0) {
        await selectSession(chatSessions.value[0])
      }
    } catch (e) {
      console.error('Failed to initialize chat:', e)
    }
  })

  watch(chatSessions, async (list) => {
    if (!selectedSession.value && list && list.length > 0) {
      await selectSession(list[0])
    }
  })

  const handleSelectSession = async (session: any) => {
    await selectSession(session)
  }

  const sendAdminMessage = async () => {
    if (!newMessage.value.trim() || !selectedSession.value) return
    
    try {
      await sendMessage(selectedSession.value.id, newMessage.value.trim(), 'admin')
      newMessage.value = ''
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return {
    chatSessions,
    chatMessages,
    selectedSession,
    newMessage,
    loadSessions,
    sendMessage,
    selectSession,
    closeSession,
    handleSelectSession,
    sendAdminMessage,
    formatTime,
    formatDate
  }
}