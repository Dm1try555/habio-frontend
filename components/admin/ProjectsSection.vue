<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h2>Проекты</h2>
      <button @click="showProjectForm = true" class="btn btn--primary">
        Создать проект
      </button>
    </div>
    
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Часовой пояс</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>{{ project.id }}</td>
            <td>{{ project.name }}</td>
            <td>{{ project.timezone }}</td>
            <td>
              <span :class="['status', project.is_active ? 'status--active' : 'status--inactive']">
                {{ project.is_active ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td>
              <button @click="editProject(project)" class="btn btn--small">Редактировать</button>
              <button @click="handleDeleteProject(project.id)" class="btn btn--small btn--danger">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Project Form Modal -->
  <div v-if="showProjectForm" class="modal">
    <div class="modal__content">
      <h3>{{ editingProject ? 'Редактировать проект' : 'Создать проект' }}</h3>
      <form @submit.prevent="saveProject">
        <div class="form-group">
          <label>Название проекта</label>
          <input v-model="projectForm.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Часовой пояс</label>
          <select v-model="projectForm.timezone">
            <option value="UTC">UTC</option>
            <option value="Europe/Kiev">Europe/Kiev</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
          </select>
        </div>
        <div class="form-group">
          <label>
            <input v-model="projectForm.is_active" type="checkbox" />
            Активен
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary">Сохранить</button>
          <button type="button" @click="closeProjectForm" class="btn btn--secondary">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAdminProjects } from '~/composables/admin/useAdminProjects'

const {
  projects,
  showProjectForm,
  editingProject,
  projectForm,
  editProject,
  saveProject,
  handleDeleteProject,
  closeProjectForm
} = useAdminProjects()
</script>