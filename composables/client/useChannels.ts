import { ref } from 'vue'
import type { Channel } from '../shared/useWidgetConfig'

export const useChannels = () => {
  const { $api } = useNuxtApp()
  const channels = ref<Channel[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadChannels = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await $api.get('/channels/')
      channels.value = response.data
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
      const response = await $api.post('/channels/', data)
      const channel = response.data
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
      const response = await $api.put(`/channels/${id}/`, data)
      const channel = response.data
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
      await $api.delete(`/channels/${id}/`)
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

  // Additional functions for client interface
  const showChannelForm = ref(false)
  const editingChannel = ref<Channel | null>(null)
  const channelForm = ref({
    project: 0,
    channel_type: 'call',
    type: 'call',          
    label: '',
    link: '',
    phone_number: '',
    priority: 0,
    show_in_top: false,
    is_active: true,
  })
  

  const editChannel = (channel: Channel) => {
    editingChannel.value = channel
    channelForm.value = {
      project: channel.project?.id || 0,
      type: channel.channel_type || 'call',
      channel_type: channel.channel_type || 'call',
      label: channel.label || '',
      link: channel.link || '',
      phone_number: channel.phone_number || '',
      priority: channel.priority || 0,
      show_in_top: channel.show_in_top || false,
      is_active: channel.is_active || true,
    }
    showChannelForm.value = true
  }
  

  const saveChannel = async () => {
    try {
      const payload = { ...channelForm.value, type: channelForm.value.type }
      if (editingChannel.value) {
        await updateChannel(editingChannel.value.id, payload)
      } else {
        await createChannel(payload)
      }
      closeChannelForm()
    } catch (err) {
      console.error('Failed to save channel:', err)
    }
  }

  const handleDeleteChannel = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот канал?')) {
      try {
        await deleteChannel(id)
      } catch (err) {
        console.error('Failed to delete channel:', err)
      }
    }
  }

  const closeChannelForm = () => {
    showChannelForm.value = false
    editingChannel.value = null
    channelForm.value = {
      project: 0,
      channel_type: 'call',
      label: '',
      link: '',
      phone_number: '',
      priority: 0,
      show_in_top: false,
      is_active: true,
    }
  }

  return {
    channels,
    loading,
    error,
    loadChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    getChannel,
    showChannelForm,
    editingChannel,
    channelForm,
    editChannel,
    saveChannel,
    handleDeleteChannel,
    closeChannelForm
  }
}