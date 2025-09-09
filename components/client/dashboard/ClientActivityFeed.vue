<template>
  <div class="activity-feed">
    <div v-if="!activities || activities.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p>Нет активности</p>
    </div>
    
    <div v-else class="activities-list">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="activity-item"
      >
        <div class="activity-icon" :class="getActivityTypeClass(activity.type)">
          {{ getActivityIcon(activity.type) }}
        </div>
        
        <div class="activity-content">
          <div class="activity-text">
            {{ getActivityText(activity) }}
          </div>
          <div class="activity-time">
            {{ activity.time }}
          </div>
        </div>
        
        <div class="activity-status" :class="getActivityStatusClass(activity.type)">
          {{ getActivityStatus(activity.type) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Activity {
  id: number
  type: 'click' | 'lead' | 'conversion' | 'error'
  channel?: string
  message?: string
  time: string
}

interface Props {
  activities: Activity[]
}

defineProps<Props>()

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'click': '👆',
    'lead': '📝',
    'conversion': '✅',
    'error': '❌'
  }
  return icons[type] || '📄'
}

const getActivityTypeClass = (type: string): string => {
  return `activity-type-${type}`
}

const getActivityStatusClass = (type: string): string => {
  return `status-${type}`
}

const getActivityText = (activity: Activity): string => {
  switch (activity.type) {
    case 'click':
      return `Клик по ${activity.channel}`
    case 'lead':
      return activity.message || 'Новая заявка'
    case 'conversion':
      return `Конверсия через ${activity.channel}`
    case 'error':
      return 'Ошибка в системе'
    default:
      return 'Неизвестная активность'
  }
}

const getActivityStatus = (type: string): string => {
  const statuses: Record<string, string> = {
    'click': 'Клик',
    'lead': 'Заявка',
    'conversion': 'Конверсия',
    'error': 'Ошибка'
  }
  return statuses[type] || 'Активность'
}
</script>

<style scoped>
.activity-feed {
  height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.2s;
}

.activity-item:hover {
  background: #f0f4ff;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.activity-type-click {
  background: #e3f2fd;
  color: #1976d2;
}

.activity-type-lead {
  background: #f3e5f5;
  color: #7b1fa2;
}

.activity-type-conversion {
  background: #e8f5e8;
  color: #388e3c;
}

.activity-type-error {
  background: #ffebee;
  color: #d32f2f;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
}

.activity-time {
  font-size: 12px;
  color: #666;
}

.activity-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.status-click {
  background: #e3f2fd;
  color: #1976d2;
}

.status-lead {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-conversion {
  background: #e8f5e8;
  color: #388e3c;
}

.status-error {
  background: #ffebee;
  color: #d32f2f;
}

@media (max-width: 768px) {
  .activity-item {
    padding: 10px;
    gap: 10px;
  }
  
  .activity-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .activity-text {
    font-size: 13px;
  }
  
  .activity-time {
    font-size: 11px;
  }
  
  .activity-status {
    font-size: 10px;
    padding: 3px 6px;
  }
}
</style>