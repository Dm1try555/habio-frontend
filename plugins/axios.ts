import axios from "axios"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true
  })

  api.interceptors.request.use((request) => {
    const token = useCookie('access_token').value
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }
    return request
  })

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = useCookie('refresh_token').value
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${config.public.apiBase}/auth/refresh/`, {
              refresh: refreshToken
            })
            const newToken = data.access
            const accessTokenCookie = useCookie('access_token')
            accessTokenCookie.value = newToken
            
            error.config.headers.Authorization = `Bearer ${newToken}`
            return api.request(error.config)
          } catch (refreshError) {
            const accessTokenCookie = useCookie('access_token')
            const refreshTokenCookie = useCookie('refresh_token')
            accessTokenCookie.value = null
            refreshTokenCookie.value = null
            await navigateTo('/admin/login')
          }
        } else {
          await navigateTo('/admin/login')
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
