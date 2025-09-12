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

  const login = async (credentials: { email: string; password: string }) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.post('/auth/login/', credentials)
      const { user: userData, token } = response.data
      
      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('client_token', token)
        localStorage.setItem('client_user', JSON.stringify(userData))
      }
      
      user.value = userData
  
      // Redirect based on role
      if (userData.role === 'viewer') {
        navigateTo('/client/dashboard')
      } else {
        navigateTo('/client/dashboard')
      }
  
      return userData
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Ошибка входа'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  

  const register = async (userData: { 
    email: string; 
    password: string; 
    first_name: string; 
    last_name: string 
  }) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.post('/auth/register/', userData)
      const { user: newUser, token } = response.data
      
      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('client_token', token)
        localStorage.setItem('client_user', JSON.stringify(newUser))
      }
      
      user.value = newUser
      return newUser
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Ошибка регистрации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('client_token')
      localStorage.removeItem('client_user')
    }
    user.value = null
  }

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('client_token')
      const userData = localStorage.getItem('client_user')
      
      if (token && userData) {
        try {
          user.value = JSON.parse(userData)
          
          // Redirect if already authenticated
          if (user.value?.role === 'viewer') {
            navigateTo('/client/dashboard')
          } else {
            navigateTo('/client/dashboard')
          }
        } catch (e) {
          logout()
        }
      }
    }
  }
  

  const updateProfile = async (data: Partial<ClientUser>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.put('/auth/profile/', data)
      const updatedUser = response.data
      
      user.value = updatedUser
      if (typeof window !== 'undefined') {
        localStorage.setItem('client_user', JSON.stringify(updatedUser))
      }
      
      return updatedUser
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Ошибка обновления профиля'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Initialize auth on mount
  if (typeof window !== 'undefined') {
    checkAuth()
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    updateProfile
  }
}