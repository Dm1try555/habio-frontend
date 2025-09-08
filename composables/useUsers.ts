import { ref } from 'vue'
import { useApi } from './useApi'
import { getRoleLabel } from '~/utils/roleUtils'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'marketing' | 'viewer'
  is_active: boolean
  date_joined: string
  last_login?: string
}

export const useUsers = () => {
  const { api } = useApi()
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadUsers = async () => {
    try {
      loading.value = true
      error.value = null
      users.value = await api.get<User[]>('/users/')
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load users'
      console.error('Failed to load users:', err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (data: Partial<User>) => {
    try {
      loading.value = true
      error.value = null
      const user = await api.post<User>('/users/', data)
      users.value.push(user)
      return user
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, data: Partial<User>) => {
    try {
      loading.value = true
      error.value = null
      const user = await api.put<User>(`/users/${id}/`, data)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = user
      }
      return user
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/users/${id}/`)
      users.value = users.value.filter(u => u.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUser = (id: number) => {
    return users.value.find(u => u.id === id)
  }

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getRoleLabel
  }
}