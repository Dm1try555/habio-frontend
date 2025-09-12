// Role utility functions
export const getRoleLabel = (role: string | undefined | null) => {
  if (!role) return ''
  const labels = {
    admin: 'Администратор',
    marketing: 'Маркетинг',
    viewer: 'Просмотр'
  }
  return labels[role as keyof typeof labels] || role
}

export const getRoleColor = (role: string) => {
  const colors = {
    admin: 'user-role--admin',
    marketing: 'user-role--marketing',
    viewer: 'user-role--viewer'
  }
  return colors[role as keyof typeof colors] || 'user-role--viewer'
}

export const getRoleDescription = (role: string | undefined | null) => {
  if (!role) return ''
  const map: Record<string, string> = {
    admin: 'Полный доступ к функционалу и настройкам системы',
    marketing: 'Управление каналами, контентом и аналитикой',
    viewer: 'Просмотр данных без права изменения'
  }
  return map[role] || ''
}

export const getRoleActions = (role: string | undefined | null) => {
  const actionsByRole: Record<string, Array<{ action: string; title: string; description: string; url: string }>> = {
    admin: [
      { action: 'users', title: 'Пользователи', description: 'Управление пользователями', url: '/admin/admin/users' },
      { action: 'projects', title: 'Проекты', description: 'Управление проектами', url: '/admin/admin/projects' },
      { action: 'channels', title: 'Каналы', description: 'Настройка каналов', url: '/admin/admin/channels' },
      { action: 'schedule', title: 'Расписание', description: 'Рабочие часы', url: '/admin/admin/schedule' },
      { action: 'settings', title: 'Настройки', description: 'Параметры системы', url: '/admin/admin/settings' },
    ],
    marketing: [
      { action: 'channels', title: 'Каналы', description: 'Настройка каналов', url: '/admin/marketing/channels' },
      { action: 'leads', title: 'Лиды', description: 'Заявки клиентов', url: '/admin/marketing/leads' },
      { action: 'chats', title: 'Чаты', description: 'Переписка с клиентами', url: '/admin/marketing/chats' },
      { action: 'settings', title: 'Настройки', description: 'Параметры профиля', url: '/admin/marketing/settings' },
    ],
    viewer: [
      { action: 'chats', title: 'Чаты', description: 'Общение с поддержкой/ботом', url: '/client/dashboard' },
      { action: 'leads', title: 'Лиды', description: 'Заявки и отклики', url: '/client/analytics' },
      { action: 'settings', title: 'Настройки', description: 'Личные и виджета', url: '/client/settings' },
    ],
  }
  return actionsByRole[role || 'viewer'] || []
}

export const useProfileScripts = () => {
  const userEmailCookie = useCookie('admin_user_email')
  const userRoleCookie = useCookie('admin_user_role')
  const user = computed(() => ({ email: userEmailCookie.value || '', role: userRoleCookie.value || 'viewer' }))
  return { user, getRoleLabel, getRoleColor, getRoleDescription, getRoleActions }
}