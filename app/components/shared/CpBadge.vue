<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <span class="text-xs text-cp-accent font-semibold px-2 py-0.5 text-center rounded-full bg-cp-accent/12 inline-block">
    <slot v-if="$slots.default" />
    <template v-else>
      {{ text }}
    </template>
  </span>
</template>
