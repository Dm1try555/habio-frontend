import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    console.error('Error details:', error)
    return Promise.reject(error)
  }
)

export const useApi = () => {
  return {
    api,
    
    // Generic CRUD methods
    async get<T>(url: string): Promise<T> {
      const response = await api.get(url)
      return response.data
    },
    
    async post<T>(url: string, data: any): Promise<T> {
      const response = await api.post(url, data)
      return response.data
    },
    
    async put<T>(url: string, data: any): Promise<T> {
      const response = await api.put(url, data)
      return response.data
    },
    
    async patch<T>(url: string, data: any): Promise<T> {
      const response = await api.patch(url, data)
      return response.data
    },
    
    async delete(url: string): Promise<void> {
      await api.delete(url)
    }
  }
}