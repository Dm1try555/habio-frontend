<template>
  <div class="channel-chart">
    <div v-if="!data || data.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <p>Нет данных для отображения</p>
    </div>
    
    <div v-else class="chart-container">
      <div class="chart-bars">
        <div
          v-for="(channel, index) in sortedChannels"
          :key="channel.channel"
          class="chart-bar"
        >
          <div class="bar-label">
            <span class="channel-name">{{ getChannelName(channel.channel) }}</span>
            <span class="channel-value">{{ channel.clicks }}</span>
          </div>
          <div class="bar-container">
            <div
              class="bar-fill"
              :style="{
                width: `${getBarWidth(channel.clicks)}%`,
                backgroundColor: getChannelColor(index)
              }"
            ></div>
          </div>
          <div class="bar-stats">
            <span class="conversion-rate">{{ channel.conversion_rate }}%</span>
            <span class="conversions">{{ channel.conversions }} конверсий</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data: Array<{
    channel: string
    clicks: number
    conversions: number
    conversion_rate: number
  }>
}

const props = defineProps<Props>()

const channelNames: Record<string, string> = {
  'call': 'Звонок',
  'callback': 'Обратный звонок',
  'telegram': 'Telegram',
  'whatsapp': 'WhatsApp',
  'chat': 'Чат',
  'form': 'Форма'
}

const channelColors = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#f5576c',
  '#4facfe',
  '#00f2fe'
]

const sortedChannels = computed(() => {
  return [...props.data].sort((a, b) => b.clicks - a.clicks)
})

const maxClicks = computed(() => {
  return Math.max(...props.data.map(channel => channel.clicks), 1)
})

const getChannelName = (channel: string): string => {
  return channelNames[channel] || channel
}

const getChannelColor = (index: number): string => {
  return channelColors[index % channelColors.length] || '#667eea'
}

const getBarWidth = (clicks: number): number => {
  return (clicks / maxClicks.value) * 100
}
</script>

<style scoped>
.channel-chart {
  height: 300px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

.chart-container {
  height: 100%;
  padding: 20px 0;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.channel-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.channel-value {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
}

.bar-container {
  height: 24px;
  background: #f0f4ff;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
  position: relative;
}

.bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.bar-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.conversion-rate {
  font-weight: 600;
  color: #667eea;
}

.conversions {
  color: #999;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 16px 0;
  }
  
  .chart-bars {
    gap: 12px;
  }
  
  .bar-container {
    height: 20px;
  }
  
  .channel-name,
  .channel-value {
    font-size: 13px;
  }
}
</style>