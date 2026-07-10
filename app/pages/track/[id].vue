<script setup lang="ts">
import type { SessionSummary, TrackDetail } from '#shared/types/session'
import { useI18n } from 'vue-i18n'
import CpTrackHeader from '~/components/feature/CpTrackHeader.vue'
import CpTrackSchedule from '~/components/feature/CpTrackSchedule.vue'
import CpTrackSessionPanel from '~/components/feature/CpTrackSessionPanel.vue'
import { getTrackMeta } from '~/data/trackMeta'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const { data } = await useFetch<TrackDetail>(`/api/track/${route.params.id}`)

const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en'))
const meta = computed(() => getTrackMeta(Number(route.params.id)))

const title = computed(() =>
  data.value?.name[localeKey.value === 'zh' ? 'zh-hant' : 'en'] ||
  data.value?.name.en ||
  '')

const description = computed(() =>
  data.value?.description[localeKey.value === 'zh' ? 'zh-hant' : 'en'] ||
  data.value?.description.en ||
  '')

const subtitle = computed(() => meta.value.subtitle?.[localeKey.value])
const announcement = computed(() => meta.value.announcement?.[localeKey.value])
const links = computed(() =>
  (meta.value.links ?? []).map((link) => ({ label: link.label[localeKey.value], url: link.url })))

const days = computed(() => Object.keys(data.value?.sessions ?? {}).sort())
const count = computed(() =>
  Object.values(data.value?.sessions ?? {}).reduce((sum, list) => sum + list.length, 0))

const manualSelectedDay = ref<string | null>(null)
const selectedDay = computed({
  get: () => {
    if (manualSelectedDay.value && days.value.includes(manualSelectedDay.value)) {
      return manualSelectedDay.value
    }
    return days.value[0] ?? ''
  },
  set: (value) => void (manualSelectedDay.value = value),
})

const daySessions = computed<SessionSummary[]>(() => data.value?.sessions[selectedDay.value] ?? [])

const dayIndex = computed(() => {
  const idx = days.value.indexOf(selectedDay.value)
  return idx >= 0 ? idx + 1 : 1
})

// 被展開的議程（由 query string ?session=<id> 控制），直接展開成側邊面板。
const allSessions = computed(() => Object.values(data.value?.sessions ?? {}).flat())
const selectedSession = computed(() =>
  allSessions.value.find((session) => session.id === route.query.session) ?? null)

function closeSession() {
  const query = { ...route.query }
  delete query.session
  router.replace({ query })
}

const dayRooms = computed(() => {
  const key = localeKey.value === 'zh' ? 'zh-hant' : 'en'
  const names = daySessions.value
    .map((session) => session.room?.[key] || session.room?.en)
    .filter((name): name is string => Boolean(name))
  return [...new Set(names)].sort()
})

const allRooms = computed(() => {
  const key = localeKey.value === 'zh' ? 'zh-hant' : 'en'
  const names = Object.values(data.value?.sessions ?? {})
    .flat()
    .map((session) => session.room?.[key] || session.room?.en)
    .filter((name): name is string => Boolean(name))
  return [...new Set(names)].sort()
})

function formatFullDate(day: string) {
  if (!day) {
    return ''
  }
  return new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Taipei',
  }).format(new Date(`${day}T00:00:00+08:00`))
}

useSeoMeta({
  title: () => title.value,
  description: () => subtitle.value || description.value,
  ogTitle: () => title.value,
  ogDescription: () => subtitle.value || description.value,
  twitterTitle: () => title.value,
  twitterDescription: () => subtitle.value || description.value,
})
</script>

<template>
  <article
    v-if="data"
    class="mx-auto flex flex-col gap-6 max-w-3xl"
  >
    <NuxtLink
      class="text-sm text-gray-500 inline-flex gap-1.5 w-fit transition-colors items-center hover:text-primary-500"
      :to="localePath('/track')"
    >
      <Icon
        class="h-4 w-4"
        name="tabler:arrow-left"
      />
      {{ t('back') }}
    </NuxtLink>

    <CpTrackHeader
      v-model="selectedDay"
      :count="count"
      :days="days"
      :links="links"
      :rooms="allRooms"
      :subtitle="subtitle"
      :title="title"
    />

    <hr class="border-gray-200">

    <div
      v-if="announcement"
      class="text-sm text-gray-700 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 flex gap-3 items-center"
    >
      <Icon
        class="text-primary-400 flex-shrink-0 h-5 w-5"
        name="tabler:speakerphone"
      />
      <span>{{ announcement }}</span>
    </div>

    <div
      v-if="description"
      class="text-gray-700 leading-relaxed break-words"
    >
      <MDC :value="description" />
    </div>

    <section
      v-if="selectedDay"
      class="flex flex-col gap-4"
    >
      <div>
        <h2 class="text-2xl text-primary-700 font-bold">
          {{ t('day', { n: dayIndex }) }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ formatFullDate(selectedDay) }}
          <template v-if="dayRooms.length">
            · {{ dayRooms.join(t('separator')) }}
          </template>
        </p>
      </div>

      <CpTrackSchedule :sessions="daySessions" />
    </section>

    <ClientOnly>
      <CpTrackSessionPanel
        v-if="selectedSession"
        :session="selectedSession"
        @close="closeSession"
      />
    </ClientOnly>
  </article>

  <p
    v-else
    class="text-gray-500 py-20 text-center"
  >
    {{ t('notFound') }}
  </p>
</template>

<i18n lang="yaml">
  en:
    back: 'Back to tracks'
    day: 'Day {n}'
    notFound: 'Track not found.'
    separator: ', '
  zh:
    back: '返回議程軌列表'
    day: '第 {n} 天'
    notFound: '找不到這個議程軌。'
    separator: '、'
</i18n>
