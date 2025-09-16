<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Лиды</h1>
      <p>Управление заявками и обращениями</p>
    </div>

    <div class="page-content">
      <!-- Filters and Search -->
      <div class="search-filters">
        <div class="search-input">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по имени, email или телефону..."
            class="base-input"
          />
        </div>
        <div class="filter-group">
          <select v-model="statusFilter" class="base-input filter-select">
            <option value="">Все статусы</option>
            <option value="new">Новые</option>
            <option value="contacted">Связались</option>
            <option value="qualified">Квалифицированы</option>
            <option value="converted">Конвертированы</option>
            <option value="lost">Потеряны</option>
          </select>
          <select v-model="channelFilter" class="base-input filter-select">
            <option value="">Все каналы</option>
            <option value="call">Звонок</option>
            <option value="callback">Заказ звонка</option>
            <option value="messenger">Мессенджер</option>
            <option value="chat">Чат</option>
            <option value="form">Форма</option>
          </select>
          <select v-model="dateFilter" class="base-input filter-select">
            <option value="">Все время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
          </select>
        </div>
      </div>

      <!-- Leads Table -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Список лидов ({{ filteredLeads.length }})</h2>
          <div class="section-actions">
            <button class="base-button base-button--outline" @click="exportLeads">
              Экспорт
            </button>
            <button class="base-button base-button--primary" @click="refreshLeads">
              Обновить
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Контакт</th>
                <th>Канал</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Сообщение</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in paginatedLeads" :key="lead.id">
                <td>
                  <div class="contact-info">
                    <div class="contact-name">{{ lead.contact }}</div>
                    <div class="contact-details">
                      <span v-if="lead.email">{{ lead.email }}</span>
                      <span v-if="lead.phone">{{ lead.phone }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="channel-info">
                    <span class="channel-icon">{{ getChannelIcon(lead.channel_type) }}</span>
                    <span class="channel-name">{{ lead.channel_name }}</span>
                  </div>
                </td>
                <td>
                  <span class="status-indicator" :class="`status-indicator--${lead.status}`">
                    {{ getStatusText(lead.status) }}
                  </span>
                </td>
                <td>
                  <div class="date-info">
                    <div>{{ formatDate(lead.created_at) }}</div>
                    <div class="time">{{ formatTime(lead.created_at) }}</div>
                  </div>
                </td>
                <td>
                  <div class="message-preview">
                    {{ lead.message ? lead.message.substring(0, 50) + '...' : '-' }}
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="base-button base-button--outline base-button--small" @click="viewLead(lead)">
                      Просмотр
                    </button>
                    <button class="base-button base-button--primary base-button--small" @click="contactLead(lead)">
                      Связаться
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button @click="currentPage = 1" :disabled="currentPage === 1">«</button>
          <button @click="currentPage--" :disabled="currentPage === 1">‹</button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages">›</button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages">»</button>
        </div>
      </div>
    </div>

    <!-- Lead Detail Modal -->
    <div v-if="selectedLead" class="base-modal-overlay" @click="closeLeadModal">
      <div class="base-modal base-modal--large" @click.stop>
        <div class="modal-header">
          <h3>Детали лида</h3>
          <button @click="closeLeadModal" class="close-button">×</button>
        </div>
        <div class="lead-details">
          <div class="detail-section">
            <h4>Контактная информация</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Имя:</label>
                <span>{{ selectedLead.contact }}</span>
              </div>
              <div class="detail-item" v-if="selectedLead.email">
                <label>Email:</label>
                <span>{{ selectedLead.email }}</span>
              </div>
              <div class="detail-item" v-if="selectedLead.phone">
                <label>Телефон:</label>
                <span>{{ selectedLead.phone }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Информация о заявке</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Канал:</label>
                <span>{{ selectedLead.channel_name }}</span>
              </div>
              <div class="detail-item">
                <label>Статус:</label>
                <span class="status-indicator" :class="`status-indicator--${selectedLead.status}`">
                  {{ getStatusText(selectedLead.status) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Дата создания:</label>
                <span>{{ formatDateTime(selectedLead.created_at) }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section" v-if="selectedLead.message">
            <h4>Сообщение</h4>
            <div class="message-content">
              {{ selectedLead.message }}
            </div>
          </div>
          
          <div class="detail-section">
            <h4>Действия</h4>
            <div class="action-buttons">
              <button class="base-button base-button--primary" @click="contactLead(selectedLead)">
                Связаться
              </button>
              <button class="base-button base-button--success" @click="markAsQualified(selectedLead)">
                Квалифицировать
              </button>
              <button class="base-button base-button--danger" @click="markAsLost(selectedLead)">
                Отметить как потерянный
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'
import { useApi } from '~/composables/shared/useApi'

const { user, isAuthenticated } = useClientAuth()
const { api } = useApi()

const leads = ref([])
const selectedLead = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const channelFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredLeads = computed(() => {
  let filtered = leads.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(lead => 
      lead.contact.toLowerCase().includes(query) ||
      (lead.email && lead.email.toLowerCase().includes(query)) ||
      (lead.phone && lead.phone.includes(query))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(lead => lead.status === statusFilter.value)
  }

  if (channelFilter.value) {
    filtered = filtered.filter(lead => lead.channel_type === channelFilter.value)
  }

  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    filtered = filtered.filter(lead => {
      const leadDate = new Date(lead.created_at)
      switch (dateFilter.value) {
        case 'today':
          return leadDate >= today
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return leadDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          return leadDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredLeads.value.length / itemsPerPage))

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLeads.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const loadLeads = async () => {
  try {
    const response = await api.get('/leads/')
    leads.value = response.data
  } catch (error) {
    console.error('Failed to load leads:', error)
    // Mock data for demo
    leads.value = [
      {
        id: 1,
        contact: 'Иван Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        channel_type: 'call',
        channel_name: 'Позвонить',
        status: 'new',
        message: 'Интересует ваша услуга по настройке виджетов',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        contact: 'Мария Сидорова',
        email: 'maria@example.com',
        phone: '+7 (999) 234-56-78',
        channel_type: 'form',
        channel_name: 'Форма заявки',
        status: 'contacted',
        message: 'Хочу узнать больше о тарифах',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
}

const getChannelIcon = (type: string) => {
  const icons: Record<string, string> = {
    call: '📞',
    callback: '⏰',
    messenger: '💬',
    chat: '💭',
    form: '📝'
  }
  return icons[type] || '📞'
}

const getStatusText = (status: string) => {
  const statuses: Record<string, string> = {
    new: 'Новый',
    contacted: 'Связались',
    qualified: 'Квалифицирован',
    converted: 'Конвертирован',
    lost: 'Потерян'
  }
  return statuses[status] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU')
}

const viewLead = (lead: any) => {
  selectedLead.value = lead
}

const closeLeadModal = () => {
  selectedLead.value = null
}

const contactLead = (lead: any) => {
  // Implement contact logic
  console.log('Contact lead:', lead)
}

const markAsQualified = async (lead: any) => {
  try {
    await api.patch(`/leads/${lead.id}/`, { status: 'qualified' })
    lead.status = 'qualified'
    closeLeadModal()
  } catch (error) {
    console.error('Failed to update lead:', error)
  }
}

const markAsLost = async (lead: any) => {
  try {
    await api.patch(`/leads/${lead.id}/`, { status: 'lost' })
    lead.status = 'lost'
    closeLeadModal()
  } catch (error) {
    console.error('Failed to update lead:', error)
  }
}

const exportLeads = () => {
  // Implement export logic
  console.log('Export leads')
}

const refreshLeads = () => {
  loadLeads()
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/client/auth/login')
    return
  }
  
  await loadLeads()
})
</script>

<style scoped>
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-name {
  font-weight: 500;
  color: #333;
}

.contact-details {
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-icon {
  font-size: 16px;
}

.channel-name {
  font-size: 14px;
  color: #333;
}

.date-info {
  font-size: 14px;
  color: #333;
}

.time {
  font-size: 12px;
  color: #666;
}

.message-preview {
  max-width: 200px;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 8px;
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

.lead-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item span {
  font-size: 14px;
  color: #333;
}

.message-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}
</style>