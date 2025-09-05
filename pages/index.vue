<script setup lang="ts">
const { getChannels, createLead } = useApi()
const channels = ref([])

onMounted(async () => {
  channels.value = await getChannels()
})

const sendLead = async () => {
  await createLead({ channel: 1, contact: "+380999999999", message: "Хочу дзвінок" })
}
</script>

<template>
  <div class="p-5">
    <button class="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full">
      Зв’язок
    </button>

    <ul>
      <li v-for="ch in channels" :key="ch.id">{{ ch.label }} ({{ ch.type }})</li>
    </ul>

    <button @click="sendLead" class="mt-4 bg-green-500 text-white p-2">
      Відправити заявку
    </button>
  </div>
</template>
