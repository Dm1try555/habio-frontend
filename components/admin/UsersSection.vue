<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h2>Пользователи</h2>
      <button @click="showUserForm = true" class="btn btn--primary">
        Создать пользователя
      </button>
    </div>
    
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя пользователя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select 
                :value="user.role" 
                @change="updateUserRole(user.id, $event.target.value)"
                class="role-select"
                :disabled="!canManageUsers"
              >
                <option value="viewer">Просмотр</option>
                <option value="marketing">Маркетинг</option>
                <option value="admin">Администратор</option>
              </select>
            </td>
            <td>
              <label class="toggle-switch">
                <input 
                  type="checkbox" 
                  :checked="user.is_active"
                  @change="toggleUserStatus(user.id, $event.target.checked)"
                  :disabled="!canManageUsers"
                />
                <span class="toggle-slider"></span>
              </label>
              <span class="status-text">
                {{ user.is_active ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td>
              <button @click="editUser(user)" class="btn btn--small" :disabled="!canManageUsers">
                Редактировать
              </button>
              <button 
                @click="handleDeleteUser(user.id)" 
                class="btn btn--small btn--danger"
                :disabled="!canManageUsers"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useUserScripts } from '~/scripts/users'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

const {
  users,
  showUserForm,
  editingUser,
  editUser,
  handleDeleteUser,
  getRoleLabel,
  loadUsers
} = useUserScripts()

const { canManageUsers } = useAuth()
const { patch } = useApi()

import { formatDate } from '~/utils/dateUtils'

const updateUserRole = async (userId, newRole) => {
  try {
    await patch(`users/${userId}/`, { role: newRole })
    // Reload users to get updated data
    await loadUsers()
  } catch (error) {
    console.error('Failed to update user role:', error)
    alert('Ошибка при обновлении роли пользователя')
  }
}

const toggleUserStatus = async (userId, isActive) => {
  try {
    await patch(`users/${userId}/`, { is_active: isActive })
    // Reload users to get updated data
    await loadUsers()
  } catch (error) {
    console.error('Failed to update user status:', error)
    alert('Ошибка при обновлении статуса пользователя')
  }
}
</script>