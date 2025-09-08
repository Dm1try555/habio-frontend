import { useAuth } from '~/composables/useAuth'
import { getRoleLabel as getRoleLabelUtil } from '~/utils/roleUtils'

export const useProfileScripts = () => {
  const { user } = useAuth()

  const getRoleLabel = getRoleLabelUtil

  const getRoleColor = (role: string | undefined | null) => {
    if (!role) return 'admin'
    return role as 'admin' | 'marketing' | 'viewer'
  }

  const getRoleDescription = (role: string | undefined | null) => {
    if (!role) return ''
    const descriptions = {
      admin: 'Полный доступ ко всем функциям системы',
      marketing: 'Управление каналами, расписанием и AB-тестами',
      viewer: 'Просмотр лидов, чатов и аналитики'
    }
    return descriptions[role as keyof typeof descriptions] || ''
  }

  const getRoleActions = (role: string | undefined | null) => {
    if (!role) return []
    
    const actions = {
      admin: [
        {
          title: 'Проекты',
          description: 'Создание и управление проектами',
          action: 'goToProjects',
          url: '/admin/admin/projects'
        },
        {
          title: 'Каналы',
          description: 'Настройка каналов связи и приоритетов',
          action: 'goToChannels',
          url: '/admin/admin/channels'
        },
        {
          title: 'Расписание',
          description: 'Настройка времени работы отделов',
          action: 'goToSchedules',
          url: '/admin/admin/schedule'
        },
        {
          title: 'Лиды',
          description: 'Просмотр и обработка входящих лидов',
          action: 'goToLeads',
          url: '/admin/admin/leads'
        },
        {
          title: 'Чат',
          description: 'Просмотр и управление чат-сессиями',
          action: 'goToChat',
          url: '/admin/admin/chats'
        },
        {
          title: 'Управление пользователями',
          description: 'Создание, редактирование и удаление пользователей',
          action: 'goToUsers',
          url: '/admin/admin/users'
        },
        {
          title: 'Настройки системы',
          description: 'Конфигурация системы и интеграций',
          action: 'goToSettings',
          url: '/admin/admin/settings'
        },
        {
          title: 'Аналитика',
          description: 'Отчеты и статистика',
          action: 'goToAnalytics',
          url: '/admin?tab=analytics'
        }
      ],
      marketing: [
        {
          title: 'Управление каналами',
          description: 'Настройка каналов связи и их приоритетов',
          action: 'goToChannels',
          url: '/admin/marketing/channels'
        },
        {
          title: 'Расписание работы',
          description: 'Настройка времени работы отделов',
          action: 'goToSchedules',
          url: '/admin/marketing/schedule'
        },
        
      ],
      viewer: [
        {
          title: 'Просмотр лидов',
          description: 'Просмотр и анализ входящих лидов',
          action: 'goToLeads',
          url: '/admin/viewer/leads'
        },
        {
          title: 'Чат-сессии',
          description: 'Просмотр активных чат-сессий',
          action: 'goToChat',
          url: '/admin/viewer/chats'
        },
        {
          title: 'Аналитика',
          description: 'Просмотр отчетов и статистики',
          action: 'goToAnalytics',
          url: '/admin?tab=analytics'
        }
      ]
    }
    
    return actions[role as keyof typeof actions] || []
  }

  const navigateToSection = (url: string) => {
    navigateTo(url)
  }

  return {
    user,
    getRoleLabel,
    getRoleColor,
    getRoleDescription,
    getRoleActions,
    navigateToSection
  }
}