<template>
  <div class="admin-section">
    <div class="admin-section__header">
      <h2>Расписание</h2>
      <button @click="showScheduleForm = true" class="btn btn--primary">
        Добавить расписание
      </button>
    </div>
    
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>День</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Рабочий день</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in schedules" :key="schedule.id">
            <td>{{ schedule.id }}</td>
            <td>{{ getDayName(schedule.day) }}</td>
            <td>{{ schedule.start_time }}</td>
            <td>{{ schedule.end_time }}</td>
            <td>{{ schedule.is_working_day ? 'Да' : 'Нет' }}</td>
            <td>
              <button @click="editSchedule(schedule)" class="btn btn--small">Редактировать</button>
              <button @click="handleDeleteSchedule(schedule.id)" class="btn btn--small btn--danger">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
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
          <select v-model="scheduleForm.day">
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
</template>

<script setup>
import { onMounted } from 'vue'
import { useScheduleScripts } from '~/scripts/schedules'
import { useProjectScripts } from '~/scripts/projects'

const {
  schedules,
  showScheduleForm,
  editingSchedule,
  scheduleForm,
  getDayName,
  editSchedule,
  saveSchedule,
  handleDeleteSchedule,
  closeScheduleForm
} = useScheduleScripts()

const { projects } = useProjectScripts()

onMounted(async () => {
  try {
    if (!schedules || !Array.isArray(schedules) || !schedules.length) {
      await loadSchedules()
    }
  } catch (e) {
    console.error('Failed to load schedules in section:', e)
  }
})
</script>