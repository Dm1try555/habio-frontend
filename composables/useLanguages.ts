import { ref, computed } from 'vue'

export interface Language {
  code: string
  name: string
  native_name: string
  flag: string
  is_premium: boolean
}

export interface Translation {
  key: string
  value: string
  language: string
}

export const useLanguages = () => {
  const { $api } = useNuxtApp()
  const { isPremium } = useSubscription()
  
  const languages = ref<Language[]>([])
  const currentLanguage = ref<string>('en')
  const translations = ref<Translation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const availableLanguages = computed(() => {
    if (isPremium.value) {
      return languages.value
    }
    return languages.value.filter(lang => !lang.is_premium)
  })

  const canAddLanguage = computed(() => {
    if (!isPremium.value) {
      return availableLanguages.value.length < 3
    }
    return availableLanguages.value.length < 8
  })

  const loadLanguages = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.get('client/languages/')
      languages.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load languages'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadTranslations = async (languageCode: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.get(`client/languages/${languageCode}/translations/`)
      translations.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load translations'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addLanguage = async (languageCode: string) => {
    if (!canAddLanguage.value) {
      throw new Error('Language limit reached. Upgrade to premium for more languages.')
    }

    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.post('client/languages/', { language_code: languageCode })
      
      // Reload languages to get updated list
      await loadLanguages()
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to add language'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeLanguage = async (languageCode: string) => {
    if (languageCode === 'en') {
      throw new Error('Cannot remove default language')
    }

    try {
      isLoading.value = true
      error.value = null
      
      await $api.delete(`client/languages/${languageCode}/`)
      
      // Reload languages to get updated list
      await loadLanguages()
      
      // If current language was removed, switch to default
      if (currentLanguage.value === languageCode) {
        currentLanguage.value = 'en'
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to remove language'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateTranslation = async (key: string, languageCode: string, value: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.put(`client/languages/${languageCode}/translations/${key}/`, {
        value
      })
      
      // Update local translations
      const index = translations.value.findIndex(t => t.key === key && t.language === languageCode)
      if (index !== -1) {
        translations.value[index] = response.data
      } else {
        translations.value.push(response.data)
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update translation'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setCurrentLanguage = async (languageCode: string) => {
    try {
      await $api.post('client/languages/set-current/', { language_code: languageCode })
      currentLanguage.value = languageCode
      
      // Load translations for the new language
      await loadTranslations(languageCode)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to set current language'
      throw err
    }
  }

  const getTranslation = (key: string, languageCode?: string): string => {
    const lang = languageCode || currentLanguage.value
    const translation = translations.value.find(t => t.key === key && t.language === lang)
    return translation?.value || key
  }

  const exportTranslations = async (languageCode: string) => {
    try {
      const response = await $api.get(`client/languages/${languageCode}/export/`, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `translations_${languageCode}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to export translations'
      throw err
    }
  }

  const importTranslations = async (languageCode: string, file: File) => {
    try {
      isLoading.value = true
      error.value = null
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await $api.post(`client/languages/${languageCode}/import/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Reload translations
      await loadTranslations(languageCode)
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to import translations'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    languages,
    currentLanguage,
    translations,
    availableLanguages,
    isLoading,
    error,
    canAddLanguage,
    loadLanguages,
    loadTranslations,
    addLanguage,
    removeLanguage,
    updateTranslation,
    setCurrentLanguage,
    getTranslation,
    exportTranslations,
    importTranslations
  }
}