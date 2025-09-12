<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <NuxtLink to="/client/dashboard" class="logo">
          <span class="logo-icon">🎯</span>
          <span class="logo-text">HabioChat</span>
        </NuxtLink>
        
        <nav class="main-nav">
          <NuxtLink to="/client/dashboard" class="nav-link" :class="{ active: $route.path === '/client/dashboard' }">
            Дашборд
          </NuxtLink>
          <NuxtLink to="/client/analytics" class="nav-link" :class="{ active: $route.path.startsWith('/client/analytics') }">
            Аналитика
          </NuxtLink>
          <NuxtLink to="/client/settings" class="nav-link" :class="{ active: $route.path.startsWith('/client/settings') }">
            Настройки
          </NuxtLink>
        </nav>
      </div>
      
      <div class="header-right">
        <div class="user-menu">
          <div class="user-info">
            <span class="user-name">{{ user?.first_name || 'Пользователь' }}</span>
            <span class="user-plan">{{ subscriptionType === 'free' ? 'Бесплатно' : 'Премиум' }}</span>
          </div>
          
          <div class="user-avatar" @click="toggleUserMenu">
            <span>{{ userInitials }}</span>
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="dropdown-item" @click="navigateTo('/client/profile')">
                <span class="dropdown-icon">👤</span>
                Профиль
              </div>
              <div class="dropdown-item" @click="navigateTo('/client/subscription')">
                <span class="dropdown-icon">💳</span>
                Подписка
              </div>
              <div class="dropdown-item" @click="navigateTo('/client/settings')">
                <span class="dropdown-icon">⚙️</span>
                Настройки
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout" @click="handleLogout">
                <span class="dropdown-icon">🚪</span>
                Выйти
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useClientAuth } from '~/composables/client/useClientAuth'
import { useSubscription } from '~/composables/useSubscription'

const { user, logout } = useClientAuth()
const { currentPlan } = useSubscription()

const showUserMenu = ref(false)

const subscriptionType = computed(() => currentPlan.value?.type || 'free')

const userInitials = computed(() => {
  if (!user.value?.first_name) return 'U'
  return user.value.first_name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  await logout()
  await navigateTo('/client/auth/login')
}

// Close menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e1e5e9;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 20px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  color: #667eea;
}

.main-nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #1a1a1a;
  background: #f8f9fa;
}

.nav-link.active {
  color: #667eea;
  background: #f0f4ff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.user-name {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 14px;
}

.user-plan {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.user-avatar:hover {
  background: #5a6fd8;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: 8px 0;
  margin-top: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  color: #333;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.logout {
  color: #dc3545;
}

.dropdown-item.logout:hover {
  background: #fee;
}

.dropdown-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background: #e1e5e9;
  margin: 8px 0;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .header-left {
    gap: 16px;
  }
  
  .main-nav {
    display: none;
  }
  
  .user-info {
    display: none;
  }
}
</style>