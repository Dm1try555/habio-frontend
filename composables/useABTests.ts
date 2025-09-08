import { ref } from 'vue'
import { useApi } from './useApi'

export interface ABTest {
  id: number
  name: string
  project: number
  traffic_percentage: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ABTestVariant {
  id: number
  ab_test: number
  name: string
  channel_order: string
  copy_text: string
  is_control: boolean
  traffic_percentage: number
  created_at: string
  updated_at: string
}

export const useABTests = () => {
  const { api } = useApi()
  const abTests = ref<ABTest[]>([])
  const variants = ref<ABTestVariant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadABTests = async () => {
    try {
      loading.value = true
      error.value = null
      abTests.value = await api.get<ABTest[]>('/ab-tests/')
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load AB tests'
      console.error('Failed to load AB tests:', err)
    } finally {
      loading.value = false
    }
  }

  const loadVariants = async (testId: number) => {
    try {
      loading.value = true
      error.value = null
      variants.value = await api.get<ABTestVariant[]>(`/ab-tests/${testId}/variants/`)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load variants'
      console.error('Failed to load variants:', err)
    } finally {
      loading.value = false
    }
  }

  const createABTest = async (data: Partial<ABTest>) => {
    try {
      loading.value = true
      error.value = null
      const test = await api.post<ABTest>('/ab-tests/', data)
      abTests.value.push(test)
      return test
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create AB test'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateABTest = async (id: number, data: Partial<ABTest>) => {
    try {
      loading.value = true
      error.value = null
      const test = await api.put<ABTest>(`/ab-tests/${id}/`, data)
      const index = abTests.value.findIndex(t => t.id === id)
      if (index !== -1) {
        abTests.value[index] = test
      }
      return test
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update AB test'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteABTest = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/ab-tests/${id}/`)
      abTests.value = abTests.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete AB test'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getABTest = (id: number) => {
    return abTests.value.find(t => t.id === id)
  }

  return {
    abTests,
    variants,
    loading,
    error,
    loadABTests,
    loadVariants,
    createABTest,
    updateABTest,
    deleteABTest,
    getABTest
  }
}