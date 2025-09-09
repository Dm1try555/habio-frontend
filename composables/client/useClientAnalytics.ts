import { ref, computed } from 'vue'

export interface AnalyticsMetric {
  name: string
  value: number
  change: number
  change_type: 'increase' | 'decrease' | 'neutral'
  period: string
}

export interface ChannelAnalytics {
  channel: string
  clicks: number
  conversions: number
  conversion_rate: number
  revenue?: number
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface UserBehavior {
  page_views: number
  session_duration: number
  bounce_rate: number
  return_visitors: number
  new_visitors: number
}

export interface LeadAnalytics {
  total_leads: number
  leads_by_channel: ChannelAnalytics[]
  leads_by_date: TimeSeriesData[]
  conversion_funnel: {
    stage: string
    count: number
    percentage: number
  }[]
}

export const useClientAnalytics = () => {
  const { $api } = useNuxtApp()
  const { isPremium } = useSubscription()
  
  const metrics = ref<AnalyticsMetric[]>([])
  const channelAnalytics = ref<ChannelAnalytics[]>([])
  const leadAnalytics = ref<LeadAnalytics | null>(null)
  const userBehavior = ref<UserBehavior | null>(null)
  const timeSeriesData = ref<TimeSeriesData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const dateRange = ref({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  const canViewAdvancedAnalytics = computed(() => isPremium.value)

  const loadOverviewMetrics = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.get('client/analytics/overview/', {
        params: {
          start_date: dateRange.value.start,
          end_date: dateRange.value.end
        }
      })
      
      metrics.value = response.data.metrics
      channelAnalytics.value = response.data.channel_analytics
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load overview metrics'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadLeadAnalytics = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.get('client/analytics/leads/', {
        params: {
          start_date: dateRange.value.start,
          end_date: dateRange.value.end
        }
      })
      
      leadAnalytics.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load lead analytics'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadUserBehavior = async () => {
    if (!canViewAdvancedAnalytics.value) {
      throw new Error('Advanced analytics are only available for premium users')
    }

    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.get('client/analytics/user-behavior/', {
        params: {
          start_date: dateRange.value.start,
          end_date: dateRange.value.end
        }
      })
      
      userBehavior.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load user behavior'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadTimeSeriesData = async (metric: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.get(`client/analytics/time-series/${metric}/`, {
        params: {
          start_date: dateRange.value.start,
          end_date: dateRange.value.end
        }
      })
      
      timeSeriesData.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load time series data'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const exportAnalytics = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      const response = await $api.get('client/analytics/export/', {
        params: {
          format,
          start_date: dateRange.value.start,
          end_date: dateRange.value.end
        },
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `analytics_${dateRange.value.start}_to_${dateRange.value.end}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to export analytics'
      throw err
    }
  }

  const setDateRange = (start: string, end: string) => {
    dateRange.value = { start, end }
  }

  const getChannelPerformance = computed(() => {
    return channelAnalytics.value.sort((a, b) => b.clicks - a.clicks)
  })

  const getTopPerformingChannel = computed(() => {
    return channelAnalytics.value.reduce((top, current) => 
      current.conversion_rate > top.conversion_rate ? current : top, 
      channelAnalytics.value[0] || { channel: 'N/A', conversion_rate: 0 }
    )
  })

  const getTotalClicks = computed(() => {
    return channelAnalytics.value.reduce((total, channel) => total + channel.clicks, 0)
  })

  const getTotalConversions = computed(() => {
    return channelAnalytics.value.reduce((total, channel) => total + channel.conversions, 0)
  })

  const getOverallConversionRate = computed(() => {
    const totalClicks = getTotalClicks.value
    const totalConversions = getTotalConversions.value
    return totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
  })

  const refreshAllData = async () => {
    await Promise.all([
      loadOverviewMetrics(),
      loadLeadAnalytics(),
      canViewAdvancedAnalytics.value ? loadUserBehavior() : Promise.resolve()
    ])
  }

  return {
    metrics,
    channelAnalytics,
    leadAnalytics,
    userBehavior,
    timeSeriesData,
    dateRange,
    isLoading,
    error,
    canViewAdvancedAnalytics,
    loadOverviewMetrics,
    loadLeadAnalytics,
    loadUserBehavior,
    loadTimeSeriesData,
    exportAnalytics,
    setDateRange,
    getChannelPerformance,
    getTopPerformingChannel,
    getTotalClicks,
    getTotalConversions,
    getOverallConversionRate,
    refreshAllData
  }
}