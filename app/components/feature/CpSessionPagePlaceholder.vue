<script setup lang="ts">
import CpSessionDaySelectorPlaceholder from './CpSessionDaySelectorPlaceholder.vue'
import CpSessionPlaceholder from './CpSessionPlaceholder.vue'
</script>

<template>
  <div class="flex flex-col-reverse sm:flex-col">
    <CpSessionDaySelectorPlaceholder class="w-screen" />
    <CpSessionPlaceholder class="w-[var(--viewport-width,100vw)]" />
  </div>
</template>
