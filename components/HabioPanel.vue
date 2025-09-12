<template>
  <div class="habio-panel-content">
    <div class="habio-panel__header">
      <h3 class="habio-panel__title">Свяжитесь с нами</h3>
      <div v-if="!isOnline" class="habio-panel__badge">
        Доступно с {{ nextAvailable }}
      </div>
    </div>

    <div class="habio-panel__content">
      <!-- Top Actions -->
      <div class="habio-panel__top-actions">
        <button
          v-for="channel in topChannels"
          :key="channel.id"
          class="habio-channel habio-channel--primary"
          @click="$emit('channel-click', channel)"
        >
          <span class="habio-channel__icon">{{ getChannelIcon(channel.type) }}</span>
          <span class="habio-channel__label">{{ channel.label }}</span>
          <span v-if="channel.type === 'call' && !isOnline" class="habio-channel__badge">
            Доступно с {{ nextAvailable }}
          </span>
        </button>
      </div>

      <!-- Other Channels -->
      <div v-if="otherChannels.length > 0" class="habio-panel__other-channels">
        <h4 class="habio-panel__subtitle">Другие способы связи</h4>
        <div class="habio-panel__channels-grid">
          <button
            v-for="channel in otherChannels"
            :key="channel.id"
            class="habio-channel habio-channel--secondary"
            @click="$emit('channel-click', channel)"
          >
            <span class="habio-channel__icon">{{ getChannelIcon(channel.type) }}</span>
            <span class="habio-channel__label">{{ channel.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Channel } from '~/composables/shared/useWidgetConfig'
import { useChannelIcons } from '~/composables/shared/useChannelIcons'

defineProps({
  isOnline: {
    type: Boolean,
    required: true
  },
  nextAvailable: {
    type: String,
    required: true
  },
  topChannels: {
    type: Array,
    required: true
  },
  otherChannels: {
    type: Array,
    required: true
  }
})

defineEmits(['channel-click'])

const { getChannelIcon } = useChannelIcons()
</script>

<style scoped>
/* Widget styles are now imported globally in nuxt.config.ts */
</style>