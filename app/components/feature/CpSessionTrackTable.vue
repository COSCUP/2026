<script setup lang="ts">
import type { SessionSummary, SessionTrack } from '#shared/types/session'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useDragScroll } from '~/composables/useDragScroll'
import { useRealtime } from '~/composables/useRealtime'
import { TRACK_COLORS } from '~/utils/tracks'

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
  const { en = '', 'zh-hant': zh = '' } = name ?? {}
  return isZh.value ? zh || en : en || zh
}

function roomSortRank(room: string) {
  if (room === 'RB105') {
    return 0
  }
  if (room.startsWith('RB')) {
    return 1
  }
  if (room.startsWith('AU')) {
    return 2
  }
  if (room.startsWith('TR')) {
    return 3
  }
  return 4
}

function compareRooms(a: string, b: string) {
  const rankDiff = roomSortRank(a) - roomSortRank(b)
  return rankDiff || a.localeCompare(b)
}

const daySessions = computed(() =>
  (_sessions ?? []).filter((session) => session.start?.startsWith(day) && session.end),
)

// Rows are tracks. Track-less sessions collapse into one fallback bucket so nothing disappears.
const NO_TRACK = '__none__'

// Match by name (either locale) since Pretalx track ids aren't stable across events.
const MAIN_TRACK_NAMES = ['主議程', 'Main Session Track']
function isMainTrack(name?: SessionTrack['name']) {
  return MAIN_TRACK_NAMES.includes(name?.['zh-hant'] ?? '') || MAIN_TRACK_NAMES.includes(name?.en ?? '')
}

// null = never visited (pin main by default); [] = user unpinned everything (respect it).
// Explicit JSON serializer: a null default otherwise picks the String()-based `any` serializer.
const pinnedKeys = useLocalStorage<string[] | null>('coscup-pinned-tracks', null, {
  serializer: StorageSerializers.object,
})
const isPinned = (key: string) => (pinnedKeys.value ?? []).includes(key)

function togglePin(key: string) {
  const current = pinnedKeys.value ?? []
  pinnedKeys.value = current.includes(key)
    ? current.filter((k) => k !== key)
    : [...current, key]
}

const tracks = computed(() => {
  const byKey = new Map<string, { key: string, order: number, name: string, room: string, isMain: boolean }>()
  for (const session of daySessions.value) {
    const id = session.track?.id
    const key = id != null ? String(id) : NO_TRACK
    if (!byKey.has(key)) {
      byKey.set(key, {
        key,
        order: id ?? Number.POSITIVE_INFINITY,
        name: session.track ? localeName(session.track.name) : t('other'),
        room: localeName(session.room),
        isMain: isMainTrack(session.track?.name),
      })
    }
  }
  // Color by stable track-id order so a track keeps its color regardless of pin state. Pinned
  // group is ordered by pin order (newest last); unpinned keep id order (Array.sort is stable).
  const pinOrder = new Map((pinnedKeys.value ?? []).map((key, index) => [key, index]))
  return [...byKey.values()]
    .sort((a, b) => compareRooms(a.room, b.room) || a.order - b.order)
    .map((track, index) => ({ ...track, color: TRACK_COLORS[index % TRACK_COLORS.length]! }))
    .sort((a, b) => {
      const ai = pinOrder.get(a.key)
      const bi = pinOrder.get(b.key)
      if (ai != null && bi != null) {
        return ai - bi
      }
      return (ai != null ? 0 : 1) - (bi != null ? 0 : 1)
    })
})

// Default main-track key, derived event-wide so the first-visit pin doesn't depend on which day loaded.
const defaultMainKey = computed(() => {
  const main = (_sessions ?? []).find((session) => isMainTrack(session.track?.name))
  return main?.track?.id != null ? String(main.track.id) : null
})

// On first visit, pin the main track by default.
watch(defaultMainKey, (key) => {
  if (pinnedKeys.value === null && key != null) {
    pinnedKeys.value = [key]
  }
}, { immediate: true })

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
      class="px-4 py-3 border-b border-b-[rgba(26,26,26,0.12)] bg-white flex cursor-default items-center left-0 top-0 justify-between sticky z-modal"
      :style="{ 'grid-row': 1, 'grid-column': 1 }"
      @pointerdown.stop
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
      class="border-b border-r border-b-[rgba(26,26,26,0.06)] flex gap-3 cursor-default items-center left-0 sticky z-dropdown"
      :class="isPinned(track.key)
        ? 'border-r-[#bedbff] bg-[#eff6ff] shadow-[inset_4px_0px_0px_0px_#3b82f6]'
        : 'border-r-[rgba(26,26,26,0.12)] bg-white'"
      :style="{ 'grid-row': i + 2, 'grid-column': 1, 'padding': '12px 17px 12px 16px' }"
      @pointerdown.stop
    >
      <div class="flex flex-1 flex-col min-w-0">
        <div class="flex gap-1.5 items-center">
          <span
            class="text-[14px] leading-[17.5px] font-semibold whitespace-nowrap truncate"
            :class="isPinned(track.key) ? 'text-[#1447e6]' : 'text-[#1a1a1a]'"
          >{{ track.name }}</span>
        </div>
        <div
          v-if="track.room"
          class="pt-1 flex gap-0.5 items-center"
          :class="isPinned(track.key) ? 'text-[#2b7fff]' : 'text-[#737373]'"
        >
          <Icon
            class="text-[12px] shrink-0"
            name="tabler:map-pin"
          />
          <span
            class="text-[12px] leading-[16px] font-mono whitespace-nowrap"
          >{{ track.room }}</span>
        </div>
      </div>
      <div class="flex gap-1 items-center">
        <button
          :aria-label="isPinned(track.key) ? t('unpinTrack') : t('pinTrack')"
          :aria-pressed="isPinned(track.key)"
          class="p-1.5 rounded-[4px] flex cursor-pointer items-center"
          :class="isPinned(track.key) ? 'bg-[#dbeafe] text-[#1447e6]' : 'text-[#99a1af]'"
          :title="isPinned(track.key) ? t('unpinTrack') : t('pinTrack')"
          type="button"
          @click="togglePin(track.key)"
        >
          <Icon
            class="text-[14px]"
            :name="isPinned(track.key) ? 'tabler:pin-filled' : 'tabler:pin'"
          />
        </button>
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
    pinTrack: 'Pin track'
    unpinTrack: 'Unpin track'
  zh:
    other: '其他'
    trackColumn: '議程軌'
    pinTrack: '釘選議程軌'
    unpinTrack: '取消釘選'
</i18n>
