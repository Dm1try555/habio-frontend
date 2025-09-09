import { ref, computed } from 'vue'

export interface ClientUser {
  id: number
  email: string
  name: string
  subscription: 'free' | 'premium'
  subscription_expires_at?: string
  created_at: string
  projects_count: number
  max_projects: number
  max_languages: number
  max_themes: number
  custom_styles_enabled: boolean
}

export interface ClientLoginData {
  email: string
  password: string
}

export interface ClientRegisterData {
  email: string
  password: string
  name: string
}

export const useClientAuth = () => {
  const { $api } = useNuxtApp()
  
  const user = ref<ClientUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const accessTokenCookie = useCookie('client_access_token')
  const refreshTokenCookie = useCookie('client_refresh_token')
  const userDataCookie = useCookie('client_user_data')

  const isAuthenticated = computed(() => !!user.value && !!accessTokenCookie.value)
  const isPremium = computed(() => user.value?.subscription === 'premium')
  const canCreateProject = computed(() => 
    user.value ? user.value.projects_count < user.value.max_projects : false
  )

  const login = async (data: ClientLoginData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $api.post('client/auth/login/', data)

      if (!response.data) {
        throw new Error('Invalid response from server')
      }

      const { access, refresh, user: userData } = response.data

      user.value = userData
      accessTokenCookie.value = access
      refreshTokenCookie.value = refresh
      userDataCookie.value = JSON.stringify(userData)

      return { user: user.value, access, refresh }
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: ClientRegisterData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $api.post('client/auth/register/', data)

      if (!response.data) {
        throw new Error('Invalid response from server')
      }

      const { access, refresh, user: userData } = response.data

      user.value = userData
      accessTokenCookie.value = access
      refreshTokenCookie.value = refresh
      userDataCookie.value = JSON.stringify(userData)

      return { user: user.value, access, refresh }
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    user.value = null
    accessTokenCookie.value = null
    refreshTokenCookie.value = null
    userDataCookie.value = null
  }

  const checkAuth = async () => {
    if (accessTokenCookie.value && userDataCookie.value) {
      try {
        user.value = JSON.parse(userDataCookie.value)
        return user.value
      } catch {
        await logout()
      }
    }
    return null
  }

  const refreshUserData = async () => {
    if (!accessTokenCookie.value) return

    try {
      const response = await $api.get('client/auth/me/')
      user.value = response.data
      userDataCookie.value = JSON.stringify(response.data)
    } catch (err) {
      console.error('Failed to refresh user data:', err)
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isPremium,
    canCreateProject,
    login,
    register,
    logout,
    checkAuth,
    refreshUserData
  }
}