<template>
  <form @submit.prevent="handleSubmit" class="base-form" :class="formClass">
    <div v-if="title" class="base-form-header">
      <h3 class="base-form-title">{{ title }}</h3>
      <p v-if="description" class="base-form-description">{{ description }}</p>
    </div>
    
    <div class="base-form-body">
      <slot />
    </div>
    
    <div v-if="$slots.actions || showDefaultActions" class="base-form-actions">
      <slot name="actions">
        <BaseButton 
          type="submit" 
          :loading="loading" 
          :disabled="disabled"
          variant="primary"
        >
          {{ submitText }}
        </BaseButton>
        <BaseButton 
          v-if="showCancel"
          type="button" 
          variant="outline"
          @click="handleCancel"
        >
          {{ cancelText }}
        </BaseButton>
      </slot>
    </div>
    
    <div v-if="error" class="base-form-error">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'

interface Props {
  title?: string
  description?: string
  loading?: boolean
  disabled?: boolean
  error?: string
  submitText?: string
  cancelText?: string
  showDefaultActions?: boolean
  showCancel?: boolean
  formClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  submitText: 'Сохранить',
  cancelText: 'Отмена',
  showDefaultActions: true,
  showCancel: true
})

const emit = defineEmits<{
  submit: [event: Event]
  cancel: []
}>()

const handleSubmit = (event: Event) => {
  emit('submit', event)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.base-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.base-form-header {
  margin-bottom: 24px;
}

.base-form-title {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.base-form-description {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.base-form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.base-form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.base-form-error {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #fecaca;
}

/* Responsive */
@media (max-width: 768px) {
  .base-form {
    padding: 16px;
  }
  
  .base-form-actions {
    flex-direction: column;
  }
}
</style>