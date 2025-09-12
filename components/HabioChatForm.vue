<template>
  <div class="habio-chat-form">
    <div class="habio-form__header">
      <h4 class="habio-panel__subtitle">Онлайн чат</h4>
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
        <textarea
          v-model="form.message"
          placeholder="Ваше сообщение"
          class="habio-form__textarea"
          rows="4"
          required
        ></textarea>
      </div>
      <button type="submit" class="habio-form__submit" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Отправить сообщение' }}
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
  name: '',
  email: '',
  message: ''
})

const handleSubmit = async () => {
  await withLoading(async () => {
    const response = await fetch(`${props.apiBase}/widget/${props.projectId}/create_lead/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: 5, // Онлайн чат
        contact: `${form.value.name} <${form.value.email}>`,
        message: form.value.message,
        page_url: window.location.href,
        client_id: getClientId(),
        device_type: 'desktop',
        language: navigator.language
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      alert('Сообщение отправлено!')
      form.value = { name: '', email: '', message: '' }
      emit('success', result)
      
      trackEvent('lead_created', {
        lead_id: result.id,
        contact: form.value.name,
        type: 'chat'
      })
    } else {
      throw new Error('Failed to submit chat message')
    }
  })
}
</script>

<style scoped>
/* Widget styles are now imported globally in nuxt.config.ts */
</style>