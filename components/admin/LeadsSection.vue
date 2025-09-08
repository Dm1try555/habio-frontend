<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h2>Лиды</h2>
    </div>
    
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Контакт</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Сообщение</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in leads" :key="lead.id">
            <td>{{ lead.id }}</td>
            <td>{{ getContactName(lead.contact) }}</td>
            <td>{{ getContactEmail(lead.contact) }}</td>
            <td>{{ getContactPhone(lead.message) }}</td>
            <td>{{ getContactMessage(lead.message) }}</td>
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
            <td>{{ formatDate(lead.created_at) }}</td>
            <td>
              <button @click="handleDeleteLead(lead.id)" class="btn btn--danger btn--small">
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
import { onMounted } from 'vue'
import { useLeadScripts } from '~/scripts/leads'
import { useChatScripts } from '~/scripts/chat'

const {
  leads,
  getContactName,
  getContactEmail,
  getContactPhone,
  getContactMessage,
  toggleLeadStatus,
  handleDeleteLead
} = useLeadScripts()

const { formatDate } = useChatScripts()

onMounted(async () => {
  try {
    if (!leads || !Array.isArray(leads) || !leads.length) {
      await loadLeads()
    }
  } catch (e) {
    console.error('Failed to load leads in section:', e)
  }
})
</script>