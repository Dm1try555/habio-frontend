import { ref, computed } from 'vue'

export interface SubscriptionPlan {
  id: string
  name: string
  type: 'free' | 'premium'
  price: number
  currency: string
  features: string[]
  limits: {
    max_projects: number
    max_languages: number
    max_themes: number
    custom_styles: boolean
    analytics_retention_days: number
    user_tracking: boolean
  }
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'stripe'
  last_four: string
  brand: string
  expiry_month: number
  expiry_year: number
}

export const useSubscription = () => {
  const { $api } = useNuxtApp()
  
  const currentPlan = ref<SubscriptionPlan | null>(null)
  const paymentMethods = ref<PaymentMethod[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isFree = computed(() => currentPlan.value?.type === 'free')
  const isPremium = computed(() => currentPlan.value?.type === 'premium')
  const canUpgrade = computed(() => isFree.value)

  const loadSubscription = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.get('client/subscription/')
      currentPlan.value = response.data.plan
      paymentMethods.value = response.data.payment_methods || []
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load subscription'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const upgradeToPremium = async (paymentMethodId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.post('client/subscription/upgrade/', {
        payment_method_id: paymentMethodId
      })
      
      currentPlan.value = response.data.plan
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to upgrade subscription'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const cancelSubscription = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      await $api.post('client/subscription/cancel/')
      
      // Reload subscription to get updated plan
      await loadSubscription()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to cancel subscription'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addPaymentMethod = async (paymentData: any) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $api.post('client/payment-methods/', paymentData)
      paymentMethods.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to add payment method'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removePaymentMethod = async (paymentMethodId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await $api.delete(`client/payment-methods/${paymentMethodId}/`)
      paymentMethods.value = paymentMethods.value.filter(pm => pm.id !== paymentMethodId)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to remove payment method'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getAvailablePlans = async () => {
    try {
      const response = await $api.get('client/subscription/plans/')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to load plans'
      throw err
    }
  }

  // Client plan checking from localStorage
  const getClientPlan = () => {
    if (typeof window === 'undefined') return 'free'
    const userRaw = localStorage.getItem('client_user')
    if (!userRaw) return 'free'
    try {
      const user = JSON.parse(userRaw)
      return user.plan || 'free'
    } catch {
      return 'free'
    }
  }

  const isClientFree = computed(() => getClientPlan() === 'free')
  const isClientPro = computed(() => getClientPlan() === 'pro')

  const canAccessFeature = (feature: 'languages' | 'advanced_analytics' | 'unlimited_projects') => {
    const plan = getClientPlan()
    if (feature === 'languages') return plan === 'pro'
    if (feature === 'advanced_analytics') return plan === 'pro'
    if (feature === 'unlimited_projects') return plan === 'pro'
    return true
  }

  return {
    currentPlan,
    paymentMethods,
    isLoading,
    error,
    isFree,
    isPremium,
    canUpgrade,
    loadSubscription,
    upgradeToPremium,
    cancelSubscription,
    addPaymentMethod,
    removePaymentMethod,
    getAvailablePlans,
    getClientPlan,
    isClientFree,
    isClientPro,
    canAccessFeature
  }
}