<template>
  <div class="demo-page">
    <header class="demo-header">
      <h1>HABIO-CHAT Demo</h1>
      <p>Умный виджет связи с адаптивным роутингом каналов</p>
    </header>

    <main class="demo-content">
      <section class="demo-section">
        <h2>О продукте</h2>
        <p>
          HABIO-CHAT - это единый виджет "Кнопка связи", который показывает пользователю 
          наиболее релевантные каналы в зависимости от времени суток, устройства и 
          предыдущего взаимодействия.
        </p>
      </section>

      <section class="demo-section">
        <h2>Ключевые возможности</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🕐 Умный роутинг</h3>
            <p>Адаптация каналов по времени работы и типу устройства</p>
          </div>
          <div class="feature-card">
            <h3>📱 Мультиплатформенность</h3>
            <p>Разные приоритеты для мобильных и десктопных устройств</p>
          </div>
          <div class="feature-card">
            <h3>🧠 Персональная память</h3>
            <p>Запоминание последнего использованного канала</p>
          </div>
          <div class="feature-card">
            <h3>📊 Аналитика</h3>
            <p>Отслеживание конверсий и взаимодействий</p>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2>Демонстрация виджета</h2>
        <p>
          Виджет находится в правом нижнем углу страницы. 
          Попробуйте открыть его и протестировать различные каналы связи.
        </p>
        <div class="demo-info">
          <h3>Текущее состояние:</h3>
          <ul>
            <li>Время: {{ currentTime }}</li>
            <li>Устройство: {{ deviceType }}</li>
            <li>Статус: {{ isOnline ? 'Онлайн' : 'Офлайн' }}</li>
          </ul>
        </div>
      </section>

      <section class="demo-section">
        <h2>API Endpoints</h2>
        <div class="api-endpoints">
          <div class="endpoint">
            <code>GET /api/widget/{project_id}/channels/</code>
            <span>Получить каналы для проекта</span>
          </div>
          <div class="endpoint">
            <code>POST /api/widget/{project_id}/create_lead/</code>
            <span>Создать лид</span>
          </div>
          <div class="endpoint">
            <code>POST /api/widget/{project_id}/create_callback/</code>
            <span>Создать заявку на звонок</span>
          </div>
        </div>
      </section>
    </main>

    <!-- Habio Widget -->
    <HabioWidget 
      :project-id="projectId" 
      :api-base="apiBase"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HabioWidget from '~/components/HabioWidget.vue'

const projectId = ref('1')
const apiBase = ref('http://127.0.0.1:8000/api')
const currentTime = ref('')
const deviceType = ref('desktop')
const isOnline = ref(false)

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const detectDevice = () => {
  deviceType.value = window.innerWidth < 768 ? 'mobile' : 'desktop'
}

onMounted(() => {
  updateTime()
  detectDevice()
  
  // Update time every minute
  setInterval(updateTime, 60000)
  
  // Update device type on resize
  window.addEventListener('resize', detectDevice)
})
</script>

<style scoped>
@import '~/assets/css/demo-page.css';
@import '~/assets/css/demo-features.css';
@import '~/assets/css/demo-api.css';
</style>