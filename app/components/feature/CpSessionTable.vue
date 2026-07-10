<script setup lang="ts">
import type { SessionSummary, SessionTrack } from '#shared/types/session'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { useI18n } from '#imports'
import { useDragScroll } from '~/composables/useDragScroll'
import { useFavoriteLabel, useFavorites } from '~/composables/useFavorites'
import { useRealtime } from '~/composables/useRealtime'
import { buildTrackColorMap, isMainTrack, trackKey } from '~/utils/tracks'

const { sessions: _sessions, day, timeRange, interval, rowHeight, columnWidth, preview = false } = defineProps<{
  day: string
  timeRange: [string, string]
  sessions: SessionSummary[]
  interval: number
  rowHeight: number
  columnWidth: number
  // Shared-list preview: render every session as a read-only favorite.
  preview?: boolean
}>()

const { t, locale } = useI18n()
const { time } = useRealtime()
const route = useRoute()
const localePath = useLocalePath()
const { isFavorite, toggleFavorite } = useFavorites()
const favoriteLabel = useFavoriteLabel()

const { containerRef, isDragging } = useDragScroll({ scrollTarget: 'window' })

// Time-axis column width and header row height, matching the Figma room-timeline spec.
const TIME_COL_WIDTH = 64
const HEADER_HEIGHT = 58

const isZh = computed(() => locale.value !== 'en')

function sessionPath(id: string) {
  return localePath({ path: `/session/${id}`, query: route.query })
}

function parseMinutes(isoStr: string) {
  const match = isoStr.match(/T(\d{2}):(\d{2})/)
  if (!match) {
    throw new Error(`Invalid ISO time string: ${isoStr}`)
  }
  const [, hours, minutes] = match
  return Number(hours) * 60 + Number(minutes)
}

function localeName(name?: SessionTrack['name']) {
  const { en = '', 'zh-hant': zh = '' } = name ?? {}
  return isZh.value ? zh || en : en || zh
}

const timeStart = computed(() => parseMinutes(`T${timeRange[0]}`))
const timeEnd = computed(() => parseMinutes(`T${timeRange[1]}`))
const totalGridRows = computed(() => Math.round((timeEnd.value - timeStart.value) / interval))

