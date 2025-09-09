import { ref, computed } from 'vue'

export interface Theme {
  id: string
  name: string
  type: 'builtin' | 'custom'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  layout: {
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    size: 'small' | 'medium' | 'large'
    animation: 'slide' | 'fade' | 'bounce'
  }
  custom_css?: string
  is_premium: boolean
}

export interface CustomThemeData {
  name: string
  colors: Theme['colors']
  layout: Theme['layout']
  custom_css?: string
}

export const useThemes = () => {
  const { $api } = useNuxtApp()
  const { isPremium } = useSubscription()
  
  const themes = ref<Theme[]>([])
  const currentTheme = ref<Theme | null>(null)
  const customThemes = ref<Theme[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const availableThemes = computed(() => {
    if (isPremium.value) {
      return themes.value
    }
    return themes.value.filter(theme => !theme.is_premium)
  })

  const canCreateCustomTheme = computed(() => isPremium.value)

  const loadThemes = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.get('client/themes/')
      themes.value = response.data.builtin_themes
      customThemes.value = response.data.custom_themes
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load themes'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadCurrentTheme = async () => {
    try {
      const response = await $api.get('client/themes/current/')
      currentTheme.value = response.data
    } catch (err: any) {
      console.error('Failed to load current theme:', err)
    }
  }

  const applyTheme = async (themeId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.post('client/themes/apply/', { theme_id: themeId })
      currentTheme.value = response.data
      
      // Apply theme to document
      applyThemeToDocument(response.data)
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to apply theme'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createCustomTheme = async (themeData: CustomThemeData) => {
    if (!canCreateCustomTheme.value) {
      throw new Error('Custom themes are only available for premium users')
    }

    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.post('client/themes/custom/', themeData)
      customThemes.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create custom theme'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCustomTheme = async (themeId: string, themeData: Partial<CustomThemeData>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.put(`client/themes/custom/${themeId}/`, themeData)
      
      const index = customThemes.value.findIndex(t => t.id === themeId)
      if (index !== -1) {
        customThemes.value[index] = response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update custom theme'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteCustomTheme = async (themeId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await $api.delete(`client/themes/custom/${themeId}/`)
      customThemes.value = customThemes.value.filter(t => t.id !== themeId)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete custom theme'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const applyThemeToDocument = (theme: Theme) => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const colors = theme.colors

    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-secondary', colors.secondary)
    root.style.setProperty('--theme-accent', colors.accent)
    root.style.setProperty('--theme-background', colors.background)
    root.style.setProperty('--theme-surface', colors.surface)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-text-secondary', colors.textSecondary)

    // Apply layout properties
    root.style.setProperty('--widget-position', theme.layout.position)
    root.style.setProperty('--widget-size', theme.layout.size)
    root.style.setProperty('--widget-animation', theme.layout.animation)

    // Apply custom CSS if available
    if (theme.custom_css) {
      let styleElement = document.getElementById('custom-theme-styles')
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = 'custom-theme-styles'
        document.head.appendChild(styleElement)
      }
      styleElement.textContent = theme.custom_css
    }
  }

  const resetToDefaultTheme = async () => {
    try {
      await applyTheme('default')
    } catch (err) {
      console.error('Failed to reset to default theme:', err)
    }
  }

  return {
    themes,
    currentTheme,
    customThemes,
    availableThemes,
    isLoading,
    error,
    canCreateCustomTheme,
    loadThemes,
    loadCurrentTheme,
    applyTheme,
    createCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    resetToDefaultTheme
  }
}