import { ref } from 'vue'
import { useApi } from './useApi'

export interface Lead {
  id: number
  project: number
  contact: string
  message: string
  status: string
  created_at: string
  updated_at: string
}

export const useLeads = () => {
  const { api } = useApi()
  const leads = ref<Lead[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadLeads = async () => {
    try {
      loading.value = true
      error.value = null
      leads.value = await api.get<Lead[]>('/leads/')
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load leads'
      console.error('Failed to load leads:', err)
    } finally {
      loading.value = false
    }
  }

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      loading.value = true
      error.value = null
      const lead = await api.patch<Lead>(`/leads/${id}/`, { status })
      const index = leads.value.findIndex(l => l.id === id)
      if (index !== -1) {
        leads.value[index] = lead
      }
      return lead
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update lead'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteLead = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/leads/${id}/`)
      leads.value = leads.value.filter(l => l.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete lead'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getLead = (id: number) => {
    return leads.value.find(l => l.id === id)
  }

  return {
    leads,
    loading,
    error,
    loadLeads,
    updateLeadStatus,
    deleteLead,
    getLead
  }
}