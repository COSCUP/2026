<script setup lang="ts">
import type { SessionSummary } from '#shared/types/session'
import { useI18n } from '#imports'
import { useDragScroll } from '~/composables/useDragScroll'
import { useFavoriteLabel, useFavorites } from '~/composables/useFavorites'
import { useRealtime } from '~/composables/useRealtime'

// One track's sessions on the same vertical room-timeline grid as CpSessionTable.
const { sessions, day, color } = defineProps<{
  sessions: SessionSummary[]
  day: string
  color: string
}>()

const { t, locale } = useI18n()
const { time } = useRealtime()
const route = useRoute()
const { isFavorite, toggleFavorite } = useFavorites()
const favoriteLabel = useFavoriteLabel(t)
const { containerRef, isDragging } = useDragScroll({ scrollTarget: 'container', vertical: false })

// Grid geometry, matching the session table's room-timeline spec.
const TIME_COL_WIDTH = 56
const HEADER_HEIGHT = 44
const INTERVAL = 5 // minutes per grid row, aligned to Pretalx scheduling granularity
const ROW_HEIGHT = 16 // px per row; a 30-min card is 6 rows = 96px

const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en'))
const roomKey = computed(() => (localeKey.value === 'zh' ? 'zh-hant' : 'en') as 'zh-hant' | 'en')

function parseMinutes(iso: string) {
  const match = iso.match(/T(\d{2}):(\d{2})/)
  if (!match) {
    return null
  }
  return Number(match[1]) * 60 + Number(match[2])
}

function roomName(session: SessionSummary) {
  return session.room?.[roomKey.value] || session.room?.en || ''
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
  return roomSortRank(a) - roomSortRank(b) || a.localeCompare(b)
}

const daySessions = computed(() =>
  sessions.filter((session) => session.start?.startsWith(day) && session.end && roomName(session)),
)

// Rooms are the columns; a single track usually sits in one room.
const rooms = computed(() => {
  const names = [...new Set(daySessions.value.map((session) => roomName(session)))]
  return names.sort(compareRooms)
})

// Time range covers every session, rounded out to the hour, at least 09:00–18:00.
const range = computed(() => {
  let min = 9 * 60
  let max = 18 * 60
  for (const session of daySessions.value) {
    const start = session.start ? parseMinutes(session.start) : null
    const end = session.end ? parseMinutes(session.end) : null
    if (start !== null) {
      min = Math.min(min, start)
    }
    if (end !== null) {
      max = Math.max(max, end)
    }
  }
  return { start: Math.floor(min / 60) * 60, end: Math.ceil(max / 60) * 60 }
})

const totalGridRows = computed(() => Math.round((range.value.end - range.value.start) / INTERVAL))

// Grid rows: header is row 1, the first time slot is row 2.
function toRow(minutes: number) {
  return Math.round((minutes - range.value.start) / INTERVAL) + 2
}

