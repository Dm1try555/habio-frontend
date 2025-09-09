import { ref } from 'vue'

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface ApiError {
  message: string
  status?: number
  data?: any
}

export const useApi = () => {
  const { $api } = useNuxtApp()
  
  const isLoading = ref(false)
  const error = ref<ApiError | null>(null)

  const handleRequest = async <T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<T> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await requestFn()
      return response.data
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.response?.data?.detail || err.message || 'An error occurred',
        status: err.response?.status,
        data: err.response?.data
      }
      error.value = apiError
      throw apiError
    } finally {
      isLoading.value = false
    }
  }

  const get = <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
    return handleRequest(() => $api.get(url, { params }))
  }

  const post = <T = any>(url: string, data?: any): Promise<T> => {
    return handleRequest(() => $api.post(url, data))
  }

  const put = <T = any>(url: string, data?: any): Promise<T> => {
    return handleRequest(() => $api.put(url, data))
  }

  const patch = <T = any>(url: string, data?: any): Promise<T> => {
    return handleRequest(() => $api.patch(url, data))
  }

  const del = (url: string): Promise<void> => {
    return handleRequest(() => $api.delete(url))
  }

  const upload = <T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<T> => {
    const formData = new FormData()
    formData.append('file', file)
    
    return handleRequest(() => 
      $api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        }
      })
    )
  }

  const download = async (url: string, filename?: string): Promise<void> => {
    try {
      const response = await $api.get(url, { responseType: 'blob' })
      
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    download,
    clearError
  }
}