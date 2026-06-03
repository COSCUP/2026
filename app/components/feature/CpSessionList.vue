<script lang="ts" setup>
import type { SessionSummary } from '#shared/types/session'
import { useI18n } from '#imports'
import { useFavorites } from '~/composables/useFavorites'
import CpSessionItem from './CpSessionItem.vue'

const { sessions: _sessions, preview = false } = defineProps<{
  sessions: SessionSummary[]
  // Shared-list preview: render every session as a read-only favorite.
  preview?: boolean
}>()

const { locale, t } = useI18n()
const { isFavorite, toggleFavorite } = useFavorites()

function favoriteLabel(id: string) {
  return (preview || isFavorite(id)) ? t('removeFavorite') : t('addFavorite')
}

const sessions = computed(() => {
  if (!_sessions) {
    return {}
  }

  return Object.groupBy(
    _sessions
      .filter((session) => session.start && session.end && session.room).map((session) => ({
        id: session.id,
        title: session[locale.value].title,
        speakers: session.speakers?.map((s) => s[locale.value].name).join(', '),
        start: session.start!.slice(11, 16),
        end: session.end!.slice(11, 16),
        tags: [],
      })),
    (session) => session.start,
  )
})

const times = computed(() => Object.keys(sessions.value).sort())
</script>

<template>
  <div class="flex flex-col gap-6 w-screen">
    <section
      v-for="time in times"
      :key="time"
    >
      <h3 class="text-lg text-primary-400 font-medium mb-2 py-1 bg-white top-0 sticky z-1">
        {{ time }}
      </h3>
      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="session in sessions[time]"
          :key="session.id"
          :to="`/session/${session.id}`"
        >
          <CpSessionItem
            :end="session.end"
            :favorite="preview || isFavorite(session.id)"
            :favorite-label="favoriteLabel(session.id)"
            :readonly="preview"
            :speaker="session.speakers"
            :start="session.start"
            :tags="session.tags"
            :title="session.title"
            @toggle-favorite="toggleFavorite(session.id)"
          />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<i18n lang="yaml">
  en:
    addFavorite: 'Add to favorites'
    removeFavorite: 'Remove from favorites'
  zh:
    addFavorite: '加入收藏'
    removeFavorite: '取消收藏'
</i18n>
