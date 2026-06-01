<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div
    class="p-4 border border-gray-300 rounded-lg bg-gray-50 flex gap-2 items-start justify-center sm:items-center"
  >
    <Icon
      class="text-xl text-gray-500 mt-0.5 shrink-0 sm:mt-0"
      name="tabler:calendar-off"
    />
    <p class="text-sm text-gray-600">
      {{ t('message') }}
    </p>
  </div>
</template>

<i18n lang="yaml">
  en:
    message: 'No sessions match the current filters.'
  zh:
    message: '找不到符合條件的議程。'
</i18n>
