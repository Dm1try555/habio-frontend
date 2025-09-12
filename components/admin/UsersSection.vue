<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h2>Пользователи</h2>
      <button @click="showUserForm = true" class="btn btn--primary">
        Добавить пользователя
      </button>
    </div>
    
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Имя</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.first_name }} {{ user.last_name }}</td>
            <td>
              <span 
                class="role-badge" 
                :style="{ backgroundColor: getRoleColor(user.role) }"
              >
                {{ getRoleName(user.role) }}
              </span>
            </td>
            <td>
              <span :class="['status', user.is_active ? 'status--active' : 'status--inactive']">
                {{ user.is_active ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td>
              <button @click="editUser(user)" class="btn btn--small">Редактировать</button>
              <button @click="handleDeleteUser(user.id)" class="btn btn--small btn--danger">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- User Form Modal -->
  <div v-if="showUserForm" class="modal">
    <div class="modal__content">
      <h3>{{ editingUser ? 'Редактировать пользователя' : 'Добавить пользователя' }}</h3>
      <form @submit.prevent="saveUser">
        <div class="form-group">
          <label>Email</label>
          <input v-model="userForm.email" type="email" required />
        </div>
        <div class="form-group">
          <label>Имя</label>
          <input v-model="userForm.first_name" type="text" required />
        </div>
        <div class="form-group">
          <label>Фамилия</label>
          <input v-model="userForm.last_name" type="text" required />
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="userForm.password" type="password" :required="!editingUser" />
          <small v-if="editingUser" class="form-hint">Оставьте пустым, чтобы не изменять пароль</small>
        </div>
        <div class="form-group">
          <label>Роль</label>
          <select v-model="userForm.role" required>
            <option value="admin">Администратор</option>
            <option value="marketing">Маркетинг</option>
            <option value="viewer">Клиент</option>
          </select>
        </div>
        <div class="form-group">
          <label>
            <input v-model="userForm.is_active" type="checkbox" />
            Активен
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary">Сохранить</button>
          <button type="button" @click="closeUserForm" class="btn btn--secondary">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminUsers } from '~/composables/admin/useAdminUsers'

const {
  users,
  showUserForm,
  editingUser,
  userForm,
  editUser,
  saveUser,
  handleDeleteUser,
  closeUserForm,
  getRoleName,
  getRoleColor,
  loadUsers
} = useAdminUsers()

onMounted(async () => {
  try {
    if (!users || !Array.isArray(users) || !users.length) {
      await loadUsers()
    }
  } catch (e) {
    console.error('Failed to load users in section:', e)
  }
})
</script>