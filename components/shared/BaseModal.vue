<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div
          ref="modalRef"
          class="modal-container"
          :class="modalClasses"
          role="dialog"
          :aria-labelledby="titleId"
          :aria-describedby="descriptionId"
          @click.stop
        >
          <div class="modal-header" v-if="$slots.header || title">
            <slot name="header">
              <h3 :id="titleId" class="modal-title">{{ title }}</h3>
            </slot>
            <button
              v-if="closable"
              type="button"
              class="modal-close"
              :aria-label="closeLabel"
              @click="close"
            >
              <span class="modal-close-icon">×</span>
            </button>
          </div>
          
          <div class="modal-body" :id="descriptionId">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch, nextTick } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  closeLabel?: string
  preventScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  closeOnEscape: true,
  closeLabel: 'Close modal',
  preventScroll: true
})

const emit = defineEmits<{
  close: []
  'update:isOpen': [value: boolean]
}>()

const modalRef = ref<HTMLElement>()
const titleId = useId()
const descriptionId = useId()

const modalClasses = computed(() => {
  const classes = ['modal-container']
  classes.push(`modal-${props.size}`)
  return classes
})

const close = () => {
  emit('close')
  emit('update:isOpen', false)
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape) {
    close()
  }
}

const focusModal = async () => {
  await nextTick()
  modalRef.value?.focus()
}

const preventBodyScroll = (prevent: boolean) => {
  if (typeof document === 'undefined') return
  
  if (prevent) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
    if (props.preventScroll) {
      preventBodyScroll(true)
    }
    focusModal()
  } else {
    document.removeEventListener('keydown', handleEscape)
    if (props.preventScroll) {
      preventBodyScroll(false)
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  if (props.preventScroll) {
    preventBodyScroll(false)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: 1rem;
}

.modal-container {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
}

.modal-sm {
  max-width: 24rem;
}

.modal-md {
  max-width: 32rem;
}

.modal-lg {
  max-width: 48rem;
}

.modal-xl {
  max-width: 64rem;
}

.modal-full {
  max-width: 95vw;
  max-height: 95vh;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  color: var(--color-gray-400);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-600);
}

.modal-close-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.modal-body {
  padding: 0 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-gray-200);
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-normal);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}
</style>