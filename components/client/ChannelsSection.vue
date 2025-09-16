<template>
  <div class="client-section">
    <div class="client-section__header">
      <h2>Каналы</h2>
      <button @click="showChannelForm = true" class="btn btn--primary">
        Добавить канал
      </button>
    </div>
    
    <div class="client-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Тип</th>
            <th>Название</th>
            <th>Приоритет</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in channels" :key="channel.id">
            <td>{{ channel.id }}</td>
            <td>{{ channel.type }}</td>
            <td>{{ channel.label }}</td>
            <td>{{ channel.priority }}</td>
            <td>
              <span :class="['status', channel.show_in_top ? 'status--active' : 'status--inactive']">
                {{ channel.show_in_top ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td>
              <button @click="editChannel(channel)" class="btn btn--small">Редактировать</button>
              <button @click="handleDeleteChannel(channel.id)" class="btn btn--small btn--danger">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
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
          <select v-model="channelForm.channel_type">
            <option value="call">Звонок</option>
            <option value="chat">Чат</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
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
          <label>Номер телефона</label>
          <input v-model="channelForm.phone_number" type="tel" />
        </div>
        <div class="form-group">
          <label>Приоритет</label>
          <input v-model.number="channelForm.priority" type="number" min="0" />
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useChannels } from '~/composables/client/useChannels'
import { useProjects } from '~/composables/client/useProjects'

const {
  channels,
  showChannelForm,
  editingChannel,
  channelForm,
  editChannel,
  saveChannel,
  handleDeleteChannel,
  closeChannelForm,
  loadChannels
} = useChannels()

const { projects, loadProjects } = useProjects()

// Load projects when component is mounted
onMounted(() => {
  loadProjects()
  loadChannels()
})
</script>