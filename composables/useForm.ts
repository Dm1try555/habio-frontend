import { ref } from 'vue'

// Common form state composable
export const useForm = (initialData: Record<string, any> = {}) => {
  const form = ref({ ...initialData })
  const loading = ref(false)
  const error = ref('')

  const setField = (field: string, value: any) => {
    form.value[field] = value
  }

  const setError = (message: string) => {
    error.value = message
  }

  const clearError = () => {
    error.value = ''
  }

  const reset = () => {
    form.value = { ...initialData }
    error.value = ''
    loading.value = false
  }

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      loading.value = true
      clearError()
      return await fn()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    error,
    setField,
    setError,
    clearError,
    reset,
    withLoading
  }
}