<script setup lang="ts">
import type { TrackSummary } from '#shared/types/session'
import { useI18n } from 'vue-i18n'

// 內部檢查用的議程軌索引頁，方便逐一檢視各議程軌詳細頁。
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data } = await useFetch<TrackSummary[]>('/api/track')

const localeKey = computed(() => (locale.value === 'zh' ? 'zh-hant' : 'en'))

function trackName(track: TrackSummary) {
  return track.name[localeKey.value] || track.name.en || `#${track.id}`
}

useSeoMeta({
  title: () => t('title'),
})
</script>

<template>
  <div class="mx-auto flex flex-col gap-6 max-w-3xl">
    <h1 class="text-3xl text-primary-700 font-bold">
      {{ t('title') }}
    </h1>

    <ul class="flex flex-col gap-2">
      <li
        v-for="track in data ?? []"
        :key="track.id"
      >
        <NuxtLink
          class="px-4 py-3 border border-gray-200 rounded-xl flex gap-3 transition-colors items-center justify-between hover:border-primary-400 hover:bg-primary-50"
          :to="localePath(`/track/${track.id}`)"
        >
          <span class="text-gray-800 font-medium">{{ trackName(track) }}</span>
          <span class="text-sm text-gray-500 whitespace-nowrap">{{ t('count', { count: track.count }) }}</span>
        </NuxtLink>
      </li>
    </ul>

    <p
      v-if="!data?.length"
      class="text-gray-400 py-8 text-center"
    >
      {{ t('empty') }}
    </p>
  </div>
</template>

<i18n lang="yaml">
  en:
    title: 'Tracks'
    count: '{count} sessions'
    empty: 'No tracks yet.'
  zh:
    title: '議程軌'
    count: '{count} 場議程'
    empty: '尚無議程軌。'
</i18n>
