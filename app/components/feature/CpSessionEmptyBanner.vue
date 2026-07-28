<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { variant = 'filter' } = defineProps<{
  variant?: 'filter' | 'favorite' | 'shared'
}>()

const { t } = useI18n()

const icon = computed(() => variant === 'favorite' ? 'tabler:bookmark-off' : 'tabler:calendar-off')
</script>

<template>
  <div
    class="p-4 border border-gray-300 rounded-lg bg-gray-50 flex gap-2 items-start justify-center sm:items-center"
  >
    <Icon
      class="text-xl text-gray-500 mt-0.5 shrink-0 sm:mt-0"
      :name="icon"
    />
    <p class="text-sm text-gray-600">
      {{ t(variant) }}
    </p>
  </div>
</template>

<i18n lang="yaml">
  en:
    filter: 'No sessions match the current filters.'
    favorite: 'No favorited sessions yet. Tap the bookmark on a session to add it here.'
    shared: 'No shared sessions on this day. Try another day.'
  zh:
    filter: '找不到符合條件的議程。'
    favorite: '尚未收藏任何議程，點擊議程上的書籤即可加入收藏。'
    shared: '這天沒有分享的議程，換一天看看。'
</i18n>
