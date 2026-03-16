<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { computed, resolveComponent } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'basic' | 'primary' | 'secondary'
  size?: 'sm' | 'base' | 'lg' | 'xl'
  disabled?: boolean
  to?: RouteLocationRaw
  icon?: string
}>(), {
  variant: 'basic',
  size: 'base',
  disabled: false,
  to: undefined,
})

const componentType = computed(() => props.to ? resolveComponent('NuxtLink') : 'button')

const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const sizeStyles = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-3 py-1.5 text-sm'
    case 'base': return 'px-4 py-2 text-base'
    case 'lg': return 'px-6 py-3 text-lg'
    case 'xl': return 'px-8 py-4 text-xl'
    default: return 'px-4 py-2 text-base'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'p-1.5'
    case 'base': return 'p-2'
    case 'lg': return 'p-3'
    case 'xl': return 'p-4'
    default: return ''
  }
})

const variantStyles = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-primary-400 text-white hover:bg-primary-500 active:bg-primary-600'
    case 'secondary': return 'border border-primary-300 text-primary-400 bg-white hover:bg-primary-50 active:bg-primary-100'
    case 'basic': return 'text-gray-500 hover:text-primary-600 hover:bg-gray-100 active:bg-primary-50 active:text-primary-600'
    default: return ''
  }
})

const disabledStyles = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-primary-200 text-white'
    case 'secondary': return 'border border-primary-200 text-primary-200 bg-white'
    case 'basic': return 'text-gray-300'
    default: return ''
  }
})
</script>

<template>
  <component
    :is="componentType"
    :class="[baseStyles, variantStyles, disabled && disabledStyles, icon ? iconSize : sizeStyles]"
    :disabled="disabled"
    :to="to"
  >
    <Icon
      v-if="icon"
      :name="icon"
    />
    <slot v-else />
  </component>
</template>
