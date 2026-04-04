<script setup lang="ts">
import type { SessionSummary } from '#shared/types/session'
import { useI18n } from '#imports'
import CpSessionItem from './CpSessionItem.vue'

const { sessions: _sessions, day, timeRange, interval, rowHeight } = defineProps<{
  day: string
  timeRange: [string, string]
  sessions: SessionSummary[]
  interval: number
  rowHeight: number
}>()

const { locale } = useI18n()

function parseMinutes(isoStr: string) {
  const d = new Date(isoStr)
  return d.getHours() * 60 + d.getMinutes()
}

const timeStart = computed(() => parseMinutes(`${day}T${timeRange[0]}+08:00`))
const timeEnd = computed(() => parseMinutes(`${day}T${timeRange[1]}+08:00`))
const totalGridRows = computed(() => Math.round((timeEnd.value - timeStart.value) / interval))

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function toRow(minutes: number) {
  return Math.round((minutes - timeStart.value) / interval) + 2
}

const rooms = computed(() => {
  if (!_sessions) {
    return []
  }

  const rooms = _sessions
    .map((session) => session.room?.en)
    .filter((value) => value !== undefined)

  return [...new Set(rooms)].sort() satisfies string[]
})

const timeLabels = computed(() => {
  const labels: { label: string, row: number }[] = []
  let m = Math.ceil(timeStart.value / 30) * 30
  while (m <= timeEnd.value) {
    labels.push({ label: formatTime(m), row: toRow(m) })
    m += 30
  }
  return labels
})

const sessions = computed(() => {
  if (!_sessions) {
    return []
  }

  return _sessions
    .filter((session) => {
      session.start?.startsWith(day)

      return [
        session.start?.startsWith(day),
        session.end,
        session.room,
      ].every(Boolean)
    })
    .map((session) => {
      const startMins = parseMinutes(session.start!)
      const endMins = parseMinutes(session.end!)

      const { title } = session[locale.value]
      const speaker = session.speakers?.map((s) => s[locale.value].name).join(', ')

      return {
        id: session.id,
        title,
        speaker,
        start: session.start!.slice(11, 16),
        end: session.end!.slice(11, 16),
        row: [toRow(startMins), toRow(endMins)],
        col: rooms.value.findIndex((r) => session.room!.en === r) + 2,
        tags: [],
      }
    })
})
</script>

<template>
  <div
    class="grid overflow-x-auto rounded-xl border border-gray-200"
    :style="{
      gridTemplateColumns: `4.5rem repeat(${rooms.length}, minmax(11rem, 1fr))`,
      gridTemplateRows: `3rem repeat(${totalGridRows}, ${rowHeight}px)`,
    }"
  >

  <div
      class="left-0 top-0 sticky z-20 bg-gray-50 border-b border-gray-200" 
      :style="{
        'grid-row': 1,
        'grid-column': 1,
      }"
    />

    <div
      v-for="(room, i) in rooms"
      :key="room"
      :style="{
        'grid-row': 1,
        'grid-column': i + 2,
      }"
      class="bg-gray-50 flex justify-center items-center text-primary-400 border-b border-gray-200 font-medium text-sm"
    >
      {{ room }}
    </div>

    <template
      v-for="label in timeLabels"
      :key="label.label"
    >
      <div
        class="text-xs bg-gray-50 text-gray-400 pr-2 pt-0.5 text-right border-t border-gray-100 flex justify-center items-start"
        :style="{
          'grid-row': `${label.row} / ${label.row + 6}`,
          'grid-column': 1,
        }"
      >
        {{ label.label }}
      </div>
      <div
        v-for="(_, i) in rooms"
        :key="i"
        class="border-t border-gray-100"
        :style="{
          'grid-row': label.row,
          'grid-column': i + 2,
        }"
      />
    </template>

    <NuxtLink
      v-for="session in sessions"
      :key="session.id"
      :to="`/sessions/${session.id}`"
      class="overflow-hidden"
      :style="{
        'grid-row': `${session.row[0]} / ${session.row[1]}`,
        'grid-column': session.col,
      }"
    >
      <CpSessionItem
        class="h-full"
        :end="session.end"
        :speaker="session.speaker"
        :start="session.start"
        :tags="session.tags"
        :title="session.title"
      />
    </NuxtLink>
  </div>
</template>
