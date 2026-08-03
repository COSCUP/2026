<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <aside class="text-sm text-cp-accent my-4 px-4 py-3 border-l-4 border-cp-accent rounded bg-cp-accent/8">
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
