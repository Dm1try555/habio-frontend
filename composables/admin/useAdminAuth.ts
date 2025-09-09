import { ref, computed, onMounted } from 'vue'

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
  const { $api } = useNuxtApp()
  
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const accessTokenCookie = useCookie('access_token')
  const refreshTokenCookie = useCookie('refresh_token')
  const userRoleCookie = useCookie('user_role')
  const userEmailCookie = useCookie('user_email')

  // Computed properties
  const isAuthenticated = computed(() => !!user.value && !!accessTokenCookie.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMarketing = computed(() => user.value?.role === 'marketing')
  const isViewer = computed(() => user.value?.role === 'viewer')
  const canManageUsers = computed(() => isAdmin.value)

  const getRedirectUrl = (role: string) => {
    return `/admin/${role}`
  }

  // Initialize user from cookies
  onMounted(() => {
    if (accessTokenCookie.value && userEmailCookie.value) {
      user.value = {
        id: 1,
        username: userEmailCookie.value,
        email: userEmailCookie.value,
        role: (userRoleCookie.value as 'admin' | 'marketing' | 'viewer') || 'viewer',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  })

  const login = async (data: LoginData) => {
    try {
      isLoading.value = true
      error.value = null

      // Clear any existing tokens
      accessTokenCookie.value = null
      refreshTokenCookie.value = null
      userEmailCookie.value = null
      userRoleCookie.value = null

      // Real API authentication
      const response = await $api.post('auth/login/', {
        username: data.username,
        password: data.password
      })

      if (!response.data) {
        throw new Error('Invalid response from server')
      }

      const { access, refresh, user: userData } = response.data

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

      // Save to cookies
      accessTokenCookie.value = access
      refreshTokenCookie.value = refresh
      userEmailCookie.value = userData.email
      userRoleCookie.value = userData.role

      // Get redirect URL based on role
      const redirectUrl = getRedirectUrl(userData.role)

      return { user: user.value, access, refresh, redirectUrl }
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    // Clear state
    user.value = null
    
    // Clear cookies
    accessTokenCookie.value = null
    refreshTokenCookie.value = null
    userEmailCookie.value = null
    userRoleCookie.value = null
  }

  const checkAuth = async () => {
    if (accessTokenCookie.value && user.value) {
      return user.value
    }
    return null
  }

  return {
    user,
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