<template>
  <div class="base-input-group" :class="groupClass">
    <label v-if="label" :for="inputId" class="base-input-label">
      {{ label }}
      <span v-if="required" class="required-asterisk">*</span>
    </label>
    
    <div class="base-input-wrapper">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :minlength="minLength"
        :maxlength="maxLength"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :class="inputClass"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        v-bind="$attrs"
      />
      
      <div v-if="$slots.suffix" class="base-input-suffix">
        <slot name="suffix" />
      </div>
    </div>
    
    <div v-if="hint" class="base-input-hint">
      {{ hint }}
    </div>
    
    <div v-if="error" class="base-input-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date' | 'time' | 'datetime-local'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  min?: number | string
  max?: number | string
  step?: number | string
  minLength?: number
  maxLength?: number
  pattern?: string
  autocomplete?: string
  groupClass?: string
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = useId()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<style scoped>
.base-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.base-input-label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.required-asterisk {
  color: #dc2626;
  margin-left: 2px;
}

.base-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.base-input-wrapper input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.base-input-wrapper input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.base-input-wrapper input:read-only {
  background: #f9fafb;
  color: #6b7280;
}

.base-input-wrapper input.error {
  border-color: #dc2626;
}

.base-input-suffix {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  color: #6b7280;
}

.base-input-hint {
  font-size: 12px;
  color: #6b7280;
}

.base-input-error {
  font-size: 12px;
  color: #dc2626;
}

/* Input states */
.base-input-wrapper input.error {
  border-color: #dc2626;
}

.base-input-wrapper input.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
</style>