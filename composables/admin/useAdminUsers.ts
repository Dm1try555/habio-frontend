import { ref } from 'vue'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'marketing' | 'viewer'
  is_active: boolean
  created_at: string
  updated_at: string
}

export const useAdminUsers = () => {
  const { $api } = useNuxtApp()
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadUsers = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await $api.get('/users/')
      users.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load users'
      console.error('Failed to load users:', err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (data: Partial<User> & { password: string }) => {
    try {
      loading.value = true
      error.value = null
      const response = await $api.post('/users/', data)
      const user = response.data
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
      const response = await $api.put(`/users/${id}/`, data)
      const user = response.data
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
      await $api.delete(`/users/${id}/`)
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

  // Additional functions for admin interface
  const showUserForm = ref(false)
  const editingUser = ref<User | null>(null)
  const userForm = ref({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'viewer' as 'admin' | 'marketing' | 'viewer',
    is_active: true
  })

  const editUser = (user: User) => {
    editingUser.value = user
    userForm.value = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: '',
      role: user.role,
      is_active: user.is_active
    }
    showUserForm.value = true
  }

  const saveUser = async () => {
    try {
      const data = { ...userForm.value }
      if (!data.password) {
        delete (data as any).password
      }
      
      if (editingUser.value) {
        await updateUser(editingUser.value.id, data as any)
      } else {
        await createUser(data as any)
      }
      closeUserForm()
    } catch (err) {
      console.error('Failed to save user:', err)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await deleteUser(id)
      } catch (err) {
        console.error('Failed to delete user:', err)
      }
    }
  }

  const closeUserForm = () => {
    showUserForm.value = false
    editingUser.value = null
    userForm.value = {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      role: 'viewer',
      is_active: true
    }
  }

  const getRoleName = (role: string) => {
    const roles = {
      admin: 'Администратор',
      marketing: 'Маркетинг',
      viewer: 'Viewer'
    }
    return roles[role as keyof typeof roles] || role
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: '#dc3545',
      marketing: '#ffc107',
      viewer: '#28a745'
    }
    return colors[role as keyof typeof colors] || '#6c757d'
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
    showUserForm,
    editingUser,
    userForm,
    editUser,
    saveUser,
    handleDeleteUser,
    closeUserForm,
    getRoleName,
    getRoleColor
  }
}