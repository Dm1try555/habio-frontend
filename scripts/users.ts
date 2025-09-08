import { ref } from 'vue'
import { useUsers } from '~/composables/useUsers'

export const useUserScripts = () => {
  const {
    users,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getRoleLabel
  } = useUsers()

  const showUserForm = ref(false)
  const editingUser = ref(null)

  const editUser = (user: any) => {
    editingUser.value = user
    showUserForm.value = true
  }

  const handleDeleteUser = async (id: number) => {
    if (confirm('Удалить пользователя?')) {
      try {
        await deleteUser(id)
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  return {
    users,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    showUserForm,
    editingUser,
    editUser,
    handleDeleteUser,
    getRoleLabel
  }
}