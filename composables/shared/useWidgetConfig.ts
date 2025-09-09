import { ref, computed } from 'vue'

export interface Channel {
  id: number
  type: 'call' | 'callback' | 'messenger' | 'chat' | 'form'
  label: string
  link?: string
  priority: number
  show_in_top: boolean
  icon?: string
  description?: string
}

export interface WidgetConfig {
  channels: Channel[]
  is_online: boolean
  next_available?: string
}

export function useWidgetConfig(projectId: string, apiBase: string) {
  const config = ref<WidgetConfig>({
    channels: [],
    is_online: false
  })
  const loading = ref(false)

  const isOnline = computed(() => config.value.is_online)
  const nextAvailable = computed(() => config.value.next_available || '09:00')

  const topChannels = computed(() => {
    // Always show call and callback first, then others up to 2 channels
    const callChannels = config.value.channels.filter(channel => 
      channel.type === 'call' || channel.type === 'callback'
    )
    const otherChannels = config.value.channels.filter(channel => 
      channel.type !== 'call' && channel.type !== 'callback'
    )
    
    // Combine: call/callback first, then others, limit to 2
    const combined = [...callChannels, ...otherChannels]
    return combined.slice(0, 2)
  })

  const otherChannels = computed(() => {
    // Show remaining channels (excluding those already in top)
    const topChannelIds = topChannels.value.map(channel => channel.id)
    return config.value.channels.filter(channel => 
      !topChannelIds.includes(channel.id)
    )
  })

  const loadConfig = async () => {
    loading.value = true
    try {
      const response = await fetch(`${apiBase}/widget/${projectId}/channels/?device=desktop`)
      if (response.ok) {
        const data = await response.json()
        config.value = data
      } else {
        console.error('API error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Failed to load widget config:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    config,
    loading,
    isOnline,
    nextAvailable,
    topChannels,
    otherChannels,
    loadConfig
  }
}