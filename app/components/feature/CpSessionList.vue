<script lang="ts" setup>
import type { SessionSummary, SessionTrack } from '#shared/types/session'
import { useI18n } from '#imports'
import { useFavoriteLabel, useFavorites } from '~/composables/useFavorites'
import { DEFAULT_TRACK_COLOR, trackKey } from '~/utils/tracks'
import CpSessionItem from './CpSessionItem.vue'

const { sessions: _sessions, trackColors, preview = false } = defineProps<{
  sessions: SessionSummary[]
  trackColors: Map<string, string>
  // Shared-list preview: render every session as a read-only favorite.
  preview?: boolean
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { isFavorite, toggleFavorite } = useFavorites()
const favoriteLabel = useFavoriteLabel(t)

function localeName(name?: SessionTrack['name']) {
  const { en = '', 'zh-hant': zh = '' } = name ?? {}
  return locale.value === 'zh' ? zh || en : en || zh
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
        room: locale.value === 'zh'
          ? (session.room?.['zh-hant'] || session.room?.en || '')
          : (session.room?.en || session.room?.['zh-hant'] || ''),
        tags: session.tags,
        track: {
          id: session.track?.id,
          name: localeName(session.track?.name),
          color: trackColors.get(trackKey(session)) ?? DEFAULT_TRACK_COLOR,
        },
      })),
    (session) => session.start,
  )
})

const times = computed(() => Object.keys(sessions.value).sort())
</script>

<template>
  <div class="pa-3 flex flex-col gap-6 w-[var(--viewport-width,100vw)] isolate">
    <section
      v-for="time in times"
      :key="time"
      class="group/section"
    >
      <input
        :id="`session-time-${time}`"
        checked
        class="sr-only"
        type="checkbox"
      >
      <h3 class="text-sm font-medium mb-2 bg-white top-0 sticky z-content">
        <label
          class="text-primary-400 py-1 flex gap-1 w-full cursor-pointer select-none items-center justify-between"
          :for="`session-time-${time}`"
        >
          <div class="flex gap-x-2 items-center">
            <span class="w-[5ch] block">{{ time }}</span>
            <Icon
              class="text-md text-primary-400"
              name="tabler:circle"
            />
            <span v-if="sessions?.[time] && sessions[time].length > 1">
              {{ sessions[time].length }} 場同時開始
            </span>
          </div>
          <Icon
            class="text-sm transition-transform duration-300 group-has-[input:not(:checked)]/section:-rotate-180"
            name="tabler:chevron-up"
          />
        </label>
      </h3>
      <div class="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out group-has-[input:not(:checked)]/section:grid-rows-[0fr]">
        <div class="overflow-hidden">
          <div class="pb-2 flex flex-col gap-2">
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
        </div>
      </div>
    </section>
  </div>
</template>

<i18n lang="yaml">
  en:
    add: 'Add to favorites'
    remove: 'Remove from favorites'
  zh:
    add: '加入收藏'
    remove: '取消收藏'
</i18n>