function formatClock(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Grid rows: header is row 1, the first time slot is row 2.
function toRow(minutes: number) {
  return Math.round((minutes - timeStart.value) / interval) + 2
}

function roomSortRank(room: string) {
  if (room === 'RB105') {
    // Put the room with an opening first
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
  (_sessions ?? []).filter((session) =>
    session.start?.startsWith(day) && session.end && session.room?.en,
  ),
)

// A track keeps its colour across both table views (see ~/utils/tracks). Build from the whole
// day (not just roomed sessions) so the index order matches CpSessionTrackTable exactly.
const trackColors = computed(() =>
  buildTrackColorMap((_sessions ?? []).filter((session) => session.start?.startsWith(day) && session.end)),
)

// Rooms are the columns. Each carries the track name(s) hosted there as a subtitle.
const roomsRaw = computed(() => {
  const byCode = new Map<string, { code: string, trackNames: Set<string>, isMain: boolean }>()
  for (const session of daySessions.value) {
    const code = session.room!.en
    let info = byCode.get(code)
    if (!info) {
      info = { code, trackNames: new Set(), isMain: false }
      byCode.set(code, info)
    }
    const name = localeName(session.track?.name)
    if (name) {
      info.trackNames.add(name)
    }
    if (isMainTrack(session.track?.name)) {
      info.isMain = true
    }
  }
  return [...byCode.values()].map((room) => ({
    code: room.code,
    subtitle: [...room.trackNames].join('、'),
    isMain: room.isMain,
  }))
})

// null = never visited (pin the main-track room by default); [] = user unpinned everything.
const pinnedRooms = useLocalStorage<string[] | null>('coscup-pinned-rooms', null, {
  serializer: StorageSerializers.object,
})
const isPinned = (code: string) => (pinnedRooms.value ?? []).includes(code)

function togglePin(code: string) {
  const current = pinnedRooms.value ?? []
  pinnedRooms.value = current.includes(code)
    ? current.filter((c) => c !== code)
    : [...current, code]
}

// Room hosting the main track, derived event-wide so the first-visit pin doesn't depend on the day.
const defaultMainRoom = computed(() => {
  const main = (_sessions ?? []).find((session) => isMainTrack(session.track?.name) && session.room?.en)
  return main?.room?.en ?? null
})

watch(defaultMainRoom, (code) => {
  if (pinnedRooms.value === null && code) {
    pinnedRooms.value = [code]
  }
}, { immediate: true })

// Pinned rooms float to the front (in pin order); the rest keep the venue ordering.
const rooms = computed(() => {
  const pinOrder = new Map((pinnedRooms.value ?? []).map((code, index) => [code, index]))
  return [...roomsRaw.value]
    .sort((a, b) => compareRooms(a.code, b.code))
    .sort((a, b) => {
      const ai = pinOrder.get(a.code)
      const bi = pinOrder.get(b.code)
      if (ai != null && bi != null) {
        return ai - bi
      }
      return (ai != null ? 0 : 1) - (bi != null ? 0 : 1)
    })
})

// Hour labels down the time axis; assumes the range starts on the hour (real data is 09:00).
const timeBands = computed(() => {
  const bands: { label: string, rowStart: number, rowEnd: number }[] = []
  let m = Math.ceil(timeStart.value / 60) * 60
  while (m < timeEnd.value) {
    const next = Math.min(m + 60, timeEnd.value)
    bands.push({ label: `${Math.floor(m / 60)}:00`, rowStart: toRow(m), rowEnd: toRow(next) })
    m += 60
  }
  return bands
})

// Horizontal grid lines every 30 min: solid on the hour, dashed on the half-hour.
const gridLines = computed(() => {
  const lines: { row: number, hour: boolean }[] = []
  let m = Math.ceil(timeStart.value / 30) * 30
  while (m < timeEnd.value) {
    lines.push({ row: toRow(m), hour: m % 60 === 0 })
    m += 30
  }
  return lines
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
const nowLineTop = computed(() => HEADER_HEIGHT + ((nowMins.value - timeStart.value) / interval) * rowHeight)
const nowLabel = computed(() => formatClock(Math.floor(nowMins.value)))

// Taipei-local date (YYYY-MM-DD, lexically comparable to `day`); toISOString() is UTC and 8h off.
const todayTaipei = computed(() =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(time.value),
)

const showRealtimeLine = computed(() =>
  day === todayTaipei.value && timeStart.value <= nowMins.value && nowMins.value <= timeEnd.value,
)

const DIFFICULTY_TAGS = ['Elementary', 'Intermediate', 'Advanced']
function difficultyLabel(tags: string[]) {
  const level = tags.find((tag) => DIFFICULTY_TAGS.includes(tag))
  // ponytail: badge shows the difficulty (the one clean, well-populated tag), else "Other".
  return level ? t(`difficulty.${level}`) : t('other')
}

const sessions = computed(() =>
  daySessions.value.map((session) => {
    const startMins = parseMinutes(session.start!)
    const endMins = parseMinutes(session.end!)
    // Past / in-progress sessions render dimmed; future sessions render bright. Judge by Taipei
    // date/time so a finished day stays dimmed even when the now line is out of range.
    const isPast = day < todayTaipei.value
      ? true
      : day > todayTaipei.value ? false : startMins <= nowMins.value

    // Card height is the cell minus the 4px vertical inset (my-[2px]). A 30-min card (~56px)
    // only fits the 2-line title + time, so drop the speaker below the height where all three
    // fit and nothing is clipped mid-line. Title and time+tag always show.
    const cardHeightPx = ((endMins - startMins) / interval) * rowHeight - 4

    return {
      id: session.id,
      title: session[locale.value].title,
      speaker: session.speakers?.map((s) => s[locale.value].name).join(', '),
      showSpeaker: cardHeightPx >= 72,
      start: session.start!.slice(11, 16).replace(/^0/, ''),
      end: session.end!.slice(11, 16).replace(/^0/, ''),
      tag: difficultyLabel(session.tags),
      row: [toRow(startMins), toRow(endMins)],
      col: rooms.value.findIndex((r) => r.code === session.room!.en) + 2,
      color: trackColors.value.get(trackKey(session)) ?? '#e76f51',
      isPast,
    }
  }),
)
</script>

<template>
  <div
    ref="containerRef"
    class="border border-[rgba(26,26,26,0.12)] rounded-[8px] grid relative overflow-clip isolate"
    :class="isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'"
    :style="{
      gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${rooms.length}, ${columnWidth}px)`,
      gridTemplateRows: `${HEADER_HEIGHT}px repeat(${totalGridRows}, ${rowHeight}px)`,
    }"
  >
    <!-- Top-left corner cell (empty) -->
    <div
      class="border-b border-r border-[rgba(26,26,26,0.12)] bg-[#faf9f7] left-0 top-0 sticky z-modal"
      :style="{ 'grid-row': 1, 'grid-column': 1 }"
    />

    <!-- Room header cells -->
    <div
      v-for="(room, i) in rooms"
      :key="room.code"
      class="py-[10px] pl-[12px] pr-[13px] border-b border-r border-[rgba(26,26,26,0.12)] bg-[#faf9f7] flex flex-col items-start top-0 relative sticky z-sticky overflow-hidden"
      :class="isPinned(room.code) ? 'shadow-[inset_0px_-3px_0px_0px_#3b82f6]' : ''"
      :style="{ 'grid-row': 1, 'grid-column': i + 2 }"
      @pointerdown.stop
    >
      <!-- Pinned column tint -->
      <div
        v-if="isPinned(room.code)"
        class="bg-[rgba(239,246,255,0.6)] pointer-events-none inset-0 absolute"
      />
      <div class="flex w-full items-center justify-between relative">
        <div class="flex gap-[4px] min-w-0 items-center">
          <Icon
            v-if="isPinned(room.code)"
            class="text-[12px] text-[#1447e6] shrink-0"
            name="tabler:pin-filled"
          />
          <span
            class="text-[12px] leading-[16px] font-bold font-mono whitespace-nowrap truncate"
            :class="isPinned(room.code) ? 'text-[#1447e6]' : 'text-[#1a1a1a]'"
          >{{ room.code }}</span>
        </div>
        <button
          :aria-label="isPinned(room.code) ? t('unpinRoom') : t('pinRoom')"
          :aria-pressed="isPinned(room.code)"
          class="p-[4px] rounded-[4px] flex shrink-0 cursor-pointer items-center"
          :class="isPinned(room.code) ? 'bg-[#dbeafe] text-[#1447e6]' : 'text-[#99a1af] hover:text-[#4a5565]'"
          :title="isPinned(room.code) ? t('unpinRoom') : t('pinRoom')"
          type="button"
          @click="togglePin(room.code)"
        >
          <Icon
            class="text-[12px]"
            :name="isPinned(room.code) ? 'tabler:pin-filled' : 'tabler:pin'"
          />
        </button>
      </div>
      <p
        v-if="room.subtitle"
        class="text-[10px] text-[#737373] leading-[15px] pt-[2px] w-full whitespace-nowrap relative overflow-hidden"
      >
        {{ room.subtitle }}
      </p>
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
      :key="`div-${room.code}`"
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

    <!-- Session cards. Inset within the grid cell (Figma: 4px sides, 2px top/bottom) so
         adjacent sessions are visually separated and the favorited outline has room. -->
    <div
      v-for="session in sessions"
      :key="session.id"
      class="mx-[4px] my-[2px] rounded-[4px] relative overflow-hidden"
      :style="{
        'grid-row': `${session.row[0]} / ${session.row[1]}`,
        'grid-column': session.col,
        'backgroundColor': session.color,
        'boxShadow': (preview || isFavorite(session.id))
          ? '0 0 0 1px #ffffff, 0 0 0 3px #fdc700'
          : '0px 1px 1.5px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.1)',
      }"
    >
      <!-- Content -->
      <div class="px-[8px] py-[4px] flex flex-col h-full w-full overflow-hidden">
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
        <!-- Spacer pushes the time/tag row to the bottom; on short cards it collapses so the
             overflow clips the bottom row rather than overlapping the speaker. -->
        <div class="flex-1" />
        <div class="flex gap-[6px] items-center">
          <!-- The tag pill centers its own text; the mono digits render ~1px high in their
               line box, so nudge the time down 1px to optically center it against the tag. -->
          <time class="text-[9px] text-white/80 leading-none font-mono whitespace-nowrap top-[1px] relative">{{ session.start }}–{{ session.end }}</time>
          <span
            v-if="session.tag"
            class="text-[8px] text-white/90 leading-none px-[4px] py-[3px] rounded-[4px] bg-white/20 whitespace-nowrap"
          >{{ session.tag }}</span>
        </div>
      </div>

      <!-- Overlay link (transparent), so the bookmark stays a clickable sibling, not nested. -->
      <NuxtLink
        :aria-label="session.title"
        class="inset-0 absolute"
        :draggable="false"
        :to="sessionPath(session.id)"
        @dragstart.prevent
      />

      <!-- Dimmed state (past / in progress) -->
      <div
        v-if="session.isPast"
        class="bg-black/30 pointer-events-none inset-0 absolute"
      />

      <!-- Favorite bookmark (bottom-right, so it never overlaps the title) -->
      <span
        v-if="preview"
        aria-hidden="true"
        class="text-[12px] text-white leading-none p-[4px] rounded-[4px] bg-black/10 pointer-events-none bottom-[6px] right-[6px] absolute"
      >
        <Icon name="tabler:bookmark-filled" />
      </span>
      <button
        v-else
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
</template>

<i18n lang="yaml">
  en:
    other: 'Other'
    pinRoom: 'Pin room'
    unpinRoom: 'Unpin room'
    add: 'Add to favorites'
    remove: 'Remove from favorites'
    difficulty:
      Elementary: 'Beginner'
      Intermediate: 'Intermediate'
      Advanced: 'Advanced'
  zh:
    other: '其他'
    pinRoom: '釘選教室'
    unpinRoom: '取消釘選'
    add: '加入收藏'
    remove: '取消收藏'
    difficulty:
      Elementary: '入門'
      Intermediate: '中階'
      Advanced: '進階'
</i18n>
