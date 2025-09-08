import { ref } from 'vue'
import { useChannels } from '~/composables/useChannels'

export const useChannelScripts = () => {
  const {
    channels,
    loadChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    getChannel
  } = useChannels()

  const showChannelForm = ref(false)
  const editingChannel = ref(null)

  const channelForm = ref({
    project: '',
    channel_type: 'call',
    label: '',
    link: '',
    phone_number: '',
    priority: 0,
    show_in_top: false,
    is_active: true
  })

  const getChannelName = (channelId: number) => {
    const channel = getChannel(channelId)
    return channel ? channel.label : `Channel ${channelId}`
  }

  const editChannel = (channel: any) => {
    editingChannel.value = channel
    channelForm.value = { 
      ...channel,
      phone_number: channel.phone_number || ''
    }
    showChannelForm.value = true
  }

  const saveChannel = async () => {
    try {
      if (editingChannel.value) {
        await updateChannel(editingChannel.value.id, channelForm.value)
      } else {
        await createChannel(channelForm.value)
      }
      closeChannelForm()
    } catch (error) {
      console.error('Failed to save channel:', error)
    }
  }

  const handleDeleteChannel = async (id: number) => {
    if (confirm('Удалить канал?')) {
      try {
        await deleteChannel(id)
      } catch (error) {
        console.error('Failed to delete channel:', error)
      }
    }
  }

  const closeChannelForm = () => {
    showChannelForm.value = false
    editingChannel.value = null
    channelForm.value = { 
      project: '', 
      channel_type: 'call', 
      label: '', 
      link: '', 
      phone_number: '',
      priority: 0, 
      show_in_top: false, 
      is_active: true 
    }
  }

  return {
    channels,
    loadChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    getChannel,
    showChannelForm,
    editingChannel,
    channelForm,
    getChannelName,
    editChannel,
    saveChannel,
    handleDeleteChannel,
    closeChannelForm
  }
}