import { ref } from 'vue'
import { useApi } from './useApi'

export interface WebhookSettings {
url: string
secret: string
project: number
}

export interface LocaleSettings {
default: string
supported: string[]
}

export interface SecuritySettings {
  requireHttps: boolean
  enableCors: boolean
  rateLimit: boolean
}

export const useSettings = () => {
  const { api } = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const webhookSettings = ref<WebhookSettings>({
    url: '',
    secret: '',
    project: 1
  })

  const localeSettings = ref<LocaleSettings>({
    default: 'ru',
    supported: ['ru', 'en', 'uk']
  })

  const securitySettings = ref<SecuritySettings>({
    requireHttps: true,
    enableCors: true,
    rateLimit: true
  })

  const availableLanguages = ref([
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
    { code: 'ru', name: 'Русский' }
  ])

  const loadSettings = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Load webhook settings from project
      const project = await api.get('/projects/1/')
      webhookSettings.value = {
        url: project.data.webhook_url || '',
        secret: project.data.webhook_secret || '',
        project: project.data.id
      }

      // Load locale settings from localStorage
      const savedLocale = localStorage.getItem('locale_settings')
      if (savedLocale) {
        localeSettings.value = JSON.parse(savedLocale)
      }

      // Load security settings from localStorage
      const savedSecurity = localStorage.getItem('security_settings')
      if (savedSecurity) {
        securitySettings.value = JSON.parse(savedSecurity)
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load settings'
      console.error('Failed to load settings:', err)
    } finally {
      loading.value = false
    }
  }

  const saveWebhookSettings = async () => {
    try {
      loading.value = true
      error.value = null
      
      await api.patch('/projects/1/', {
        webhook_url: webhookSettings.value.url,
        webhook_secret: webhookSettings.value.secret
      })
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to save webhook settings'
      throw err
    } finally {
      loading.value = false
    }
  }

  const saveLocaleSettings = async () => {
    try {
      loading.value = true
      error.value = null
      
      localStorage.setItem('locale_settings', JSON.stringify(localeSettings.value))
      return true
    } catch (err: any) {
      error.value = 'Failed to save locale settings'
      throw err
    } finally {
      loading.value = false
    }
  }

  const saveSecuritySettings = async () => {
    try {
      loading.value = true
      error.value = null
      
      localStorage.setItem('security_settings', JSON.stringify(securitySettings.value))
      return true
    } catch (err: any) {
      error.value = 'Failed to save security settings'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    webhookSettings,
    localeSettings,
    securitySettings,
    availableLanguages,
    loading,
    error,
    loadSettings,
    saveWebhookSettings,
    saveLocaleSettings,
    saveSecuritySettings
  }
}