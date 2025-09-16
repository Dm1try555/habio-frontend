<template>
  <div class="base-select-group" :class="groupClass">
    <label v-if="label" :for="selectId" class="base-select-label">
      {{ label }}
      <span v-if="required" class="required-asterisk">*</span>
    </label>
    
    <div class="base-select-wrapper">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClass"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
        v-bind="$attrs"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option 
          v-for="option in options" 
          :key="getOptionValue(option)" 
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      
      <div class="base-select-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 10L4 6h8l-4 4z"/>
        </svg>
      </div>
    </div>
    
    <div v-if="hint" class="base-select-hint">
      {{ hint }}
    </div>
    
    <div v-if="error" class="base-select-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Option {
  value: any
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: any
  options: Option[] | string[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  valueKey?: string
  labelKey?: string
  groupClass?: string
  selectClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  valueKey: 'value',
  labelKey: 'label'
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectId = useId()

const getOptionValue = (option: any) => {
  if (typeof option === 'string') return option
  return option[props.valueKey]
}

const getOptionLabel = (option: any) => {
  if (typeof option === 'string') return option
  return option[props.labelKey]
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<style scoped>
.base-select-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.base-select-label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.required-asterisk {
  color: #dc2626;
  margin-left: 2px;
}

.base-select-wrapper {
  position: relative;
}

.base-select-wrapper select {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.base-select-wrapper select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.base-select-wrapper select:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.base-select-wrapper select.error {
  border-color: #dc2626;
}

.base-select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
}

.base-select-hint {
  font-size: 12px;
  color: #6b7280;
}

.base-select-error {
  font-size: 12px;
  color: #dc2626;
}

/* Select states */
.base-select-wrapper select.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
</style>