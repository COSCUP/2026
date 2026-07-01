<script setup lang="ts">
import type { SessionSummary, SessionTrack } from '#shared/types/session'
import { useI18n } from 'vue-i18n'
import { useDragScroll } from '~/composables/useDragScroll'
import { useRealtime } from '~/composables/useRealtime'

const { sessions: _sessions, day, timeRange, interval, rowHeight, columnWidth } = defineProps<{
  day: string
  timeRange: [string, string]
  sessions: SessionSummary[]
  interval: number
  rowHeight: number
  columnWidth: number
}>()

const { t, locale } = useI18n()
const { time } = useRealtime()
const localePath = useLocalePath()

const { containerRef, isDragging } = useDragScroll({ scrollTarget: 'window' })

// Width of the sticky track-label column; keep in sync with the grid-template value below.
const LABEL_WIDTH = 280

// Per-track solid card background, ordered by sorted track index (from the Figma spec §5).
const TRACK_COLORS = [
  '#e76f51',
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#ffa07a',
  '#98d8c8',
  '#f7dc6f',
  '#bb8fce',
  '#85c1e2',
  '#f8b195',
  '#f67280',
  '#c06c84',
  '#6c5b7b',
  '#355c7d',
  '#2a9d8f',
  '#264653',
  '#e9c46a',
  '#f4a261',
  '#e63946',
  '#457b9d',
  '#1d3557',
  '#a8dadc',
]

const isZh = computed(() => locale.value !== 'en')

function parseMinutes(isoStr: string) {
  const match = isoStr.match(/T(\d{2}):(\d{2})/)
  if (!match) {
    throw new Error(`Invalid ISO time string: ${isoStr}`)
  }
  const [, hours, minutes] = match
  return Number(hours) * 60 + Number(minutes)
}

const timeStart = computed(() => parseMinutes(`T${timeRange[0]}`))
const timeEnd = computed(() => parseMinutes(`T${timeRange[1]}`))
const totalGridCols = computed(() => Math.round((timeEnd.value - timeStart.value) / interval))

function toCol(minutes: number) {
  return Math.round((minutes - timeStart.value) / interval) + 2
}

function localeName(name: SessionTrack['name'] | SessionSummary['room']) {
  const { en = '', 'zh-hans': zh = '' } = name ?? {}
  return isZh.value ? zh || en : en || zh
}

const daySessions = computed(() =>
  (_sessions ?? []).filter((session) => session.start?.startsWith(day) && session.end),
)

// Rows are tracks. Track-less sessions collapse into one fallback bucket so nothing disappears.
const NO_TRACK = '__none__'

const tracks = computed(() => {
  const byKey = new Map<string, { key: string, order: number, name: string, room: string }>()
  for (const session of daySessions.value) {
    const id = session.track?.id
    const key = id != null ? String(id) : NO_TRACK
    if (!byKey.has(key)) {
      byKey.set(key, {
        key,
        order: id ?? Number.POSITIVE_INFINITY,
        name: session.track ? localeName(session.track.name) : t('other'),
        room: localeName(session.room),
      })
    }
  }
  return [...byKey.values()]
    .sort((a, b) => a.order - b.order)
    .map((track, index) => ({ ...track, color: TRACK_COLORS[index % TRACK_COLORS.length]! }))
})

const trackIndex = computed(() => new Map(tracks.value.map((track, index) => [track.key, index])))

// On-the-hour columns get a solid grey line; the half-hour between them is dashed.
const gridLines = computed(() => {
  const lines: { col: number, dashed: boolean }[] = []
  let m = Math.ceil(timeStart.value / 60) * 60
  while (m < timeEnd.value) {
    lines.push({ col: toCol(m), dashed: false })
    const half = m + 30
    if (half < timeEnd.value) {
      lines.push({ col: toCol(half), dashed: true })
    }
    m += 60
  }
  return lines
})

const timeLabels = computed(() => {
  const labels: { label: string, col: number }[] = []
  let m = Math.ceil(timeStart.value / 60) * 60
  while (m < timeEnd.value) {
    labels.push({ label: `${Math.floor(m / 60)}:00`, col: toCol(m) })
    m += 60
  }
  return labels
})

function nowMinutes() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(time.value)
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value)
  return get('hour') * 60 + get('minute') + get('second') / 60
}

