<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Проекты</h1>
      <p>Управление вашими проектами и их настройками</p>
    </div>

    <div class="page-content">
      <div v-if="isLoading" class="loading-spinner">Загрузка...</div>
      <div v-else class="projects-grid">
        <div v-for="project in projects" :key="project.id" class="project-card">
          <div class="project-header">
            <h3>{{ project.name }}</h3>
            <span class="status-indicator" :class="`status-indicator--${project.status}`">
              {{ project.status === 'active' ? 'Активен' : 'Неактивен' }}
            </span>
          </div>
          <p class="project-description">{{ project.description }}</p>
          
          <div class="project-stats">
            <div class="stat-item">
              <span class="stat-icon">📞</span>
              <span class="stat-label">Каналы:</span>
              <span class="stat-value">{{ project.channels_count }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">👥</span>
              <span class="stat-label">Лиды:</span>
              <span class="stat-value">{{ project.leads_count }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📊</span>
              <span class="stat-label">Конверсия:</span>
              <span class="stat-value">{{ project.conversion_rate }}%</span>
            </div>
          </div>

          <div class="project-actions">
            <button class="base-button base-button--outline base-button--small" @click="editProject(project)">
              Редактировать
            </button>
            <button class="base-button base-button--primary base-button--small" @click="viewProject(project)">
              Открыть
            </button>
            <button class="base-button base-button--danger base-button--small" @click="deleteProject(project)">
              Удалить
            </button>
          </div>
        </div>

        <div class="add-project-card" @click="createProject">
          <div class="add-icon">+</div>
          <h3>Создать проект</h3>
          <p>Добавить новый проект с виджетом связи</p>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="base-modal-overlay" @click.self="closeModal">
      <div class="base-modal base-modal--large">
        <div class="modal-header">
          <h3>{{ editingProject ? 'Редактировать проект' : 'Создать проект' }}</h3>
          <button @click="closeModal" class="close-button" aria-label="Закрыть модальное окно">×</button>
        </div>
        
        <form @submit.prevent="saveProject">
          <div class="form-group">
            <label>Название проекта</label>
            <input 
              type="text" 
              v-model="projectForm.name" 
              class="base-input"
              required
              placeholder="Введите название проекта"
            />
          </div>
          
          <div class="form-group">
            <label>Описание</label>
            <textarea 
              v-model="projectForm.description" 
              class="base-input"
              rows="3"
              placeholder="Описание проекта"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Домен</label>
            <input 
              type="url" 
              v-model="projectForm.domain" 
              class="base-input"
              placeholder="https://example.com"
            />
          </div>
          
          <div class="form-group">
            <label>Часовой пояс</label>
            <select v-model="projectForm.timezone" class="base-input">
              <option value="Europe/Kiev">Киев (UTC+2)</option>
              <option value="Europe/Moscow">Москва (UTC+3)</option>
              <option value="Europe/London">Лондон (UTC+0)</option>
              <option value="America/New_York">Нью-Йорк (UTC-5)</option>
            </select>
          </div>
          
          <div class="form-group form-group--inline">
            <label>
              <input type="checkbox" v-model="projectForm.is_active" />
              Активный проект
            </label>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="base-button base-button--outline" :disabled="isLoading">
              Отмена
            </button>
            <button type="submit" class="base-button base-button--primary" :disabled="isLoading">
              {{ editingProject ? 'Сохранить' : 'Создать' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'
import { useApi } from '~/composables/shared/useApi'

interface Project {
  id: number;
  name: string;
  description: string;
  domain: string;
  timezone: string;
  is_active: boolean;
  channels_count: number;
  leads_count: number;
  conversion_rate: number;
  status: 'active' | 'inactive';
}

interface ProjectForm {
  name: string;
  description: string;
  domain: string;
  timezone: string;
  is_active: boolean;
}

const { user, isAuthenticated, checkAuth } = useClientAuth()
const { get, post, patch, delete: del, isLoading, error, clearError } = useApi()

const projects = ref<Project[]>([])
const showModal = ref(false)
const editingProject = ref<Project | null>(null)

const projectForm = ref<ProjectForm>({
  name: '',
  description: '',
  domain: '',
  timezone: 'Europe/Kiev',
  is_active: true
})

const loadProjects = async () => {
  try {
    clearError()
    const data = await get<Project[]>('/projects/')
    projects.value = data
  } catch (err) {
    console.error('Failed to load projects:', err)
    alert(error.value?.message || 'Не удалось загрузить проекты')
  }
}

const createProject = () => {
  editingProject.value = null
  projectForm.value = {
    name: '',
    description: '',
    domain: '',
    timezone: 'Europe/Kiev',
    is_active: true
  }
  showModal.value = true
}

const editProject = (project: Project) => {
  editingProject.value = project
  projectForm.value = {
    name: project.name,
    description: project.description,
    domain: project.domain,
    timezone: project.timezone,
    is_active: project.status === 'active'
  }
  showModal.value = true
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const saveProject = async () => {
  if (!projectForm.value.name.trim()) {
    alert('Название проекта обязательно')
    return
  }

  if (projectForm.value.domain && !isValidUrl(projectForm.value.domain)) {
    alert('Некорректный формат домена')
    return
  }

  const payload = {
    ...projectForm.value,
    status: projectForm.value.is_active ? 'active' : 'inactive'
  }

  try {
    clearError()
    if (editingProject.value) {
      await patch(`/projects/${editingProject.value.id}/`, payload)
    } else {
      await post('/projects/', payload)
    }
    await loadProjects()
    closeModal()
  } catch (err) {
    console.error('Failed to save project:', err)
    alert(error.value?.message || 'Ошибка при сохранении проекта')
  }
}

const deleteProject = async (project: Project) => {
  if (confirm('Вы уверены, что хотите удалить этот проект?')) {
    try {
      clearError()
      await del(`/projects/${project.id}/`)
      await loadProjects()
    } catch (err) {
      console.error('Failed to delete project:', err)
      alert(error.value?.message || 'Ошибка при удалении проекта')
    }
  }
}

const viewProject = (project: Project) => {
  if (!project.id) {
    alert('Некорректный идентификатор проекта')
    return
  }
  navigateTo(`/client/projects/${project.id}`)
}

const closeModal = () => {
  showModal.value = false
  editingProject.value = null
}

onMounted(async () => {
  checkAuth() 
  if (!isAuthenticated.value) {
    await navigateTo('/client/auth/login')
    return
  }

  await loadProjects()
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.project-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-indicator--active {
  background: #e6f4ea;
  color: #2e7d32;
}

.status-indicator--inactive {
  background: #ffebee;
  color: #d32f2f;
}

.project-description {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.project-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.stat-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.stat-label {
  color: #666;
  min-width: 60px;
}

.stat-value {
  color: #333;
  font-weight: 600;
}

.project-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.base-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.base-button--outline {
  border: 1px solid #007bff;
  background: transparent;
  color: #007bff;
}

.base-button--outline:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.base-button--primary {
  border: none;
  background: #007bff;
  color: white;
}

.base-button--primary:hover:not(:disabled) {
  background: #0056b3;
}

.base-button--danger {
  border: none;
  background: #dc3545;
  color: white;
}

.base-button--danger:hover:not(:disabled) {
  background: #b02a37;
}

.base-button--small {
  padding: 6px 12px;
  font-size: 12px;
}

.add-project-card {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.add-project-card:hover {
  background: #e9ecef;
  border-color: #007bff;
}

.add-icon {
  font-size: 48px;
  color: #007bff;
  margin-bottom: 16px;
}

.add-project-card h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.add-project-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.base-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.base-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.base-modal--large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.base-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.base-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
}

.form-group--inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.loading-spinner {
  text-align: center;
  padding: 24px;
  font-size: 16px;
  color: #666;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .project-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .project-actions .base-button {
    width: 100%;
    font-size: 14px;
    padding: 8px;
  }
  
  .project-card {
    padding: 16px;
  }
  
  .base-modal {
    margin: 16px;
  }
}
</style>