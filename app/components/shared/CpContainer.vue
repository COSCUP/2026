<script setup lang="ts">
withDefaults(defineProps<{
  is?: string | Component
}>(), {
  is: 'div',
})
</script>

<template>
  <component
    :is="is"
    class="p-6 rounded-lg flex flex-col gap-6"
  >
    <slot />
  </component>
</template>