const nowMins = computed(() => nowMinutes())

const nowLineLeft = computed(() => LABEL_WIDTH + ((nowMins.value - timeStart.value) / interval) * columnWidth)

const nowLabel = computed(() => {
  const mins = Math.floor(nowMins.value)
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
})

// Taipei-local date (YYYY-MM-DD, lexically comparable to `day`); toISOString() is UTC and
// would be 8h off during the conference day.
const todayTaipei = computed(() =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(time.value),
)

const showRealtimeLine = computed(() =>
  day === todayTaipei.value && timeStart.value <= nowMins.value && nowMins.value <= timeEnd.value,
)

const sessions = computed(() =>
  daySessions.value.map((session) => {
    const startMins = parseMinutes(session.start!)
    const endMins = parseMinutes(session.end!)
    const key = session.track?.id != null ? String(session.track.id) : NO_TRACK
    const index = trackIndex.value.get(key) ?? 0
    // Past / in-progress sessions render dimmed (State A); future sessions render bright (State B).
    // Judge by Taipei date/time so a finished day stays dimmed even when the now line is out of range.
    const isPast = day < todayTaipei.value
      ? true
      : day > todayTaipei.value ? false : startMins <= nowMins.value

    return {
      id: session.id,
      title: session[locale.value].title,
      speaker: session.speakers?.map((s) => s[locale.value].name).join(', '),
      start: session.start!.slice(11, 16).replace(/^0/, ''),
      end: session.end!.slice(11, 16).replace(/^0/, ''),
      col: [toCol(startMins), toCol(endMins)],
      row: index + 2,
      color: tracks.value[index]?.color ?? '#e76f51',
      isPast,
    }
  }),
)

// Header ruler is 47px (46px content + 1px bottom border) to match the Figma time-axis row.
const HEADER_HEIGHT = 47
</script>

