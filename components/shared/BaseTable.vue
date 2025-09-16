<template>
  <div class="base-table-container">
    <div v-if="title || $slots.actions" class="base-table-header">
      <h3 v-if="title" class="base-table-title">{{ title }}</h3>
      <div v-if="$slots.actions" class="base-table-actions">
        <slot name="actions" />
      </div>
    </div>
    
    <div class="base-table-wrapper">
      <table class="base-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :class="column.class">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="getRowKey(row, index)">
            <td v-for="column in columns" :key="column.key" :class="column.class">
              <slot 
                :name="`cell-${column.key}`" 
                :row="row" 
                :value="getNestedValue(row, column.key)"
                :index="index"
              >
                {{ getNestedValue(row, column.key) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="data.length === 0" class="base-table-empty">
        <slot name="empty">
          <p>Нет данных для отображения</p>
        </slot>
      </div>
    </div>
    
    <div v-if="pagination && totalPages > 1" class="base-table-pagination">
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="btn btn--outline btn--sm"
      >
        ← Назад
      </button>
      
      <span class="pagination-info">
        Страница {{ currentPage }} из {{ totalPages }}
      </span>
      
      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="btn btn--outline btn--sm"
      >
        Вперед →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  label: string
  class?: string
}

interface Props {
  data: any[]
  columns: Column[]
  title?: string
  rowKey?: string | ((row: any) => string | number)
  pagination?: boolean
  pageSize?: number
  currentPage?: number
  totalItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  pagination: false,
  pageSize: 10,
  currentPage: 1,
  totalItems: 0
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const getRowKey = (row: any, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return row[props.rowKey] || index
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const totalPages = computed(() => {
  if (!props.pagination) return 1
  return Math.ceil((props.totalItems || props.data.length) / props.pageSize)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.base-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.base-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 20px;
}

.base-table-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.base-table-actions {
  display: flex;
  gap: 12px;
}

.base-table-wrapper {
  overflow-x: auto;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.base-table th {
  background: #f8f9fa;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.base-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}

.base-table tbody tr:hover {
  background: #f9fafb;
}

.base-table-empty {
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
}

.base-table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .base-table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .base-table-actions {
    justify-content: center;
  }
  
  .base-table-pagination {
    flex-direction: column;
    gap: 12px;
  }
}
</style>