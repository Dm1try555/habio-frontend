<template>
  <div />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientAuth } from '~/composables/client/useClientAuth'

const router = useRouter()
const { isAuthenticated } = useClientAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    router.replace('/client/dashboard')
  } else {
    router.replace('/client/auth/login')
  }
})
</script>