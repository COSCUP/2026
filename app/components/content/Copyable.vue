<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

defineProps<{
  text: string
}>()

const { copy, copied, isSupported } = useClipboard()
</script>

<template>
  {{ text }}

  <button
    v-if="isSupported"
    @click="copy(text)"
  >
    <Icon
      v-if="copied"
      name="tabler:copy-check"
    />
    <Icon
      v-else
      name="tabler:copy"
    />
  </button>
</template>