function formatClock(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Hour labels down the time axis, each spanning its full hour of rows.
const timeBands = computed(() => {
  const bands: { label: string, rowStart: number, rowEnd: number }[] = []
  for (let m = range.value.start; m < range.value.end; m += 60) {
    const next = Math.min(m + 60, range.value.end)
    bands.push({ label: `${Math.floor(m / 60)}:00`, rowStart: toRow(m), rowEnd: toRow(next) })
  }
  return bands
})

// Horizontal grid lines every 30 min: solid on the hour, dashed on the half-hour.
const gridLines = computed(() => {
  const lines: { row: number, hour: boolean }[] = []
  for (let m = Math.ceil(range.value.start / 30) * 30; m < range.value.end; m += 30) {
    lines.push({ row: toRow(m), hour: m % 60 === 0 })
  }
  return lines
})

const DIFFICULTY_TAGS = ['Elementary', 'Intermediate', 'Advanced', 'Professional']
function difficultyLabel(tags: string[]) {
  const level = tags.find((tag) => DIFFICULTY_TAGS.includes(tag))
  return level ? t(`difficulty.${level}`) : t('other')
}

// Taipei-local date (YYYY-MM-DD, lexically comparable to `day`); toISOString() is UTC and 8h off.
const todayTaipei = computed(() =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(time.value),
)

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
const nowLineTop = computed(() => HEADER_HEIGHT + ((nowMins.value - range.value.start) / INTERVAL) * ROW_HEIGHT)
const nowLabel = computed(() => formatClock(Math.floor(nowMins.value)))
const showRealtimeLine = computed(() =>
  day === todayTaipei.value && range.value.start <= nowMins.value && nowMins.value <= range.value.end,
)

const cards = computed(() =>
  daySessions.value.map((session) => {
    const startMins = parseMinutes(session.start!)!
    const endMins = parseMinutes(session.end!)!
    // Past / in-progress sessions render dimmed; judge by Taipei date/time so a
    // finished day stays dimmed even when the now line is out of range.
    const isPast = day < todayTaipei.value
      ? true
      : day > todayTaipei.value ? false : startMins <= nowMins.value

    // Cell height minus the 4px vertical inset; content drops in tiers as it shrinks.
    const cardHeightPx = ((endMins - startMins) / INTERVAL) * ROW_HEIGHT - 4

    return {
      id: session.id,
      title: session[localeKey.value].title,
      speaker: session.speakers.map((s) => s[localeKey.value].name).join(t('separator')),
      showSpeaker: cardHeightPx >= 72,
      showMeta: cardHeightPx >= 40,
      start: session.start!.slice(11, 16).replace(/^0/, ''),
      end: session.end!.slice(11, 16).replace(/^0/, ''),
      tag: difficultyLabel(session.tags),
      row: [toRow(startMins), toRow(endMins)],
      col: rooms.value.indexOf(roomName(session)) + 2,
      isPast,
    }
  }),
)

function sessionLink(id: string) {
  return { query: { ...route.query, session: id } }
}
</script>

<template>
  <div
    v-if="rooms.length"
    ref="containerRef"
    class="w-full overflow-auto"
    :class="isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'"
  >
    <div
      class="border border-[rgba(26,26,26,0.12)] rounded-[8px] grid relative isolate"
      :style="{
        gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${rooms.length}, minmax(200px, 1fr))`,
        gridTemplateRows: `${HEADER_HEIGHT}px repeat(${totalGridRows}, ${ROW_HEIGHT}px)`,
      }"
    >
      <!-- Top-left corner cell (empty) -->
      <div
        class="border-b border-r border-[rgba(26,26,26,0.12)] bg-[#faf9f7] left-0 sticky z-modal"
        :style="{ 'grid-row': 1, 'grid-column': 1 }"
      />

      <!-- Room header cells -->
      <div
        v-for="(room, i) in rooms"
        :key="room"
        class="px-3 border-b border-r border-[rgba(26,26,26,0.12)] bg-[#faf9f7] flex gap-1.5 items-center overflow-hidden"
        :style="{ 'grid-row': 1, 'grid-column': i + 2 }"
      >
        <Icon
          class="text-[12px] text-[#737373] shrink-0"
          name="tabler:map-pin"
        />
        <span
          class="text-[12px] text-[#1a1a1a] leading-[16px] font-bold font-mono whitespace-nowrap truncate"
        >{{ room }}</span>
      </div>

      <!-- Time-axis hour bands (sticky left column) -->
      <div
        v-for="band in timeBands"
        :key="band.label"
        class="pr-[8px] pt-[3px] border-b border-r border-b-[rgba(26,26,26,0.05)] border-r-[rgba(26,26,26,0.12)] bg-[#faf9f7] flex items-start left-0 justify-end sticky z-dropdown"
        :style="{ 'grid-row': `${band.rowStart} / ${band.rowEnd}`, 'grid-column': 1 }"
      >
        <span class="text-[10px] text-[#737373] leading-[10px] font-mono whitespace-nowrap">{{ band.label }}</span>
      </div>

      <!-- Vertical room dividers -->
      <div
        v-for="(room, i) in rooms"
        :key="`div-${room}`"
        class="border-r border-[rgba(26,26,26,0.12)] pointer-events-none"
        :style="{ 'grid-row': `2 / -1`, 'grid-column': i + 2 }"
      />

      <!-- Horizontal grid lines (solid on the hour, dashed on the half-hour) -->
      <div
        v-for="line in gridLines"
        :key="`line-${line.row}`"
        class="h-px pointer-events-none"
        :class="line.hour ? 'border-t border-[#dcdcdc]' : 'border-t border-dashed border-[#ebebeb]'"
        :style="{ 'grid-row': line.row, 'grid-column': `2 / -1` }"
      />

      <!-- Session cards -->
      <div
        v-for="session in cards"
        :key="session.id"
        class="mx-[4px] my-[2px] rounded-[4px] relative overflow-hidden"
        :style="{
          'grid-row': `${session.row[0]} / ${session.row[1]}`,
          'grid-column': session.col,
          'backgroundColor': color,
          'boxShadow': isFavorite(session.id)
            ? '0 0 0 1px #ffffff, 0 0 0 3px #fdc700'
            : '0px 1px 1.5px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.1)',
        }"
      >
        <!-- Content -->
        <div class="px-[8px] py-[4px] flex flex-col h-full w-full overflow-hidden">
          <!-- Title/speaker shrink and clip so a short card never pushes the meta row out. -->
          <div class="flex flex-1 flex-col min-h-0 overflow-hidden">
            <h3
              class="text-[12px] text-white leading-[16.5px] font-semibold line-clamp-2"
              :style="{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.15))' }"
            >
              {{ session.title }}
            </h3>
            <p
              v-if="session.showSpeaker"
              class="text-[10px] text-white/80 leading-[15px] pt-[2px] whitespace-nowrap overflow-hidden"
            >
              {{ session.speaker || '\u00A0' }}
            </p>
          </div>
          <div
            v-if="session.showMeta"
            class="pt-[2px] flex shrink-0 gap-[6px] items-center"
          >
            <time class="text-[9px] text-white/80 leading-none font-mono whitespace-nowrap top-[1px] relative">{{ session.start }}–{{ session.end }}</time>
            <span
              v-if="session.tag"
              class="text-[8px] text-white/90 leading-none px-[4px] py-[3px] rounded-[4px] bg-white/20 whitespace-nowrap"
            >{{ session.tag }}</span>
          </div>
        </div>

        <!-- Overlay link opens the detail modal in place; the bookmark stays a clickable sibling. -->
        <NuxtLink
          :aria-label="session.title"
          class="inset-0 absolute"
          :draggable="false"
          :to="sessionLink(session.id)"
          @dragstart.prevent
        />

        <!-- Dimmed state (past / in progress) -->
        <div
          v-if="session.isPast"
          class="bg-black/30 pointer-events-none inset-0 absolute"
        />

        <!-- Favorite bookmark (bottom-right, so it never overlaps the title) -->
        <button
          :aria-label="favoriteLabel(session.id)"
          :aria-pressed="isFavorite(session.id)"
          class="text-[12px] text-white leading-none p-[4px] rounded-[4px] bg-black/10 cursor-pointer transition-colors bottom-[6px] right-[6px] absolute hover:bg-black/20"
          type="button"
          @click.prevent.stop="toggleFavorite(session.id)"
        >
          <Icon :name="isFavorite(session.id) ? 'tabler:bookmark-filled' : 'tabler:bookmark'" />
        </button>
      </div>

      <!-- Current-time ("now") line + badge -->
      <ClientOnly>
        <template v-if="showRealtimeLine">
          <div
            class="bg-[#fb2c36] h-px pointer-events-none absolute z-content"
            :style="{ top: `${nowLineTop}px`, left: `${TIME_COL_WIDTH}px`, right: 0 }"
          />
          <div
            class="pr-[2px] flex pointer-events-none left-0 justify-end absolute z-modal"
            :style="{ top: `${nowLineTop - 6}px`, width: `${TIME_COL_WIDTH}px` }"
          >
            <span class="pr-1 rounded-[4px] bg-[#fb2c36] flex h-[13px] w-[35px] items-center justify-end">
              <span class="text-[9px] text-white leading-[9px] font-mono whitespace-nowrap">{{ nowLabel }}</span>
            </span>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>

  <p
    v-else
    class="text-gray-400 py-8 text-center"
  >
    {{ t('noSession') }}
  </p>
</template>

<i18n lang="yaml">
  en:
    noSession: 'No sessions on this day.'
    other: 'Other'
    separator: ', '
    add: 'Add to favorites'
    remove: 'Remove from favorites'
    difficulty:
      Elementary: 'Beginner'
      Intermediate: 'Intermediate'
      Advanced: 'Advanced'
      Professional: 'Professional'
  zh:
    noSession: '這天沒有議程。'
    other: '其他'
    separator: '、'
    add: '加入收藏'
    remove: '取消收藏'
    difficulty:
      Elementary: '入門'
      Intermediate: '中階'
      Advanced: '進階'
      Professional: '專業'
</i18n>
