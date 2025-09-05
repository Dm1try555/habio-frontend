export function useChannelIcons() {
  const getChannelIcon = (type: string) => {
    const icons = {
      call: '📞',
      callback: '⏰',
      messenger: '💬',
      chat: '💭',
      form: '📝'
    }
    return icons[type as keyof typeof icons] || '📞'
  }

  return {
    getChannelIcon
  }
}