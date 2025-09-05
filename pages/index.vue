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
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-header {
  text-align: center;
  padding: 60px 20px 40px;
}

.demo-header h1 {
  font-size: 3rem;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.demo-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.demo-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.demo-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-section h2 {
  font-size: 2rem;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.demo-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
  opacity: 0.9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-card h3 {
  font-size: 1.3rem;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.feature-card p {
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
}

.demo-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.demo-info h3 {
  margin: 0 0 12px 0;
  font-size: 1.2rem;
}

.demo-info ul {
  margin: 0;
  padding-left: 20px;
}

.demo-info li {
  margin-bottom: 8px;
  opacity: 0.9;
}

.api-endpoints {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.endpoint {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.endpoint code {
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  min-width: 200px;
}

.endpoint span {
  opacity: 0.8;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-header p {
    font-size: 1rem;
  }
  
  .demo-section {
    padding: 20px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .endpoint {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .endpoint code {
    min-width: auto;
    width: 100%;
  }
}
</style>