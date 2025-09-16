<template>
  <div class="test-page">
    <h1>Тестовая страница</h1>
    <p>Ссылки для тестирования всех систем</p>
    
    <div class="test-links">
      <h2>Админка</h2>
      <div class="link-group">
        <a href="/admin/login" class="test-link">Вход в админку</a>
        <a href="/admin/admin/dashboard" class="test-link">Дашборд админа</a>
        <a href="/admin/admin/analytics" class="test-link">Аналитика</a>
        <a href="/admin/admin/payments" class="test-link">Пейменты</a>
        <a href="/admin/admin/settings" class="test-link">Настройки</a>
        <a href="/admin/admin/users" class="test-link">Юзеры</a>
      </div>

      <h2>Маркетинг</h2>
      <div class="link-group">
        <a href="/admin/marketing/dashboard" class="test-link">Дашборд маркетинга</a>
        <a href="/admin/marketing/channels" class="test-link">Каналы</a>
        <a href="/admin/marketing/settings" class="test-link">Настройки</a>
      </div>
      
      <h2>Клиентская система</h2>
      <div class="link-group">
        <a href="/client/auth/login" class="test-link">Вход клиента</a>
        <a href="/client/auth/register" class="test-link">Регистрация клиента</a>
        <a href="/client/analytics" class="test-link">Аналитика</a>
        <a href="/client/chat" class="test-link">Чат</a>
        <a href="/client/dashboard" class="test-link">Дашборд клиента</a>
        <a href="/client/leads" class="test-link">Лиды</a>
        <a href="/client/pricing" class="test-link">Тариф</a>
        <a href="/client/projects" class="test-link">Проекты</a>
        <a href="/client/settings" class="test-link">Настройки</a>
        <a href="/client/settings/channels" class="test-link">Настройки каналов</a>
        <a href="/client/settings/languages" class="test-link">Настройки языков</a>
        <a href="/client/settings/schedule" class="test-link">Настройки расписания</a>
        <a href="/client/settings/widget" class="test-link">Настройки виджета</a>
      </div>
      
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.test-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-page h1 {
  color: #333;
  margin-bottom: 1rem;
}

.test-page p {
  color: #666;
  margin-bottom: 2rem;
}

.test-links h2 {
  color: #4f46e5;
  margin: 2rem 0 1rem 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.link-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.test-link {
  display: block;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.2s ease;
}

.test-link:hover {
  background: #e9ecef;
  border-color: #4f46e5;
  color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>