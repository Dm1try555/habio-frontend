export function useChannelMemory() {
  const getLastUsedChannel = () => {
    try {
      const lastUsed = localStorage.getItem('habio_last_channel')
      if (lastUsed) {
        const data = JSON.parse(lastUsed)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        if (data.timestamp > thirtyDaysAgo) {
          return data.channelId
        }
      }
    } catch (error) {
      console.warn('Failed to get last used channel:', error)
    }
    return null
  }

  const saveLastUsedChannel = (channelId: number) => {
    try {
      const data = {
        channelId,
        timestamp: Date.now()
      }
      localStorage.setItem('habio_last_channel', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save last used channel:', error)
    }
  }

  return {
    getLastUsedChannel,
    saveLastUsedChannel
  }
}