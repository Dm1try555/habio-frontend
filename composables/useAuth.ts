import { ref, computed, onMounted } from 'vue'
import { useApi } from './useApi'

interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'marketing' | 'viewer'
  is_active: boolean
  created_at: string
  updated_at: string
}

interface LoginData {
  username: string
  password: string
  role?: string
}

export const useAuth = () => {
  const { api, post, get } = useApi()
  
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMarketing = computed(() => user.value?.role === 'marketing')
  const isViewer = computed(() => user.value?.role === 'viewer')
  const canManageUsers = computed(() => isAdmin.value)

  const getRedirectUrl = (role: string) => {
    return `/admin/${role}`
  }

  // Initialize tokens on client side
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token')
      const storedRefreshToken = localStorage.getItem('refresh_token')
      const userRole = localStorage.getItem('user_role')
      const userEmail = localStorage.getItem('user_email')
      
      if (storedToken && storedRefreshToken && userEmail) {
        token.value = storedToken
        refreshToken.value = storedRefreshToken
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        // Create a simple user object from stored data
        user.value = {
          id: 1,
          username: userEmail,
          email: userEmail,
          role: (userRole as 'admin' | 'marketing' | 'viewer') || 'viewer',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      } else {
        // Clear any existing token if no valid data
        api.defaults.headers.common['Authorization'] = ''
      }
    }
  })

  const login = async (data: LoginData) => {
    try {
      isLoading.value = true
      error.value = null

      // Clear any existing token before login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_role')
      }
      api.defaults.headers.common['Authorization'] = ''

      // Real API authentication
      console.log('Attempting login with:', data)
      const response = await post('auth/login/', {
        username: data.username,
        password: data.password
      })
      console.log('Login response:', response)

      if (!response) {
        throw new Error('Invalid response from server')
      }

      const { access, refresh, user: userData } = response as { access: string, refresh: string, user: User }

      // Update state
      user.value = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        is_active: userData.is_active,
        created_at: userData.created_at,
        updated_at: userData.created_at
      }
      token.value = access
      refreshToken.value = refresh

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
        localStorage.setItem('user_email', userData.email)
        localStorage.setItem('user_role', userData.role)
      }
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`

      // Get redirect URL based on role
      const redirectUrl = getRedirectUrl(userData.role)

      return { user: user.value, access, refresh, redirectUrl }
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.response?.data?.error || err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    // Clear state
    user.value = null
    token.value = null
    refreshToken.value = null
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_email')
      localStorage.removeItem('user_role')
    }
    
    // Clear API headers
    delete api.defaults.headers.common['Authorization']
  }

  const checkAuth = async () => {
    if (token.value && user.value) {
      return user.value
    }
    return null
  }

  return {
    user,
    token,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isMarketing,
    isViewer,
    canManageUsers,
    login,
    logout,
    checkAuth
  }
}