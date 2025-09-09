import { ref } from 'vue'

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
  const { $api } = useNuxtApp()
  const abTests = ref<ABTest[]>([])
  const variants = ref<ABTestVariant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadABTests = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await $api.get('/ab-tests/')
      abTests.value = response.data
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
      const response = await $api.get(`/ab-tests/${testId}/variants/`)
      variants.value = response.data
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
      const response = await $api.post('/ab-tests/', data)
      const test = response.data
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
      const response = await $api.put(`/ab-tests/${id}/`, data)
      const test = response.data
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
      await $api.delete(`/ab-tests/${id}/`)
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