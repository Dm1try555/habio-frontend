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
  email: string
  password: string
  role: 'admin' | 'marketing' | 'viewer'
}

export const useAuth = () => {
  const { $api } = useNuxtApp()
  
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const accessTokenCookie = useCookie('admin_access_token')
  const refreshTokenCookie = useCookie('admin_refresh_token')
  const userRoleCookie = useCookie('admin_user_role')
  const userEmailCookie = useCookie('admin_user_email')

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
        email: data.email,
        password: data.password,
        role: data.role,
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
        role: data.role, 
        is_active: userData.is_active,
        created_at: userData.created_at,
        updated_at: userData.created_at
      }

      // Save to cookies
      accessTokenCookie.value = access
      refreshTokenCookie.value = refresh
      userEmailCookie.value = userData.email
      userRoleCookie.value = data.role

      // Get redirect URL based on role
      const redirectUrl = getRedirectUrl(data.role)

      return { user: user.value, access, refresh, redirectUrl }
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (refreshTokenCookie.value) {
        await $api.post('auth/logout/', { refresh: refreshTokenCookie.value })
      }
    } catch (e) {}
    user.value = null
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