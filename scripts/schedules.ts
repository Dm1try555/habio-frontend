import { ref } from 'vue'
import { useSchedules } from '~/composables/useSchedules'

export const useScheduleScripts = () => {
  const {
    schedules,
    loadSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule
  } = useSchedules()

  const showScheduleForm = ref(false)
  const editingSchedule = ref<any>(null)

  const scheduleForm = ref({
    project: 1,
    day: 'monday',
    start_time: '09:00',
    end_time: '18:00',
    is_working_day: true
  })

  const getDayName = (day: string) => {
    const days = {
      monday: 'Понедельник',
      tuesday: 'Вторник',
      wednesday: 'Среда',
      thursday: 'Четверг',
      friday: 'Пятница',
      saturday: 'Суббота',
      sunday: 'Воскресенье'
    }
    return days[day as keyof typeof days] || day
  }

  const editSchedule = (schedule: any) => {
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
      if (editingSchedule.value) {
        await updateSchedule(editingSchedule.value.id, scheduleForm.value)
      } else {
        await createSchedule(scheduleForm.value)
      }
      closeScheduleForm()
    } catch (error) {
      console.error('Failed to save schedule:', error)
    }
  }

  const handleDeleteSchedule = async (id: number) => {
    if (confirm('Удалить расписание?')) {
      try {
        await deleteSchedule(id)
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

  return {
    schedules,
    loadSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedule,
    showScheduleForm,
    editingSchedule,
    scheduleForm,
    getDayName,
    editSchedule,
    saveSchedule,
    handleDeleteSchedule,
    closeScheduleForm
  }
}