<template>
  <div
    ref="containerRef"
    class="grid relative overflow-clip isolate"
    :class="isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'"
    :style="{
      gridTemplateColumns: `${LABEL_WIDTH}px repeat(${totalGridCols}, ${columnWidth}px)`,
      gridTemplateRows: `${HEADER_HEIGHT}px repeat(${tracks.length}, ${rowHeight}px)`,
    }"
  >
    <!-- Time-axis header: 議程軌 corner cell -->
    <div
      class="px-4 py-3 border-b border-b-[rgba(26,26,26,0.12)] bg-white flex items-center left-0 top-0 justify-between sticky z-modal"
      :style="{ 'grid-row': 1, 'grid-column': 1 }"
    >
      <span
        class="text-[14px] text-[#1a1a1a] leading-[20px] tracking-[0.35px] font-semibold whitespace-nowrap"
      >{{ t('trackColumn') }}</span>
      <span class="p-1 rounded-[4px] flex items-center">
        <Icon
          class="text-[14px] text-[#1a1a1a]"
          name="tabler:chevron-down"
        />
      </span>
    </div>

    <!-- Time-axis header: hour labels -->
    <template
      v-for="label in timeLabels"
      :key="label.label"
    >
      <div
        class="px-0 border-b border-b-[rgba(26,26,26,0.12)] bg-white flex flex-col items-start top-0 sticky z-sticky"
        :style="{
          'grid-row': 1,
          'grid-column': `${label.col} / ${label.col + 60 / interval}`,
        }"
      >
        <span class="bg-[#787878] h-3 w-0.5" />
        <span
          class="text-[12px] text-[#505050] leading-[16px] font-medium font-mono pt-0.5 whitespace-nowrap"
        >{{ label.label }}</span>
      </div>
    </template>

    <!-- Vertical column-separator gridlines (per row) -->
    <template
      v-for="line in gridLines"
      :key="`${line.col}-${line.dashed}`"
    >
      <div
        v-for="(_, i) in tracks"
        :key="i"
        class="w-px pointer-events-none"
        :class="line.dashed
          ? 'border-l border-l-[#d2d2d2] border-dashed'
          : 'border-l border-l-[#a0a0a0]'"
        :style="{ 'grid-row': i + 2, 'grid-column': line.col }"
      />
    </template>

    <!-- Track-label column (sticky first column) -->
    <div
      v-for="(track, i) in tracks"
      :key="track.key"
      class="border-b border-r border-b-[rgba(26,26,26,0.06)] border-r-[#bedbff] bg-white flex gap-3 items-center left-0 sticky z-dropdown"
      :style="{ 'grid-row': i + 2, 'grid-column': 1, 'padding': '12px 17px 12px 16px' }"
    >
      <div class="flex flex-1 flex-col min-w-0">
        <div class="flex gap-1.5 items-center">
          <span
            class="text-[14px] text-[#1a1a1a] leading-[17.5px] font-semibold whitespace-nowrap truncate"
          >{{ track.name }}</span>
        </div>
        <div
          v-if="track.room"
          class="pt-1 flex gap-0.5 items-center"
        >
          <Icon
            class="text-[12px] text-gray-500 shrink-0"
            name="tabler:map-pin"
          />
          <span
            class="text-[12px] text-gray-500 leading-[16px] font-mono whitespace-nowrap"
          >{{ track.room }}</span>
        </div>
      </div>
      <div class="flex gap-1 items-center">
        <span class="p-1.5 rounded-[4px] flex items-center">
          <Icon
            class="text-[14px] text-[#99a1af]"
            name="tabler:pin"
          />
        </span>
        <span class="p-1 rounded-[4px] flex items-center">
          <Icon
            class="text-[16px] text-[#99a1af]"
            name="tabler:chevron-down"
          />
        </span>
      </div>
    </div>

    <!-- Session cards -->
    <NuxtLink
      v-for="session in sessions"
      :key="session.id"
      class="flex items-stretch overflow-hidden"
      :draggable="false"
      :style="{
        'grid-row': session.row,
        'grid-column': `${session.col[0]} / ${session.col[1]}`,
      }"
      :to="localePath(`/session/${session.id}`)"
      @dragstart.prevent
    >
      <div
        class="border border-black/10 flex flex-1 flex-col h-16 self-center box-border relative overflow-hidden"
        :style="{
          backgroundColor: session.color,
          filter: 'drop-shadow(0px 1px 1.5px rgba(0,0,0,0.1)) drop-shadow(0px 1px 1px rgba(0,0,0,0.1))',
        }"
      >
        <!-- Dark overlay (State A only) -->
        <div
          v-if="session.isPast"
          class="bg-black/30 pointer-events-none inset-0 absolute"
        />

        <!-- Content -->
        <div
          class="px-2 py-1.5 flex flex-1 flex-col w-full items-start justify-center relative overflow-clip"
        >
          <!-- Favorite star (static visual element) -->
          <span
            class="p-1 rounded-[4px] bg-black/10 flex items-center left-1 top-1 absolute"
          >
            <Icon
              class="text-[12px] text-white"
              name="tabler:star"
            />
          </span>

          <h3
            class="text-[12px] text-white leading-[15px] font-semibold pl-5 whitespace-nowrap"
            :class="{ 'w-full overflow-hidden text-ellipsis': session.isPast }"
            :style="{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.15))' }"
          >
            {{ session.title }}
          </h3>
          <p
            class="text-[10px] text-white leading-[15px] pt-0.5 opacity-90 whitespace-nowrap"
          >
            {{ session.speaker || '\u00A0' }}
          </p>
          <time
            class="text-[9px] text-white leading-[13.5px] font-mono pt-0.5 opacity-80 whitespace-nowrap"
          >{{ session.start }}-{{ session.end }}</time>
        </div>
      </div>
    </NuxtLink>

    <!-- Current-time ("now") line -->
    <ClientOnly>
      <div
        v-if="showRealtimeLine"
        class="flex flex-col h-full pointer-events-none items-center top-0 absolute z-sticky"
        :style="{ left: `${nowLineLeft}px` }"
      >
        <div class="bg-[rgba(251,44,54,0.8)] h-full w-px" />
        <div
          class="rounded-[4px] bg-[#fb2c36] flex h-[13px] w-[35px] items-center left-[-34.5px] top-[-2px] justify-end absolute"
        >
          <span
            class="text-[9px] text-white leading-[9px] font-mono pr-1 whitespace-nowrap"
          >{{ nowLabel }}</span>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<i18n lang="yaml">
  en:
    other: 'Other'
    trackColumn: 'Track'
  zh:
    other: '其他'
    trackColumn: '議程軌'
</i18n>
