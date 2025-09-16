import axios from "axios"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true
  })

  api.interceptors.request.use((request) => {
    // Check for client token first
    const clientTokenCookie = useCookie('client_access_token').value
    const adminTokenCookie = useCookie('admin_access_token').value
    let clientToken = clientTokenCookie
    let adminToken = adminTokenCookie

    if (typeof window !== 'undefined') {
      // Fallback to localStorage if cookies not used on client side
      clientToken = clientToken || localStorage.getItem('client_token') || undefined
      adminToken = adminToken || localStorage.getItem('admin_token') || undefined
    }
    
    if (clientToken) {
      request.headers.Authorization = `Bearer ${clientToken}`
    } else if (adminToken) {
      request.headers.Authorization = `Bearer ${adminToken}`
    }
    return request
  })

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Check if this is a client or admin request
        const clientRefreshTokenCookie = useCookie('client_refresh_token').value
        const adminRefreshTokenCookie = useCookie('admin_refresh_token').value
        const clientRefreshToken = typeof window !== 'undefined' ? (clientRefreshTokenCookie || localStorage.getItem('client_refresh_token')) : clientRefreshTokenCookie
        const adminRefreshToken = typeof window !== 'undefined' ? (adminRefreshTokenCookie || localStorage.getItem('admin_refresh_token') || localStorage.getItem('admin_refresh_token')) : adminRefreshTokenCookie
        
        if (clientRefreshToken) {
          // Handle client token refresh
          try {
            const { data } = await axios.post(`${config.public.apiBase}/auth/refresh/`, {
              refresh: clientRefreshToken
            })
            const newToken = data.access
            const accessTokenCookie = useCookie('client_access_token')
            accessTokenCookie.value = newToken
            if (typeof window !== 'undefined') {
              localStorage.setItem('client_token', newToken)
            }
            
            error.config.headers.Authorization = `Bearer ${newToken}`
            return api.request(error.config)
          } catch (refreshError) {
            const accessTokenCookie = useCookie('client_access_token')
            const refreshTokenCookie = useCookie('client_refresh_token')
            accessTokenCookie.value = null
            refreshTokenCookie.value = null
            if (typeof window !== 'undefined') {
              localStorage.removeItem('client_token')
              localStorage.removeItem('client_refresh_token')
              localStorage.removeItem('client_user')
            }
            // Redirect to client login
            await navigateTo('/client/auth/login')
          }
        } else if (adminRefreshToken) {
          // Handle admin token refresh
          try {
            const { data } = await axios.post(`${config.public.apiBase}/auth/refresh/`, {
              refresh: adminRefreshToken
            })
            const newToken = data.access
            const accessTokenCookie = useCookie('admin_access_token')
            accessTokenCookie.value = newToken
            if (typeof window !== 'undefined') {
              localStorage.setItem('admin_token', newToken)
            }
            
            error.config.headers.Authorization = `Bearer ${newToken}`
            return api.request(error.config)
          } catch (refreshError) {
            const accessTokenCookie = useCookie('admin_access_token')
            const refreshTokenCookie = useCookie('admin_refresh_token')
            accessTokenCookie.value = null
            refreshTokenCookie.value = null
            if (typeof window !== 'undefined') {
              localStorage.removeItem('admin_token')
              localStorage.removeItem('admin_refresh_token')
            }
            // Redirect to admin login
            await navigateTo('/admin/login')
          }
        } else {
          // No tokens, determine redirect based on current route
          const route = useRoute()
          if (route.path.startsWith('/client')) {
            await navigateTo('/client/auth/login')
          } else {
            await navigateTo('/admin/login')
          }
        }
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api
    }
  }
})
