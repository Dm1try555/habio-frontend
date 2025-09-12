import axios from "axios"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true
  })

  api.interceptors.request.use((request) => {
    // Check for client token first
    const clientToken = useCookie('client_access_token').value
    const adminToken = useCookie('admin_access_token').value
    
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
        const clientRefreshToken = useCookie('client_refresh_token').value
        const adminRefreshToken = useCookie('admin_refresh_token').value
        
        if (clientRefreshToken) {
          // Handle client token refresh
          try {
            const { data } = await axios.post(`${config.public.apiBase}/auth/refresh/`, {
              refresh: clientRefreshToken
            })
            const newToken = data.access
            const accessTokenCookie = useCookie('client_access_token')
            accessTokenCookie.value = newToken
            
            error.config.headers.Authorization = `Bearer ${newToken}`
            return api.request(error.config)
          } catch (refreshError) {
            const accessTokenCookie = useCookie('client_access_token')
            const refreshTokenCookie = useCookie('client_refresh_token')
            accessTokenCookie.value = null
            refreshTokenCookie.value = null
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
            
            error.config.headers.Authorization = `Bearer ${newToken}`
            return api.request(error.config)
          } catch (refreshError) {
            const accessTokenCookie = useCookie('admin_access_token')
            const refreshTokenCookie = useCookie('admin_refresh_token')
            accessTokenCookie.value = null
            refreshTokenCookie.value = null
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
