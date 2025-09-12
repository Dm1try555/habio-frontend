import { ref, computed } from 'vue'
import { navigateTo } from '#app'

export interface ClientUser {
  id: number
  email: string
  first_name: string
  last_name: string
  role: 'viewer'
  is_active: boolean
}

export const useClientAuth = () => {
  const { $api } = useNuxtApp()
  const user = ref<ClientUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // ==================== LOGIN ====================
  const login = async (credentials: { email: string; password: string }) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $api.post('/auth/login/', credentials)
      const { user: userData, access, refresh } = response.data

      // сохраняем токены и пользователя
      if (typeof window !== 'undefined') {
        localStorage.setItem('client_token', access)
        localStorage.setItem('client_refresh_token', refresh)
        localStorage.setItem('client_user', JSON.stringify(userData))
      }

      user.value = userData

      navigateTo('/client/dashboard')
      return userData
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Ошибка входа'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ==================== LOGOUT ====================
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('client_refresh_token')
      const accessToken = localStorage.getItem('client_token')
  
      if (refreshToken && accessToken) {
        await $api.post(
          '/auth/logout/',
          { refresh: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )
      }
    } catch (err) {
      console.warn('Серверный logout не прошел, очищаем локально', err)
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('client_token')
        localStorage.removeItem('client_refresh_token')
        localStorage.removeItem('client_user')
      }
      user.value = null
      navigateTo('/client/auth/login')
    }
  }
  

  // ==================== CHECK AUTH ====================
  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('client_token')
      const userData = localStorage.getItem('client_user')

      if (token && userData) {
        try {
          user.value = JSON.parse(userData)
        } catch (e) {
          logout()
        }
      }
    }
  }

  if (typeof window !== 'undefined') checkAuth()

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
}
