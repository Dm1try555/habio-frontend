import { useSettings } from '~/composables/useSettings'

export const useSettingScripts = () => {
  const {
    webhookSettings,
    localeSettings,
    securitySettings,
    availableLanguages,
    loadSettings,
    saveWebhookSettings,
    saveLocaleSettings,
    saveSecuritySettings
  } = useSettings()

  const handleSaveWebhookSettings = async () => {
    try {
      await saveWebhookSettings()
      alert('Webhook настройки сохранены')
    } catch (error) {
      console.error('Failed to save webhook settings:', error)
      alert('Ошибка при сохранении webhook настроек')
    }
  }

  const handleSaveLocaleSettings = async () => {
    try {
      await saveLocaleSettings()
      alert('Настройки локализации сохранены')
    } catch (error) {
      console.error('Failed to save locale settings:', error)
      alert('Ошибка при сохранении настроек локализации')
    }
  }

  const handleSaveSecuritySettings = async () => {
    try {
      await saveSecuritySettings()
      alert('Настройки безопасности сохранены')
    } catch (error) {
      console.error('Failed to save security settings:', error)
      alert('Ошибка при сохранении настроек безопасности')
    }
  }

  return {
    settings: webhookSettings,
    loadSettings,
    webhookSettings,
    localeSettings,
    securitySettings,
    availableLanguages,
    handleSaveWebhookSettings,
    handleSaveLocaleSettings,
    handleSaveSecuritySettings
  }
}