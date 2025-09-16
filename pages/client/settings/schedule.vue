<template>
  <div class="schedule-settings">
    <div class="settings-header">
      <h1>Расписание работы</h1>
      <p>Настройте время работы для вашего виджета</p>
    </div>

    <div class="settings-content">
      <div class="schedule-form">
        <div class="form-group">
          <label>Часовой пояс</label>
          <select v-model="scheduleConfig.timezone">
            <option value="Europe/Kiev">Киев (UTC+2)</option>
            <option value="Europe/Moscow">Москва (UTC+3)</option>
            <option value="Europe/London">Лондон (UTC+0)</option>
            <option value="America/New_York">Нью-Йорк (UTC-5)</option>
          </select>
        </div>

        <div class="schedule-days">
          <div class="day-schedule" v-for="day in days" :key="day.key">
            <div class="day-header">
              <label class="day-label">
                <input type="checkbox" v-model="day.is_working_day" />
                {{ day.name }}
              </label>
            </div>
            <div v-if="day.is_working_day" class="day-times">
              <div class="time-input">
                <label>С</label>
                <input type="time" v-model="day.start_time" />
              </div>
              <div class="time-input">
                <label>До</label>
                <input type="time" v-model="day.end_time" />
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button @click="saveSchedule" class="btn-save">Сохранить</button>
          <button @click="resetSchedule" class="btn-reset">Сбросить</button>
        </div>
      </div>

      <div class="preview-section">
        <h3>Предварительный просмотр</h3>
        <div class="schedule-preview">
          <div class="current-status">
            <div class="status-indicator" :class="{ 'online': isCurrentlyOnline, 'offline': !isCurrentlyOnline }">
              {{ isCurrentlyOnline ? 'Онлайн' : 'Офлайн' }}
            </div>
            <div class="status-time">
              {{ currentTime }}
            </div>
          </div>
          <div class="next-available" v-if="!isCurrentlyOnline">
            <p>Следующий доступ: {{ nextAvailable }}</p>
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

const scheduleConfig = ref({
  timezone: 'Europe/Kiev'
})

const days = ref([
  { key: 'monday', name: 'Понедельник', is_working_day: true, start_time: '09:00', end_time: '18:00' },
  { key: 'tuesday', name: 'Вторник', is_working_day: true, start_time: '09:00', end_time: '18:00' },
  { key: 'wednesday', name: 'Среда', is_working_day: true, start_time: '09:00', end_time: '18:00' },
  { key: 'thursday', name: 'Четверг', is_working_day: true, start_time: '09:00', end_time: '18:00' },
  { key: 'friday', name: 'Пятница', is_working_day: true, start_time: '09:00', end_time: '18:00' },
  { key: 'saturday', name: 'Суббота', is_working_day: false, start_time: '10:00', end_time: '16:00' },
  { key: 'sunday', name: 'Воскресенье', is_working_day: false, start_time: '10:00', end_time: '16:00' }
])

const currentTime = ref('')
const isCurrentlyOnline = ref(false)
const nextAvailable = ref('')

const loadSchedule = async () => {
  try {
    const response = await api.get('/schedules/')
    if (response.data.length > 0) {
      const schedule = response.data[0]
      scheduleConfig.value.timezone = schedule.timezone || 'Europe/Kiev'
      
      // Update days with loaded data
      days.value.forEach(day => {
        const dayData = schedule.days?.find((d: any) => d.day === day.key)
        if (dayData) {
          day.is_working_day = dayData.is_working_day
          day.start_time = dayData.start_time
          day.end_time = dayData.end_time
        }
      })
    }
  } catch (error) {
    console.error('Failed to load schedule:', error)
  }
}

const saveSchedule = async () => {
  try {
    const scheduleData = {
      timezone: scheduleConfig.value.timezone,
      days: days.value.map(day => ({
        day: day.key,
        is_working_day: day.is_working_day,
        start_time: day.start_time,
        end_time: day.end_time
      }))
    }
    
    await api.post('/schedules/', scheduleData)
    alert('Расписание сохранено!')
  } catch (error) {
    console.error('Failed to save schedule:', error)
    alert('Ошибка при сохранении расписания')
  }
}

const resetSchedule = () => {
  days.value.forEach(day => {
    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key)) {
      day.is_working_day = true
      day.start_time = '09:00'
      day.end_time = '18:00'
    } else {
      day.is_working_day = false
      day.start_time = '10:00'
      day.end_time = '16:00'
    }
  })
}

const updateCurrentStatus = () => {
  const now = new Date()
  const currentDay = days.value[now.getDay() === 0 ? 6 : now.getDay() - 1] // Convert Sunday=0 to Sunday=6
  const currentTimeStr = now.toTimeString().slice(0, 5)
  
  currentTime.value = now.toLocaleString('ru-RU', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  if (currentDay.is_working_day) {
    isCurrentlyOnline.value = currentTimeStr >= currentDay.start_time && currentTimeStr <= currentDay.end_time
  } else {
    isCurrentlyOnline.value = false
  }
  
  if (!isCurrentlyOnline.value) {
    // Find next available time
    const nextDay = days.value.find(day => day.is_working_day)
    if (nextDay) {
      nextAvailable.value = `${nextDay.name} в ${nextDay.start_time}`
    }
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/client/auth/login')
    return
  }
  
  await loadSchedule()
  updateCurrentStatus()
  
  // Update status every minute
  setInterval(updateCurrentStatus, 60000)
})
</script>
