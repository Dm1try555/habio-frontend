<template>
  <div class="client-page">
    <div class="client-header">
      <h1>Аналитика</h1>
      <p>Статистика и отчеты по вашим проектам</p>
    </div>

    <div class="analytics-container">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Всего просмотров</h3>
          <div class="stat-value">1,234</div>
          <div class="stat-change positive">+12%</div>
        </div>
        <div class="stat-card">
          <h3>Клики по каналам</h3>
          <div class="stat-value">456</div>
          <div class="stat-change positive">+8%</div>
        </div>
        <div class="stat-card">
          <h3>Конверсия</h3>
          <div class="stat-value">3.2%</div>
          <div class="stat-change negative">-2%</div>
        </div>
        <div class="stat-card">
          <h3>Активные проекты</h3>
          <div class="stat-value">3</div>
          <div class="stat-change neutral">0%</div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <h3>Популярные каналы</h3>
          <div class="chart-placeholder">
            <p>График популярности каналов</p>
            <div class="chart-bars">
              <div class="bar" style="height: 80%">Звонок</div>
              <div class="bar" style="height: 60%">WhatsApp</div>
              <div class="bar" style="height: 40%">Telegram</div>
              <div class="bar" style="height: 30%">Форма</div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Активность по дням</h3>
          <div class="chart-placeholder">
            <p>График активности за последние 7 дней</p>
            <div class="chart-line">
              <div class="line-point" style="left: 10%; bottom: 20%"></div>
              <div class="line-point" style="left: 25%; bottom: 40%"></div>
              <div class="line-point" style="left: 40%; bottom: 60%"></div>
              <div class="line-point" style="left: 55%; bottom: 30%"></div>
              <div class="line-point" style="left: 70%; bottom: 80%"></div>
              <div class="line-point" style="left: 85%; bottom: 70%"></div>
              <div class="line-point" style="left: 100%; bottom: 90%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="back-section">
      <button class="btn-secondary" @click="$router.push('/client/dashboard')">
        ← Назад к панели
      </button>
    </div>
  </div>
</template>

<script setup>
</script>

<style src="~/assets/css/client/index.css"></style>
<style scoped>
.analytics-container {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  color: var(--client-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--client-primary);
  margin-bottom: 0.5rem;
}

.stat-change {
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #28a745;
}

.stat-change.negative {
  color: #dc3545;
}

.stat-change.neutral {
  color: #6c757d;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  color: var(--client-primary);
  margin-bottom: 1rem;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 4px;
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 100px;
  width: 100%;
  padding: 0 1rem;
}

.bar {
  flex: 1;
  background: var(--client-primary);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  display: flex;
  align-items: end;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  padding: 0.5rem 0;
}

.chart-line {
  position: relative;
  height: 100px;
  width: 100%;
  background: linear-gradient(to right, var(--client-primary), transparent);
  border-radius: 4px;
}

.line-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--client-primary);
  border-radius: 50%;
  border: 2px solid white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-secondary:hover {
  background: #5a6268;
  color: white;
  text-decoration: none;
}

.back-section {
  text-align: center;
  margin-top: 2rem;
}
</style>