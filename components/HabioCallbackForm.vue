<template>
  <div class="habio-callback-form">
    <div class="habio-form__header">
      <h4 class="habio-panel__subtitle">Заказать звонок</h4>
      <button @click="$emit('close')" class="habio-form__back">← Назад</button>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="habio-form__group">
        <input
          v-model="form.phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          class="habio-form__input"
          required
        />
      </div>
      <div class="habio-form__group">
        <input
          v-model="form.preferred_time"
          type="datetime-local"
          class="habio-form__input"
        />
      </div>
      <div class="habio-form__group">
        <textarea
          v-model="form.message"
          placeholder="Сообщение (необязательно)"
          class="habio-form__textarea"
          rows="3"
        ></textarea>
      </div>
      <button type="submit" class="habio-form__submit" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Заказать звонок' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWidgetAnalytics } from '~/composables/shared/useWidgetAnalytics'
import { useForm } from '~/composables/shared/useForm'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  apiBase: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const { trackEvent, getClientId } = useWidgetAnalytics()

const { form, loading, error, withLoading } = useForm({
  phone: '',
  preferred_time: '',
  message: ''
})

const handleSubmit = async () => {
  await withLoading(async () => {
    // Create lead for callback request
    const response = await fetch(`${props.apiBase}/widget/${props.projectId}/create_lead/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: 2, // Заказать звонок
        contact: `Заказ звонка <${form.value.phone}>`,
        message: `Предпочтительное время: ${form.value.preferred_time || 'Не указано'}\n\n${form.value.message || 'Без сообщения'}`,
        page_url: window.location.href,
        client_id: getClientId(),
        device_type: 'desktop',
        language: navigator.language
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      alert('Заявка на звонок отправлена!')
      form.value = { phone: '', preferred_time: '', message: '' }
      emit('success', result)
      
      trackEvent('submit_callback', {
        lead_id: result.id,
        phone: form.value.phone,
        preferred_time: form.value.preferred_time
      })
    } else {
      const errorData = await response.json()
      console.error('API error:', errorData)
      throw new Error('Failed to submit callback request')
    }
  })
}
</script>

<style scoped>
/* Widget styles are now imported globally in nuxt.config.ts */
</style>