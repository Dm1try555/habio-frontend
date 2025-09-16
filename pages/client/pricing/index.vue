<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Тарифы</h1>
      <p>Выберите подходящий тариф для вашего бизнеса</p>
    </div>

    <div class="page-content">
      <!-- Current Plan -->
      <div class="current-plan" v-if="currentPlan">
        <div class="plan-card plan-card--current">
          <div class="plan-header">
            <h3>{{ currentPlan.name }}</h3>
            <span class="plan-status status-indicator status-indicator--online">
              Активный
            </span>
          </div>
          <div class="plan-price">
            <span class="price-amount">${{ currentPlan.price }}</span>
            <span class="price-period">/месяц</span>
          </div>
          <div class="plan-features">
            <div v-for="feature in currentPlan.features" :key="feature" class="feature-item">
              <span class="feature-icon">✓</span>
              <span>{{ feature }}</span>
            </div>
          </div>
          <div class="plan-actions">
            <button class="base-button base-button--outline" @click="cancelPlan">
              Отменить подписку
            </button>
          </div>
        </div>
      </div>

      <!-- Available Plans -->
      <div class="pricing-grid">
        <div 
          v-for="plan in availablePlans" 
          :key="plan.id"
          class="plan-card"
          :class="{ 
            'plan-card--featured': plan.featured,
            'plan-card--current': plan.id === currentPlan?.id 
          }"
        >
          <div v-if="plan.featured" class="plan-badge">Рекомендуемый</div>
          
          <div class="plan-header">
            <h3>{{ plan.name }}</h3>
            <p class="plan-description">{{ plan.description }}</p>
          </div>
          
          <div class="plan-price">
            <span class="price-amount">${{ plan.price }}</span>
            <span class="price-period">/месяц</span>
          </div>
          
          <div class="plan-features">
            <div v-for="feature in plan.features" :key="feature" class="feature-item">
              <span class="feature-icon">✓</span>
              <span>{{ feature }}</span>
            </div>
          </div>
          
          <div class="plan-actions">
            <button 
              v-if="plan.id === currentPlan?.id"
              class="base-button base-button--outline"
              disabled
            >
              Текущий план
            </button>
            <button 
              v-else
              class="base-button base-button--primary"
              :class="{ 'base-button--large': plan.featured }"
              @click="selectPlan(plan)"
            >
              {{ plan.price === 0 ? 'Начать бесплатно' : 'Выбрать план' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <div v-if="showPaymentModal" class="base-modal-overlay" @click="closePaymentModal">
        <div class="base-modal base-modal--large" @click.stop>
          <div class="modal-header">
            <h3>Оформление подписки</h3>
            <button @click="closePaymentModal" class="close-button">×</button>
          </div>
          
          <div class="payment-content">
            <div class="selected-plan">
              <h4>{{ selectedPlan?.name }}</h4>
              <div class="plan-summary">
                <div class="summary-item">
                  <span>Тариф:</span>
                  <span>${{ selectedPlan?.price }}/месяц</span>
                </div>
                <div class="summary-item">
                  <span>Период:</span>
                  <span>Ежемесячно</span>
                </div>
                <div class="summary-item total">
                  <span>Итого:</span>
                  <span>${{ selectedPlan?.price }}/месяц</span>
                </div>
              </div>
            </div>
            
            <div class="payment-methods">
              <h4>Способ оплаты</h4>
              <div class="payment-options">
                <label class="payment-option">
                  <input type="radio" v-model="paymentMethod" value="card" />
                  <span class="option-content">
                    <span class="option-icon">💳</span>
                    <span>Банковская карта</span>
                  </span>
                </label>
                <label class="payment-option">
                  <input type="radio" v-model="paymentMethod" value="paypal" />
                  <span class="option-content">
                    <span class="option-icon">🅿️</span>
                    <span>PayPal</span>
                  </span>
                </label>
              </div>
            </div>
            
            <div class="payment-form" v-if="paymentMethod === 'card'">
              <div class="form-row">
                <div class="form-group">
                  <label>Номер карты</label>
                  <input type="text" class="base-input" placeholder="1234 5678 9012 3456" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Срок действия</label>
                  <input type="text" class="base-input" placeholder="MM/YY" />
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input type="text" class="base-input" placeholder="123" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Имя на карте</label>
                  <input type="text" class="base-input" placeholder="Иван Петров" />
                </div>
              </div>
            </div>
            
            <div class="payment-actions">
              <button @click="closePaymentModal" class="base-button base-button--outline">
                Отмена
              </button>
              <button @click="processPayment" class="base-button base-button--primary">
                Оплатить ${{ selectedPlan?.price }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const showPaymentModal = ref(false)
const selectedPlan = ref<any | null>(null)
const paymentMethod = ref<'card' | 'paypal'>('card')

const availablePlans = ref([
  { id: 'free', name: 'Free', description: 'Базовые возможности', price: 0, featured: false, features: ['1 проект', '1 язык', 'Базовая аналитика'] },
  { id: 'pro', name: 'Pro', description: 'Расширенные возможности', price: 19, featured: true, features: ['Неограниченные проекты', 'Много языков', 'Расширенная аналитика'] },
])

const currentPlan = ref<any | null>(null)

onMounted(() => {
  if (typeof window !== 'undefined') {
    const userRaw = localStorage.getItem('client_user')
    if (userRaw) {
      const user = JSON.parse(userRaw)
      const plan = user.plan || 'free'
      currentPlan.value = availablePlans.value.find(p => p.id === plan) || availablePlans.value[0]
    }
  }
})

const openPaymentModal = (plan: any) => {
  selectedPlan.value = plan
  showPaymentModal.value = plan.price > 0
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedPlan.value = null
}

const persistUserPlan = (planId: 'free' | 'pro') => {
  if (typeof window === 'undefined') return
  const userRaw = localStorage.getItem('client_user')
  if (!userRaw) return
  const user = JSON.parse(userRaw)
  user.plan = planId
  localStorage.setItem('client_user', JSON.stringify(user))
}

const selectPlan = async (plan: any) => {
  if (plan.price > 0) {
    openPaymentModal(plan)
    return
  }
  try {
    await $api.put('/auth/plan/', { plan: plan.id })
    currentPlan.value = plan
    persistUserPlan(plan.id)
  } catch (e) {
    // noop simple UI
  }
}

const processPayment = async () => {
  if (!selectedPlan.value) return
  try {
    // simulate payment success and update plan immediately
    await $api.put('/auth/plan/', { plan: selectedPlan.value.id })
    currentPlan.value = selectedPlan.value
    persistUserPlan(selectedPlan.value.id)
    closePaymentModal()
  } catch (e) {
    // noop simple UI
  }
}

const cancelPlan = async () => {
  try {
    await $api.put('/auth/plan/', { plan: 'free' })
    const freePlan = availablePlans.value.find(p => p.id === 'free')
    if (freePlan) currentPlan.value = freePlan
    persistUserPlan('free')
  } catch (e) {
    // noop
  }
}
</script>


<style scoped>
.current-plan {
  margin-bottom: 40px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.plan-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.plan-card--featured {
  border-color: #007bff;
  transform: scale(1.05);
}

.plan-card--current {
  border-color: #28a745;
  background: #f8fff9;
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #007bff;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.plan-header {
  margin-bottom: 24px;
}

.plan-header h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
  font-weight: 700;
}

.plan-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.plan-price {
  margin-bottom: 32px;
}

.price-amount {
  font-size: 48px;
  font-weight: 700;
  color: #333;
}

.price-period {
  font-size: 16px;
  color: #666;
  margin-left: 4px;
}

.plan-features {
  margin-bottom: 32px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
}

.feature-icon {
  color: #28a745;
  font-weight: 600;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.plan-actions {
  margin-top: auto;
}

.plan-actions .base-button {
  width: 100%;
}

.payment-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.selected-plan {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 8px;
}

.selected-plan h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.plan-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-item.total {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  border-bottom: 2px solid #007bff;
}

.payment-methods h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-option:hover {
  border-color: #007bff;
}

.payment-option input[type="radio"] {
  margin: 0;
}

.payment-option input[type="radio"]:checked + .option-content {
  color: #007bff;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.option-icon {
  font-size: 20px;
}

.payment-form {
  margin-top: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row:first-child {
  grid-template-columns: 1fr;
}

.payment-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .plan-card--featured {
    transform: none;
  }
  
  .payment-content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .payment-actions {
    flex-direction: column;
  }
}
</style>