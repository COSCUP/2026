<script setup lang="ts">
import type { NuxtError } from '#app'
import CpNotFound from '~/components/shared/CpNotFound.vue'

defineProps({
  error: Object as () => NuxtError,
})
</script>

<template>
  <CpNotFound v-if="error?.status === 404" />
</template>
