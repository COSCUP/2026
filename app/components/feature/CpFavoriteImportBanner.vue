<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  count: number
  // Broken link (no matching session): show an error, offer only dismiss.
  invalid?: boolean
}>()

defineEmits<{
  import: []
  dismiss: []
}>()

const { t } = useI18n()
</script>

<template>
  <div
    v-if="invalid"
    aria-live="assertive"
    class="p-4 border border-gray-300 rounded-lg bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    role="alert"
  >
    <div class="flex gap-2 items-start sm:items-center">
      <Icon
        class="text-xl text-gray-500 mt-0.5 shrink-0 sm:mt-0"
        name="tabler:link-off"
      />
      <p class="text-sm text-gray-600">
        {{ t('invalid') }}
      </p>
    </div>
    <div class="flex shrink-0 gap-2">
      <button
        class="text-sm text-gray-600 px-3 py-1.5 border border-gray-300 rounded-md cursor-pointer transition-colors hover:bg-gray-100"
        type="button"
        @click="$emit('dismiss')"
      >
        {{ t('dismiss') }}
      </button>
    </div>
  </div>
  <div
    v-else
    aria-live="polite"
    class="p-4 border border-cp-orange-300 rounded-lg bg-cp-orange-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    role="status"
  >
    <div class="flex gap-2 items-start sm:items-center">
      <Icon
        class="text-xl text-cp-orange-600 mt-0.5 shrink-0 sm:mt-0"
        name="tabler:bookmarks"
      />
      <p class="text-sm text-cp-orange-700">
        {{ t('message', { count }) }}
      </p>
    </div>
    <div class="flex shrink-0 gap-2">
      <button
        class="text-sm text-white font-medium px-3 py-1.5 rounded-md bg-cp-orange-600 cursor-pointer transition-colors hover:bg-cp-orange-700"
        type="button"
        @click="$emit('import')"
      >
        {{ t('import') }}
      </button>
      <button
        class="text-sm text-cp-orange-700 px-3 py-1.5 border border-cp-orange-300 rounded-md cursor-pointer transition-colors hover:bg-cp-orange-100"
        type="button"
        @click="$emit('dismiss')"
      >
        {{ t('dismiss') }}
      </button>
    </div>
  </div>
</template>

<i18n lang="yaml">
  en:
    message: 'Someone shared {count} favorite session(s). Import them? This replaces your current favorites.'
    invalid: 'This share link is invalid — none of its sessions match the current schedule.'
    import: 'Import'
    dismiss: 'Dismiss'
  zh:
    message: '有人分享了 {count} 個收藏議程，要匯入嗎？匯入後會取代你目前的收藏。'
    invalid: '連結無效，因為沒有符合條件的議程。'
    import: '匯入'
    dismiss: '忽略'
</i18n>
