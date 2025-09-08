<template>
  <div class="admin-page">
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatSection from '~/components/admin/ChatSection.vue'
import LeadsSection from '~/components/admin/LeadsSection.vue'
import ChannelsSection from '~/components/admin/ChannelsSection.vue'
import SchedulesSection from '~/components/admin/SchedulesSection.vue'
import UsersSection from '~/components/admin/UsersSection.vue'
import ProjectsSection from '~/components/admin/ProjectsSection.vue'
import SettingsSection from '~/components/admin/SettingsSection.vue'

const route = useRoute()

const currentComponent = computed(() => {
  const section = typeof route.params.section === 'string' ? route.params.section : ''
  switch (section) {
    case 'projects':
      return ProjectsSection
    case 'chats':
      return ChatSection
    case 'leads':
      return LeadsSection
    case 'channels':
      return ChannelsSection
    case 'schedule':
      return SchedulesSection
    case 'users':
      return UsersSection
    case 'settings':
      return SettingsSection
    default:
      return null
  }
})
</script>

<style scoped>
@import '~/assets/css/admin.css';
</style>

