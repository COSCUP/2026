<script lang="ts" setup>
import type { SessionSummary } from '#shared/types/session'
import { useI18n } from '#imports'
import CpSessionItem from './CpSessionItem.vue'

const { sessions: _sessions } = defineProps<{ sessions: SessionSummary[] }>()

const { locale } = useI18n()
const localePath = useLocalePath()

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

const times = Object.keys(sessions.value).sort()
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
        <NuxtLink
          v-for="session in sessions[time]"
          :key="session.id"
          :to="localePath(`/session/${session.id}`)"
        >
          <CpSessionItem
            :end="session.end"
            :room="session.room"
            :speaker="session.speakers"
            :start="session.start"
            :tags="session.tags"
            :title="session.title"
          />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
