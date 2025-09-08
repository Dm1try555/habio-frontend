import { ref } from 'vue'
import { useApi } from './useApi'

export interface Schedule {
  id: number
  project: number
  day: string
  start_time: string
  end_time: string
  is_working_day: boolean
  created_at: string
  updated_at: string
}

export const useSchedules = () => {
  const { api } = useApi()
  const schedules = ref<Schedule[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadSchedules = async () => {
    try {
      loading.value = true
      error.value = null
      schedules.value = await api.get<Schedule[]>('/schedules/')
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load schedules'
      console.error('Failed to load schedules:', err)
    } finally {
      loading.value = false
    }
  }

  const createSchedule = async (data: Partial<Schedule>) => {
    try {
      loading.value = true
      error.value = null
      const schedule = await api.post<Schedule>('/schedules/', data)
      schedules.value.push(schedule)
      return schedule
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create schedule'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSchedule = async (id: number, data: Partial<Schedule>) => {
    try {
      loading.value = true
      error.value = null
      const schedule = await api.put<Schedule>(`/schedules/${id}/`, data)
      const index = schedules.value.findIndex(s => s.id === id)
      if (index !== -1) {
        schedules.value[index] = schedule
      }
      return schedule
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update schedule'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSchedule = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/schedules/${id}/`)
      schedules.value = schedules.value.filter(s => s.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete schedule'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getSchedule = (id: number) => {
    return schedules.value.find(s => s.id === id)
  }

  return {
    schedules,
    loading,
    error,
    loadSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule
  }
}