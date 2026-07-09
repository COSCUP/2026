<script setup lang="ts">
const { type = 'info', title } = defineProps<{
  type?: 'tip' | 'info' | 'warning' | 'danger'
  title?: string
}>()

const variantClasses: Record<string, string> = {
  tip: 'text-green-900 border-cp-green bg-green-50',
  info: 'text-primary-800 border-primary-400 bg-primary-50',
  warning: 'text-yellow-950 border-yellow-500 bg-yellow-50',
  danger: 'text-red-950 border-red-500 bg-red-50',
}
</script>

<template>
  <aside :class="['text-sm my-4 px-4 py-3 border-l-4 rounded', variantClasses[type]]">
    <p
      v-if="title"
      class="font-bold my-0"
    >
      {{ title }}
    </p>
    <div class="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
      <slot />
    </div>
  </aside>
</template>
