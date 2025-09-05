<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1>HABIO-CHAT Admin Panel</h1>
      <nav class="admin-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['admin-nav__tab', { 'admin-nav__tab--active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
    </header>

    <main class="admin-content">
      <!-- Projects Tab -->
      <div v-if="activeTab === 'projects'" class="admin-section">
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
                  <button @click="deleteProject(project.id)" class="btn btn--small btn--danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Channels Tab -->
      <div v-if="activeTab === 'channels'" class="admin-section">
        <div class="admin-section__header">
          <h2>Каналы связи</h2>
          <button @click="showChannelForm = true" class="btn btn--primary">
            Добавить канал
          </button>
        </div>
        
        <div class="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Проект</th>
                <th>Тип</th>
                <th>Название</th>
                <th>Приоритет</th>
                <th>В топе</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="channel in channels" :key="channel.id">
                <td>{{ channel.id }}</td>
                <td>{{ getProjectName(channel.project) }}</td>
                <td>{{ channel.type }}</td>
                <td>{{ channel.label }}</td>
                <td>{{ channel.priority }}</td>
                <td>{{ channel.show_in_top ? 'Да' : 'Нет' }}</td>
                <td>
                  <span :class="['status', channel.is_active ? 'status--active' : 'status--inactive']">
                    {{ channel.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td>
                  <button @click="editChannel(channel)" class="btn btn--small">Редактировать</button>
                  <button @click="deleteChannel(channel.id)" class="btn btn--small btn--danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Schedule Tab -->
      <div v-if="activeTab === 'schedule'" class="admin-section">
        <div class="admin-section__header">
          <h2>График работы</h2>
          <button @click="showScheduleForm = true" class="btn btn--primary">
            Добавить расписание
          </button>
        </div>
        
        <div class="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Проект</th>
                <th>День</th>
                <th>Время начала</th>
                <th>Время окончания</th>
                <th>Рабочий день</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="schedule in schedules" :key="schedule.id">
                <td>{{ schedule.id }}</td>
                <td>{{ getProjectName(schedule.project) }}</td>
                <td>{{ getDayName(schedule.day) }}</td>
                <td>{{ schedule.start_time }}</td>
                <td>{{ schedule.end_time }}</td>
                <td>{{ schedule.is_working_day ? 'Да' : 'Нет' }}</td>
                <td>
                  <button @click="editSchedule(schedule)" class="btn btn--small">Редактировать</button>
                  <button @click="deleteSchedule(schedule.id)" class="btn btn--small btn--danger">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Leads Tab -->
      <div v-if="activeTab === 'leads'" class="admin-section">
        <div class="admin-section__header">
          <h2>Лиды</h2>
        </div>
        
        <div class="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Проект</th>
                <th>Канал</th>
                <th>Контакт</th>
                <th>Сообщение</th>
                <th>Дата создания</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in leads" :key="lead.id">
                <td>{{ lead.id }}</td>
                <td>{{ getProjectName(lead.project) }}</td>
                <td>{{ getChannelName(lead.channel) }}</td>
                <td>{{ lead.contact }}</td>
                <td>{{ lead.message || '-' }}</td>
                <td>{{ formatDate(lead.created_at) }}</td>
                <td>
                  <span :class="['status', lead.processed ? 'status--processed' : 'status--pending']">
                    {{ lead.processed ? 'Обработан' : 'В ожидании' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

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

    <!-- Channel Form Modal -->
    <div v-if="showChannelForm" class="modal">
      <div class="modal__content">
        <h3>{{ editingChannel ? 'Редактировать канал' : 'Добавить канал' }}</h3>
        <form @submit.prevent="saveChannel">
          <div class="form-group">
            <label>Проект</label>
            <select v-model="channelForm.project" required>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Тип канала</label>
            <select v-model="channelForm.type" required>
              <option value="call">Звонок</option>
              <option value="callback">Обратный звонок</option>
              <option value="messenger">Мессенджер</option>
              <option value="chat">Чат</option>
              <option value="form">Форма</option>
            </select>
          </div>
          <div class="form-group">
            <label>Название</label>
            <input v-model="channelForm.label" type="text" required />
          </div>
          <div class="form-group">
            <label>Ссылка</label>
            <input v-model="channelForm.link" type="url" />
          </div>
          <div class="form-group">
            <label>Приоритет</label>
            <input v-model="channelForm.priority" type="number" min="0" />
          </div>
          <div class="form-group">
            <label>
              <input v-model="channelForm.show_in_top" type="checkbox" />
              Показывать в топе
            </label>
          </div>
          <div class="form-group">
            <label>
              <input v-model="channelForm.is_active" type="checkbox" />
              Активен
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn--primary">Сохранить</button>
            <button type="button" @click="closeChannelForm" class="btn btn--secondary">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const activeTab = ref('projects')
const tabs = [
  { id: 'projects', label: 'Проекты' },
  { id: 'channels', label: 'Каналы' },
  { id: 'schedule', label: 'Расписание' },
  { id: 'leads', label: 'Лиды' }
]

const projects = ref([])
const channels = ref([])
const schedules = ref([])
const leads = ref([])

const showProjectForm = ref(false)
const showChannelForm = ref(false)
const showScheduleForm = ref(false)

const editingProject = ref(null)
const editingChannel = ref(null)
const editingSchedule = ref(null)

const projectForm = ref({
  name: '',
  timezone: 'UTC',
  is_active: true
})

const channelForm = ref({
  project: '',
  type: 'call',
  label: '',
  link: '',
  priority: 0,
  show_in_top: false,
  is_active: true
})

const apiBase = 'http://127.0.0.1:8000/api'

const loadData = async () => {
  try {
    const [projectsRes, channelsRes, schedulesRes, leadsRes] = await Promise.all([
      fetch(`${apiBase}/projects/`),
      fetch(`${apiBase}/channels/`),
      fetch(`${apiBase}/schedules/`),
      fetch(`${apiBase}/leads/`)
    ])
    
    projects.value = await projectsRes.json()
    channels.value = await channelsRes.json()
    schedules.value = await schedulesRes.json()
    leads.value = await leadsRes.json()
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

const getProjectName = (projectId) => {
  const project = projects.value.find(p => p.id === projectId)
  return project ? project.name : `Project ${projectId}`
}

const getChannelName = (channelId) => {
  const channel = channels.value.find(c => c.id === channelId)
  return channel ? channel.label : `Channel ${channelId}`
}

const getDayName = (day) => {
  const days = {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье'
  }
  return days[day] || day
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('ru-RU')
}

const editProject = (project) => {
  editingProject.value = project
  projectForm.value = { ...project }
  showProjectForm.value = true
}

const editChannel = (channel) => {
  editingChannel.value = channel
  channelForm.value = { ...channel }
  showChannelForm.value = true
}

const saveProject = async () => {
  try {
    const url = editingProject.value 
      ? `${apiBase}/projects/${editingProject.value.id}/`
      : `${apiBase}/projects/`
    
    const method = editingProject.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectForm.value)
    })
    
    if (response.ok) {
      await loadData()
      closeProjectForm()
    }
  } catch (error) {
    console.error('Failed to save project:', error)
  }
}

const saveChannel = async () => {
  try {
    const url = editingChannel.value 
      ? `${apiBase}/channels/${editingChannel.value.id}/`
      : `${apiBase}/channels/`
    
    const method = editingChannel.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(channelForm.value)
    })
    
    if (response.ok) {
      await loadData()
      closeChannelForm()
    }
  } catch (error) {
    console.error('Failed to save channel:', error)
  }
}

const deleteProject = async (id) => {
  if (confirm('Удалить проект?')) {
    try {
      await fetch(`${apiBase}/projects/${id}/`, { method: 'DELETE' })
      await loadData()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }
}

const deleteChannel = async (id) => {
  if (confirm('Удалить канал?')) {
    try {
      await fetch(`${apiBase}/channels/${id}/`, { method: 'DELETE' })
      await loadData()
    } catch (error) {
      console.error('Failed to delete channel:', error)
    }
  }
}

const closeProjectForm = () => {
  showProjectForm.value = false
  editingProject.value = null
  projectForm.value = { name: '', timezone: 'UTC', is_active: true }
}

const closeChannelForm = () => {
  showChannelForm.value = false
  editingChannel.value = null
  channelForm.value = { project: '', type: 'call', label: '', link: '', priority: 0, show_in_top: false, is_active: true }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.admin-header h1 {
  margin: 0 0 20px 0;
  color: #212529;
  font-size: 2rem;
}

.admin-nav {
  display: flex;
  gap: 8px;
}

.admin-nav__tab {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.admin-nav__tab:hover {
  background: #e9ecef;
}

.admin-nav__tab--active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.admin-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.admin-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.admin-section__header h2 {
  margin: 0;
  color: #212529;
}

.admin-table {
  overflow-x: auto;
}

.admin-table table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.admin-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status--active {
  background: #d4edda;
  color: #155724;
}

.status--inactive {
  background: #f8d7da;
  color: #721c24;
}

.status--processed {
  background: #d1ecf1;
  color: #0c5460;
}

.status--pending {
  background: #fff3cd;
  color: #856404;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  color: #495057;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn:hover {
  background: #e9ecef;
}

.btn--primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn--primary:hover {
  background: #0056b3;
}

.btn--secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn--secondary:hover {
  background: #545b62;
}

.btn--danger {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn--danger:hover {
  background: #c82333;
}

.btn--small {
  padding: 4px 8px;
  font-size: 0.75rem;
  margin-right: 4px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal__content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal__content h3 {
  margin: 0 0 20px 0;
  color: #212529;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #495057;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>