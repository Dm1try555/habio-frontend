<template>
  <button 
    class="habio-fab"
    @click="$emit('toggle')"
    :aria-label="isOpen ? 'Закрыть панель связи' : 'Открыть панель связи'"
  >
    <svg v-if="!isOpen" class="habio-fab__icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
    <svg v-else class="habio-fab__icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
@import '~/assets/css/widget-base.css';
</style>