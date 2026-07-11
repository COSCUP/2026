<script setup lang="ts">
import type { SessionDifficulty, SessionSummary } from '#shared/types/session'
import { useI18n } from '#imports'
import CpTrackSessionBlock from './CpTrackSessionBlock.vue'

const { sessions } = defineProps<{
  sessions: SessionSummary[]
}>()

const { t, locale } = useI18n()
const route = useRoute()

// 時間軸尺寸。以「分鐘 → grid 列」為共同基準，刻度線與卡片同列才會對齊。
const SLOT_MINUTES = 5 // 一列代表的分鐘數，對齊 Pretalx 排程粒度
const ROW_HEIGHT = 16 // 一列高度 px；30 分鐘 = 6 列 = 96px，容得下兩行標題＋講者＋時間
const TIME_GUTTER = '2.75rem' // 左側時間欄寬度
const CARD_GAP = 2 // 相鄰卡片間的細縫 px

const DIFFICULTIES: SessionDifficulty[] = ['Elementary', 'Intermediate', 'Advanced', 'Professional']

const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en'))
const roomKey = computed(() => (localeKey.value === 'zh' ? 'zh-hant' : 'en') as 'zh-hant' | 'en')

function parseMinutes(iso: string) {
  const match = iso.match(/T(\d{2}):(\d{2})/)
  if (!match) {
    return null
  }
  return Number(match[1]) * 60 + Number(match[2])
}

function formatHour(minutes: number) {
  return `${Math.floor(minutes / 60)}:00`
}

function roomName(session: SessionSummary) {
  return session.room?.[roomKey.value] || session.room?.en
}

const rooms = computed(() => {
  const names = sessions
    .map((session) => roomName(session))
    .filter((name): name is string => Boolean(name))
  return [...new Set(names)].sort()
})

// 涵蓋全部場次、往外取整到整點，最少 9:00–18:00。
const range = computed(() => {
  let min = 9 * 60
  let max = 18 * 60
  for (const session of sessions) {
    if (session.start) {
      const start = parseMinutes(session.start)
      if (start !== null) {
        min = Math.min(min, start)
      }
    }
    if (session.end) {
      const end = parseMinutes(session.end)
      if (end !== null) {
        max = Math.max(max, end)
      }
    }
  }
  return {
    start: Math.floor(min / 60) * 60,
    end: Math.ceil(max / 60) * 60,
  }
})

const totalRows = computed(() => (range.value.end - range.value.start) / SLOT_MINUTES)

// 分鐘 → grid 列（1 起算）。
function toRow(minutes: number) {
  return Math.round((minutes - range.value.start) / SLOT_MINUTES) + 1
}

const hourMarks = computed(() => {
  const marks: { minutes: number, row: number }[] = []
  for (let m = range.value.start; m <= range.value.end; m += 60) {
    marks.push({ minutes: m, row: toRow(m) })
  }
  return marks
})

// 半點（如 11:30），畫虛線、不放標籤。
const halfHourMarks = computed(() => {
  const marks: { minutes: number, row: number }[] = []
  for (let m = range.value.start + 30; m < range.value.end; m += 60) {
    marks.push({ minutes: m, row: toRow(m) })
  }
  return marks
})

function roomSessions(room: string) {
  return sessions
    .filter((session) => roomName(session) === room && session.start && session.end)
    .map((session) => {
      const startMins = parseMinutes(session.start!)
      const endMins = parseMinutes(session.end!)
      if (startMins === null || endMins === null) {
        return null
      }

      const difficulty = session.tags.find((tag): tag is SessionDifficulty =>
        (DIFFICULTIES as string[]).includes(tag))

      return {
        id: session.id,
        startMins,
        title: session[localeKey.value].title,
        speaker: session.speakers.map((s) => s[localeKey.value].name).join(t('separator')),
        start: session.start!.slice(11, 16),
        end: session.end!.slice(11, 16),
        difficulty: difficulty ? t(`difficulty.${difficulty}`) : undefined,
        rowStart: toRow(startMins),
        rowEnd: toRow(endMins),
      }
    })
    .filter((session): session is NonNullable<typeof session> => session !== null)
    .sort((a, b) => a.startMins - b.startMins)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div
      v-for="room in rooms"
      :key="room"
      class="border border-gray-200 rounded-2xl overflow-hidden"
    >
      <div class="text-primary-500 font-medium px-5 py-3 bg-primary-50 flex gap-2 items-center">
        <Icon
          class="h-4 w-4"
          name="tabler:map-pin"
        />
        <span>{{ room }}</span>
      </div>

      <!-- 刻度線與卡片共用同一組 grid 列，故彼此對齊 -->
      <div
        class="px-5 py-4 grid"
        :style="{
          gridTemplateColumns: `${TIME_GUTTER} minmax(0, 1fr)`,
          gridTemplateRows: `repeat(${totalRows}, ${ROW_HEIGHT}px)`,
        }"
      >
        <!-- 整點：標籤＋實線 -->
        <template
          v-for="mark in hourMarks"
          :key="`h-${mark.minutes}`"
        >
          <div
            class="text-xs text-gray-400 pr-2 text-right self-start -translate-y-1/2"
            :style="{ gridColumn: 1, gridRow: mark.row }"
          >
            {{ formatHour(mark.minutes) }}
          </div>
          <div
            class="border-t border-gray-100 w-full self-start"
            :style="{ gridColumn: 2, gridRow: mark.row }"
          />
        </template>

        <!-- 半點：虛線 -->
        <div
          v-for="mark in halfHourMarks"
          :key="`hh-${mark.minutes}`"
          class="border-t border-gray-100 border-dashed w-full self-start"
          :style="{ gridColumn: 2, gridRow: mark.row }"
        />

        <NuxtLink
          v-for="session in roomSessions(room)"
          :key="session.id"
          class="min-w-0 block"
          :style="{
            gridColumn: 2,
            gridRow: `${session.rowStart} / ${session.rowEnd}`,
            paddingBottom: `${CARD_GAP}px`,
          }"
          :to="{ query: { ...route.query, session: session.id } }"
        >
          <CpTrackSessionBlock
            :difficulty="session.difficulty"
            :end="session.end"
            :speaker="session.speaker"
            :start="session.start"
            :title="session.title"
          />
        </NuxtLink>
      </div>
    </div>

    <p
      v-if="rooms.length === 0"
      class="text-gray-400 py-8 text-center"
    >
      {{ t('noSession') }}
    </p>
  </div>
</template>

<i18n lang="yaml">
  en:
    noSession: 'No sessions on this day.'
    separator: ', '
    difficulty:
      Elementary: 'Elementary'
      Intermediate: 'Intermediate'
      Advanced: 'Advanced'
      Professional: 'Professional'
  zh:
    noSession: '這天沒有議程。'
    separator: '、'
    difficulty:
      Elementary: '入門'
      Intermediate: '中階'
      Advanced: '進階'
      Professional: '專業'
</i18n>
