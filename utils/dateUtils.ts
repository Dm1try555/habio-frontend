// Date utility functions
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU')
}

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}