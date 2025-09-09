<template>
  <div class="form-group" :class="{ 'has-error': hasError, 'has-success': hasSuccess }">
    <label v-if="label" :for="inputId" class="form-label" :class="{ required }">
      {{ label }}
    </label>
    
    <div class="input-wrapper" :class="wrapperClasses">
      <div v-if="prefixIcon || $slots.prefix" class="input-prefix">
        <slot name="prefix">
          <span v-if="prefixIcon" class="input-icon">{{ prefixIcon }}</span>
        </slot>
      </div>
      
      <input
        :id="inputId"
        ref="inputRef"
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
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="suffixIcon || $slots.suffix" class="input-suffix">
        <slot name="suffix">
          <span v-if="suffixIcon" class="input-icon">{{ suffixIcon }}</span>
        </slot>
      </div>
    </div>
    
    <div v-if="helpText && !errorMessage" class="form-help">
      {{ helpText }}
    </div>
    
    <div v-if="errorMessage" class="form-error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  helpText?: string
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
  prefixIcon?: string
  suffixIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const inputId = useId()

const hasError = computed(() => !!props.errorMessage)
const hasSuccess = computed(() => !hasError.value && props.modelValue && props.modelValue.toString().length > 0)

const wrapperClasses = computed(() => {
  const classes = ['input-wrapper']
  
  if (props.prefixIcon || props.$slots?.prefix) {
    classes.push('has-prefix')
  }
  
  if (props.suffixIcon || props.$slots?.suffix) {
    classes.push('has-suffix')
  }
  
  return classes
})

const inputClasses = computed(() => {
  const classes = ['form-input']
  
  if (props.size !== 'md') {
    classes.push(`form-input-${props.size}`)
  }
  
  if (hasError.value) {
    classes.push('error')
  }
  
  return classes
})

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

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur
})
</script>

<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper.has-prefix .form-input {
  padding-left: 2.5rem;
}

.input-wrapper.has-suffix .form-input {
  padding-right: 2.5rem;
}

.input-prefix,
.input-suffix {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--color-gray-400);
  pointer-events: none;
}

.input-prefix {
  left: 0.75rem;
}

.input-suffix {
  right: 0.75rem;
}

.input-icon {
  font-size: 1rem;
}

.form-input-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.form-input-lg {
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
}
</style>