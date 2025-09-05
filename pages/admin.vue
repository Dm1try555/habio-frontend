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
                <th>Имя</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Сообщение</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in leads" :key="lead.id">
                <td>{{ lead.id }}</td>
                <td>{{ getProjectName(lead.project) }}</td>
                <td>{{ getChannelName(lead.channel) }}</td>
                <td>{{ getContactName(lead.contact) }}</td>
                <td>{{ getContactEmail(lead.contact) }}</td>
                <td>{{ getContactPhone(lead.message) }}</td>
                <td>{{ getContactMessage(lead.message) }}</td>
                <td>{{ formatDate(lead.created_at) }}</td>
                <td>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="lead.processed"
                      @change="toggleLeadStatus(lead.id, $event.target.checked)"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="status-text">
                    {{ lead.processed ? 'Обработан' : 'В ожидании' }}
                  </span>
                </td>
                <td>
                  <button @click="deleteLead(lead.id)" class="btn btn--danger btn--small">
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Chat Tab -->
      <div v-if="activeTab === 'chat'" class="admin-section">
        <div class="admin-section__header">
          <h2>Чат с клиентами</h2>
        </div>
        
        <div class="chat-container">
          <div class="chat-sessions">
            <h3>Активные сессии</h3>
            <div class="sessions-list">
              <div
                v-for="session in chatSessions"
                :key="session.id"
                :class="['session-item', { 'session-item--active': selectedSession?.id === session.id }]"
                @click="selectSession(session)"
              >
                <div class="session-info">
                  <div class="session-client">{{ session.client_id }}</div>
                  <div class="session-time">{{ formatDate(session.updated_at) }}</div>
                </div>
                <div class="session-status">
                  <span :class="['status-dot', session.is_active ? 'status-dot--active' : 'status-dot--inactive']"></span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chat-messages" v-if="selectedSession">
            <div class="chat-header">
              <h4>Сессия {{ selectedSession.id }}</h4>
              <button @click="selectedSession = null" class="btn btn--small">Закрыть</button>
            </div>
            
            <div class="messages-container" ref="messagesContainer">
              <div
                v-for="message in chatMessages"
                :key="message.id"
                :class="['message', `message--${message.message_type}`]"
              >
                <div class="message-content">{{ message.content }}</div>
                <div class="message-time">{{ formatTime(message.created_at) }}</div>
              </div>
            </div>
            
            <div class="message-input">
              <form @submit.prevent="sendAdminMessage">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Введите сообщение..."
                  class="message-field"
                />
                <button type="submit" class="btn btn--primary btn--small">Отправить</button>
              </form>
            </div>
          </div>
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
          <div v-if="channelForm.type === 'call'" class="form-group">
            <label>Номер телефона</label>
            <input v-model="channelForm.phone_number" type="tel" placeholder="+1 (555) 123-4567" />
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

    <!-- Schedule Form Modal -->
    <div v-if="showScheduleForm" class="modal">
      <div class="modal__content">
        <h3>{{ editingSchedule ? 'Редактировать расписание' : 'Добавить расписание' }}</h3>
        <form @submit.prevent="saveSchedule">
          <div class="form-group">
            <label>Проект</label>
            <select v-model="scheduleForm.project" required>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>День недели</label>
            <select v-model="scheduleForm.day" required>
              <option value="monday">Понедельник</option>
              <option value="tuesday">Вторник</option>
              <option value="wednesday">Среда</option>
              <option value="thursday">Четверг</option>
              <option value="friday">Пятница</option>
              <option value="saturday">Суббота</option>
              <option value="sunday">Воскресенье</option>
            </select>
          </div>
          <div class="form-group">
            <label>Время начала</label>
            <input v-model="scheduleForm.start_time" type="time" required />
          </div>
          <div class="form-group">
            <label>Время окончания</label>
            <input v-model="scheduleForm.end_time" type="time" required />
          </div>
          <div class="form-group">
            <label>
              <input v-model="scheduleForm.is_working_day" type="checkbox" />
              Рабочий день
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn--primary">Сохранить</button>
            <button type="button" @click="closeScheduleForm" class="btn btn--secondary">Отмена</button>
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
  { id: 'leads', label: 'Лиды' },
  { id: 'chat', label: 'Чат' }
]

const projects = ref([])
const channels = ref([])
const schedules = ref([])
const leads = ref([])
const chatSessions = ref([])
const selectedSession = ref(null)
const chatMessages = ref([])
const newMessage = ref('')

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
  phone_number: '',
  priority: 0,
  show_in_top: false,
  is_active: true
})

