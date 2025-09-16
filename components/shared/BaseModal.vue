<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="base-modal-overlay" @click="handleOverlayClick">
        <div class="base-modal-container" :class="containerClass" @click.stop>
          <div class="base-modal-header" v-if="title || $slots.header">
            <slot name="header">
              <h3 class="base-modal-title">{{ title }}</h3>
            </slot>
            <button 
              v-if="showClose"
              @click="handleClose" 
              class="base-modal-close"
              aria-label="Закрыть"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15.5 4.5L4.5 15.5M4.5 4.5l11 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="base-modal-body">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="base-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  showClose?: boolean
  closeOnOverlay?: boolean
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  showClose: true,
  closeOnOverlay: true
})

const emit = defineEmits<{
  close: []
  'update:isOpen': [value: boolean]
}>()

const handleClose = () => {
  emit('close')
  emit('update:isOpen', false)
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>

<style scoped>
.base-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.base-modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.base-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  margin-bottom: 20px;
}

.base-modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.base-modal-close {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.base-modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.base-modal-body {
  padding: 0 24px;
  flex: 1;
  overflow-y: auto;
}

.base-modal-footer {
  padding: 20px 24px 24px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .base-modal-container,
.modal-leave-to .base-modal-container {
  transform: scale(0.95) translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .base-modal-overlay {
    padding: 10px;
  }
  
  .base-modal-container {
    max-width: 100%;
  }
  
  .base-modal-header,
  .base-modal-body,
  .base-modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .base-modal-footer {
    flex-direction: column;
  }
}
</style>