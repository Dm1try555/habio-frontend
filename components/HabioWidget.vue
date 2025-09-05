<template>
  <div class="habio-widget" :class="{ 'habio-widget--open': isOpen }">
    <!-- Floating Action Button -->
    <HabioFab :is-open="isOpen" @toggle="toggleWidget" />

    <!-- Widget Panel -->
    <div v-if="isOpen" class="habio-panel">
      <!-- Main Panel with Channels -->
      <HabioPanel
        v-if="!showCallbackForm && !showChatForm && !showLeadForm"
        :is-online="isOnline"
        :next-available="nextAvailable"
        :top-channels="topChannels"
        :other-channels="otherChannels"
        @channel-click="handleChannelClick"
      />

      <!-- Callback Form -->
      <HabioCallbackForm
        v-if="showCallbackForm"
        :project-id="projectId"
        :api-base="apiBase"
        @close="showCallbackForm = false"
        @success="showCallbackForm = false"
      />

      <!-- Chat Widget -->
      <HabioChatWidget
        v-if="showChatForm"
        :project-id="projectId"
        :api-base="apiBase"
        @close="showChatForm = false"
      />

      <!-- Lead Form -->
      <HabioLeadForm
        v-if="showLeadForm"
        :project-id="projectId"
        :api-base="apiBase"
        @close="showLeadForm = false"
        @success="showLeadForm = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Channel } from '~/composables/useWidgetConfig'
import { useWidgetConfig } from '~/composables/useWidgetConfig'
import { useWidgetAnalytics } from '~/composables/useWidgetAnalytics'
import { useChannelMemory } from '~/composables/useChannelMemory'
import HabioFab from '~/components/HabioFab.vue'
import HabioPanel from '~/components/HabioPanel.vue'
import HabioCallbackForm from '~/components/HabioCallbackForm.vue'
import HabioChatWidget from '~/components/HabioChatWidget.vue'
import HabioLeadForm from '~/components/HabioLeadForm.vue'

const props = defineProps<{
  projectId: string
  apiBase?: string
}>()

const apiBase = props.apiBase || 'http://127.0.0.1:8000/api'

// Widget state
const isOpen = ref(false)
const showCallbackForm = ref(false)
const showChatForm = ref(false)
const showLeadForm = ref(false)

// Composables
const { trackEvent } = useWidgetAnalytics()
const { saveLastUsedChannel } = useChannelMemory()
const {
  config,
  loading,
  isOnline,
  nextAvailable,
  topChannels,
  otherChannels,
  loadConfig
} = useWidgetConfig(props.projectId, apiBase)

// Load config on mount
onMounted(() => {
  loadConfig()
})


// Handle widget toggle
const toggleWidget = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    trackEvent('widget_impression')
  }
}

// Handle channel clicks
const handleChannelClick = (channel: Channel) => {
  // Save last used channel
  saveLastUsedChannel(channel.id)
  
  switch (channel.type) {
    case 'call':
      const phoneNumber = channel.phone_number || channel.link
      if (phoneNumber) {
        // Ensure phone number has tel: prefix
        const telLink = phoneNumber.startsWith('tel:') ? phoneNumber : `tel:${phoneNumber}`
        window.location.href = telLink
        trackEvent('start_call', { channel_id: channel.id, phone: phoneNumber })
      } else {
        alert('Номер телефона не настроен. Обратитесь к администратору.')
      }
      break
    case 'callback':
      showCallbackForm.value = true
      trackEvent('open_callback_form', { channel_id: channel.id })
      break
    case 'messenger':
      if (channel.link) {
        window.open(channel.link, '_blank')
        trackEvent('open_messenger', { 
          channel_id: channel.id, 
          messenger_type: channel.label.toLowerCase() 
        })
      }
      break
    case 'chat':
      showChatForm.value = true
      trackEvent('start_chat', { channel_id: channel.id })
      break
    case 'form':
      showLeadForm.value = true
      trackEvent('open_form', { channel_id: channel.id })
      break
  }
  
  // Track analytics
  trackEvent('channel_click', {
    channel_id: channel.id,
    channel_type: channel.type,
    is_online: isOnline.value,
    position: topChannels.value.findIndex(c => c.id === channel.id) + 1
  })
}
</script>

<style scoped>
@import '~/assets/css/widget-base.css';
@import '~/assets/css/widget-panel.css';
@import '~/assets/css/widget-channels.css';
@import '~/assets/css/widget-forms.css';
</style>