const scheduleForm = ref({
  project: 1,
  day: 'monday',
  start_time: '09:00',
  end_time: '18:00',
  is_working_day: true
})

const apiBase = 'http://127.0.0.1:8000/api'

const loadData = async () => {
  try {
    const [projectsRes, channelsRes, schedulesRes, leadsRes, chatSessionsRes] = await Promise.all([
      fetch(`${apiBase}/projects/`),
      fetch(`${apiBase}/channels/`),
      fetch(`${apiBase}/schedules/`),
      fetch(`${apiBase}/leads/`),
      fetch(`${apiBase}/chat-sessions/`)
    ])
    
    projects.value = await projectsRes.json()
    channels.value = await channelsRes.json()
    schedules.value = await schedulesRes.json()
    leads.value = await leadsRes.json()
    chatSessions.value = await chatSessionsRes.json()
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
  channelForm.value = { 
    ...channel,
    phone_number: channel.phone_number || ''
  }
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

// Lead management functions
const getContactName = (contact) => {
  if (!contact) return '-'
  const match = contact.match(/^([^<]+)/)
  return match ? match[1].trim() : contact
}

const getContactEmail = (contact) => {
  if (!contact) return '-'
  const match = contact.match(/<([^>]+)>/)
  return match ? match[1].trim() : '-'
}

const getContactPhone = (message) => {
  if (!message) return '-'
  const phoneMatch = message.match(/Телефон:\s*([^\n]+)/)
  return phoneMatch ? phoneMatch[1].trim() : '-'
}

const getContactMessage = (message) => {
  if (!message) return '-'
  // Remove phone line from message
  return message.replace(/Телефон:\s*[^\n]+\n?\n?/, '').trim() || '-'
}

const toggleLeadStatus = async (leadId, processed) => {
  try {
    const response = await fetch(`${apiBase}/leads/${leadId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processed })
    })
    
    if (response.ok) {
      await loadData()
    } else {
      console.error('Failed to update lead status')
    }
  } catch (error) {
    console.error('Failed to update lead status:', error)
  }
}

const deleteLead = async (leadId) => {
  if (confirm('Удалить лид?')) {
    try {
      await fetch(`${apiBase}/leads/${leadId}/`, { method: 'DELETE' })
      await loadData()
    } catch (error) {
      console.error('Failed to delete lead:', error)
    }
  }
}

// Schedule management functions
const editSchedule = (schedule) => {
  editingSchedule.value = schedule
  scheduleForm.value = {
    project: schedule.project,
    day: schedule.day,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    is_working_day: schedule.is_working_day
  }
  showScheduleForm.value = true
}

const saveSchedule = async () => {
  try {
    const url = editingSchedule.value 
      ? `${apiBase}/schedules/${editingSchedule.value.id}/`
      : `${apiBase}/schedules/`
    
    const method = editingSchedule.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleForm.value)
    })
    
    if (response.ok) {
      await loadData()
      closeScheduleForm()
    }
  } catch (error) {
    console.error('Failed to save schedule:', error)
  }
}

const deleteSchedule = async (id) => {
  if (confirm('Удалить расписание?')) {
    try {
      await fetch(`${apiBase}/schedules/${id}/`, { method: 'DELETE' })
      await loadData()
    } catch (error) {
      console.error('Failed to delete schedule:', error)
    }
  }
}

const closeScheduleForm = () => {
  showScheduleForm.value = false
  editingSchedule.value = null
  scheduleForm.value = { 
    project: 1, 
    day: 'monday', 
    start_time: '09:00', 
    end_time: '18:00', 
    is_working_day: true 
  }
}

// Chat management functions
const selectSession = async (session) => {
  selectedSession.value = session
  await loadChatMessages(session.id)
}

const loadChatMessages = async (sessionId) => {
  try {
    const response = await fetch(`${apiBase}/chat-sessions/${sessionId}/messages/`)
    if (response.ok) {
      chatMessages.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load chat messages:', error)
  }
}

const sendAdminMessage = async () => {
  if (!newMessage.value.trim() || !selectedSession.value) return
  
  try {
    const response = await fetch(`${apiBase}/chat-messages/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: selectedSession.value.id,
        message_type: 'admin',
        content: newMessage.value.trim()
      })
    })
    
    if (response.ok) {
      const message = await response.json()
      chatMessages.value.push(message)
      newMessage.value = ''
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
@import '~/assets/css/admin-base.css';
@import '~/assets/css/admin-tables.css';
@import '~/assets/css/admin-buttons.css';
@import '~/assets/css/admin-modals.css';
@import '~/assets/css/admin-chat.css';
</style>