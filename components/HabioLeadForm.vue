<template>
  <div class="habio-lead-form">
    <div class="habio-form__header">
      <h4 class="habio-panel__subtitle">Оставить заявку</h4>
      <button @click="$emit('close')" class="habio-form__back">← Назад</button>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="habio-form__group">
        <input
          v-model="form.name"
          type="text"
          placeholder="Ваше имя"
          class="habio-form__input"
          required
        />
      </div>
      <div class="habio-form__group">
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="habio-form__input"
          required
        />
      </div>
      <div class="habio-form__group">
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Телефон"
          class="habio-form__input"
          required
        />
      </div>
      <div class="habio-form__group">
        <textarea
          v-model="form.message"
          placeholder="Сообщение"
          class="habio-form__textarea"
          rows="4"
          required
        ></textarea>
      </div>
      <button type="submit" class="habio-form__submit" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Отправить заявку' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWidgetAnalytics } from '~/composables/useWidgetAnalytics'

const props = defineProps<{
  projectId: string
  apiBase: string
}>()

const emit = defineEmits<{
  close: []
  success: [data: any]
}>()

const { trackEvent, getClientId } = useWidgetAnalytics()

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await fetch(`${props.apiBase}/widget/${props.projectId}/create_lead/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: 6, // Оставить заявку
        contact: `${form.value.name} <${form.value.email}>`,
        message: `Телефон: ${form.value.phone}\n\n${form.value.message}`,
        page_url: window.location.href,
        client_id: getClientId(),
        device_type: 'desktop',
        language: navigator.language
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      alert('Заявка отправлена!')
      form.value = { name: '', email: '', phone: '', message: '' }
      emit('success', result)
      
      trackEvent('lead_created', {
        lead_id: result.id,
        contact: form.value.name,
        type: 'form'
      })
    } else {
      throw new Error('Failed to submit lead')
    }
  } catch (error) {
    console.error('Failed to submit lead:', error)
    alert('Ошибка при отправке заявки. Попробуйте еще раз.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '~/assets/css/widget-forms.css';
</style>