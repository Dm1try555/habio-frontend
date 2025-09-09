<template>
  <div :class="cardClasses" v-bind="$attrs">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
    </div>
    
    <div class="card-body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'bordered' | 'elevated' | 'flat'
  size?: 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  hover: false,
  clickable: false
})

const cardClasses = computed(() => {
  const classes = ['card']
  
  // Variant
  classes.push(`card-${props.variant}`)
  
  // Size
  if (props.size !== 'md') {
    classes.push(`card-${props.size}`)
  }
  
  // Interactive states
  if (props.hover) {
    classes.push('card-hover')
  }
  
  if (props.clickable) {
    classes.push('card-clickable')
  }
  
  return classes
})
</script>

<style scoped>
.card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.card-default {
  box-shadow: var(--shadow-sm);
}

.card-bordered {
  border: 1px solid var(--color-gray-200);
  box-shadow: none;
}

.card-elevated {
  box-shadow: var(--shadow-lg);
}

.card-flat {
  box-shadow: none;
  background: var(--color-gray-50);
}

.card-sm {
  border-radius: var(--radius-md);
}

.card-lg {
  border-radius: var(--radius-xl);
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.card-clickable:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.card-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0 0 0.5rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--color-gray-200);
  margin-top: 1rem;
  padding-top: 1rem;
}

/* Size variants */
.card-sm .card-header,
.card-sm .card-body,
.card-sm .card-footer {
  padding-left: 1rem;
  padding-right: 1rem;
}

.card-sm .card-header {
  padding-top: 1rem;
}

.card-sm .card-footer {
  padding-bottom: 1rem;
}

.card-lg .card-header,
.card-lg .card-body,
.card-lg .card-footer {
  padding-left: 2rem;
  padding-right: 2rem;
}

.card-lg .card-header {
  padding-top: 2rem;
}

.card-lg .card-footer {
  padding-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .card-header,
  .card-body,
  .card-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .card-header {
    padding-top: 1rem;
  }
  
  .card-footer {
    padding-bottom: 1rem;
  }
}
</style>