import { ref } from 'vue'
import { useApi } from './useApi'
import type { Channel } from './useWidgetConfig'

export const useChannels = () => {
  const { api } = useApi()
  const channels = ref<Channel[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadChannels = async () => {
    try {
      loading.value = true
      error.value = null
      channels.value = await api.get<Channel[]>('/channels/')
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load channels'
      console.error('Failed to load channels:', err)
    } finally {
      loading.value = false
    }
  }

  const createChannel = async (data: Partial<Channel>) => {
    try {
      loading.value = true
      error.value = null
      const channel = await api.post<Channel>('/channels/', data)
      channels.value.push(channel)
      return channel
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create channel'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateChannel = async (id: number, data: Partial<Channel>) => {
    try {
      loading.value = true
      error.value = null
      const channel = await api.put<Channel>(`/channels/${id}/`, data)
      const index = channels.value.findIndex(c => c.id === id)
      if (index !== -1) {
        channels.value[index] = channel
      }
      return channel
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update channel'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteChannel = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/channels/${id}/`)
      channels.value = channels.value.filter(c => c.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete channel'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getChannel = (id: number) => {
    return channels.value.find(c => c.id === id)
  }

  return {
    channels,
    loading,
    error,
    loadChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    getChannel
  }
}