<script lang="ts" setup>
import type { SessionSummary } from '#shared/types/session'
import { useI18n } from '#imports'
import { useFavoriteLabel, useFavorites } from '~/composables/useFavorites'
import CpSessionItem from './CpSessionItem.vue'

const { sessions: _sessions, preview = false } = defineProps<{
  sessions: SessionSummary[]
  // Shared-list preview: render every session as a read-only favorite.
  preview?: boolean
}>()

const { locale } = useI18n()
const localePath = useLocalePath()
const { isFavorite, toggleFavorite } = useFavorites()
const favoriteLabel = useFavoriteLabel()

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
        room: locale.value === 'zh'
          ? (session.room?.['zh-hans'] || session.room?.en || '')
          : (session.room?.en || session.room?.['zh-hans'] || ''),
        tags: [],
      })),
    (session) => session.start,
  )
})

const times = computed(() => Object.keys(sessions.value).sort())
</script>

<template>
  <div class="flex flex-col gap-6 w-[var(--viewport-width,100vw)] isolate">
    <section
      v-for="time in times"
      :key="time"
    >
      <h3 class="text-lg text-primary-400 font-medium mb-2 py-1 bg-white top-0 sticky z-content">
        {{ time }}
      </h3>
      <div class="flex flex-col gap-2">
        <CpSessionItem
          v-for="session in sessions[time]"
          :key="session.id"
          :end="session.end"
          :favorite="preview || isFavorite(session.id)"
          :favorite-label="favoriteLabel(session.id, preview)"
          :readonly="preview"
          :room="session.room"
          :speaker="session.speakers"
          :start="session.start"
          :tags="session.tags"
          :title="session.title"
          :to="localePath(`/session/${session.id}`)"
          @toggle-favorite="toggleFavorite(session.id)"
        />
      </div>
    </section>
  </div>
</template>
