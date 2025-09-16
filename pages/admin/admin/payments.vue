<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Платежи</h1>
      <p>Управление подписками и платежами клиентов</p>
    </div>

    <div class="page-content">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Сводка</div>
        </div>
        <div class="card-body grid grid-3">
          <div class="stat">
            <div class="stat-label">MRR</div>
            <div class="stat-value">$0</div>
          </div>
          <div class="stat">
            <div class="stat-label">Активные Pro</div>
            <div class="stat-value">0</div>
          </div>
          <div class="stat">
            <div class="stat-label">Отмены (30д)</div>
            <div class="stat-value">0</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Подписки</div>
          <div class="card-actions">
            <button class="base-button base-button--primary" @click="refresh">Обновить</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>План</th>
                <th>Статус</th>
                <th>Обновлен</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id">
                <td>{{ row.email }}</td>
                <td>
                  <select v-model="row.plan" class="base-input" @change="updatePlan(row)">
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                  </select>
                </td>
                <td>
                  <span class="badge" :class="{ 'badge--success': row.plan==='pro', 'badge--secondary': row.plan==='free' }">
                    {{ row.plan==='pro' ? 'Оплачен' : 'Бесплатный' }}
                  </span>
                </td>
                <td>{{ new Date(row.updated_at || Date.now()).toLocaleDateString() }}</td>
                <td class="text-right">
                  <button class="base-button base-button--outline" @click="impersonate(row)">Имперсон.</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/admin/useAdminAuth'
const { $api } = useNuxtApp()
const { user, isAdmin } = useAuth()

onMounted(() => {
  if (!isAdmin.value) navigateTo('/admin/marketing/dashboard')
  load()
})

const rows = ref<any[]>([])
const isLoading = ref(false)

const load = async () => {
  try {
    isLoading.value = true
    const { data } = await $api.get('/users/')
    rows.value = (data || []).map((u: any) => ({ id: u.id, email: u.email, plan: u.plan || 'free', updated_at: u.updated_at }))
  } catch (e) {
    rows.value = []
  } finally {
    isLoading.value = false
  }
}

const refresh = () => load()

const updatePlan = async (row: any) => {
  try {
    await $api.put(`/users/${row.id}/`, { plan: row.plan })
  } catch (e) {
    await load()
  }
}

const impersonate = (row: any) => {
  // future: open in client area as this user
}
</script>

<style scoped>
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px; }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
.card-title { font-weight: 700; }
.card-body { padding: 16px 20px; }
.grid { display: grid; gap: 16px; }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.stat { background: var(--color-primary-light); padding: 16px; border-radius: 8px; }
.stat-label { color: #6b7280; font-size: 12px; margin-bottom: 6px; }
.stat-value { font-weight: 700; font-size: 20px; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: left; }
.table-responsive { width: 100%; overflow-x: auto; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; }
.badge--success { background: #dcfce7; color: #166534; }
.badge--secondary { background: #e5e7eb; color: #374151; }
.text-right { text-align: right; }
@media (max-width: 768px) { .grid-3 { grid-template-columns: 1fr; } }
</style>