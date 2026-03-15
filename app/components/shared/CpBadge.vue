<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <span class="text-xs text-primary-600 font-semibold px-2 py-0.5 text-center rounded-full bg-primary-100 inline-block">
    <slot v-if="$slots.default" />
    <template v-else>
      {{ text }}
    </template>
  </span>
</template>
