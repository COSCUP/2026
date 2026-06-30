<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionEmptyBanner from '~/components/feature/CpSessionEmptyBanner.vue'
import CpSessionFilterBar from '~/components/feature/CpSessionFilterBar.vue'
import CpSessionList from '~/components/feature/CpSessionList.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'
import { useSessionFilter } from '~/composables/useSessionFilter'

const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()

const { data } = await useFetch('/api/session')

const days = computed(() => Object.keys(data?.value ?? {}).sort())
const queryDay = computed(() => {
  const day = route.query.day
  return typeof day === 'string' && days.value.includes(day) ? day : null
})

const selectedDay = computed({
  get: () => queryDay.value ?? days.value[0] ?? null,
  set: (value) => {
    const nextQuery = { ...route.query }

    if (value && days.value.includes(value)) {
      nextQuery.day = value
    } else {
      delete nextQuery.day
    }

    if (nextQuery.day === route.query.day) {
      return
    }

    void router.replace({ query: nextQuery })
  },
})

watchEffect(() => {
  if (route.query.day && !queryDay.value) {
    const nextQuery = { ...route.query }
    delete nextQuery.day
    void router.replace({ query: nextQuery })
  }
})

const {
  searchQuery,
  filteredSessions,
  roomOptions,
  tagOptions,
  selectedRoomIds,
  selectedTagIds,
} = useSessionFilter({
  sessionsByDay: data,
  selectedDay,
  locale,
})

prerenderRoutes(
  Object.values(data.value ?? {})
    .flat()
    .map((s) => `/session/${s.id}`),
)

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  twitterTitle: () => t('meta.title'),
  twitterDescription: () => t('meta.description'),
})

definePageMeta({
  layout: 'session-table',
})
</script>

<template>
  <main>
    <NuxtPage />

    <ClientOnly>
      <template #fallback>
        <div class="flex flex-col">
          <!-- DaySelector -->
          <div class="px-6 pb-4 pt-3 flex w-[var(--viewport-width,100vw)] justify-center order-last sm:order-none">
            <div class="rounded-full bg-gray-200 h-12 w-1/2 animate-pulse" />
          </div>

          <!-- FilterBar -->
          <div class="p-4 flex flex-col gap-3 w-[var(--viewport-width,100vw)] items-stretch left-0 sticky z-sticky sm:flex-row sm:items-center sm:justify-between">
            <div class="flex shrink-0 gap-3 items-center justify-center sm:justify-start">
              <div class="rounded-md bg-gray-200 h-12 w-18 animate-pulse sm:h-9" />
              <div class="rounded-md bg-gray-200 h-12 w-18 animate-pulse sm:h-9" />
            </div>

            <div class="rounded-md bg-gray-200 h-12 w-full animate-pulse sm:flex-none sm:h-9 sm:w-80" />
          </div>

          <!-- Session -->
          <div class="rounded-xl bg-gray-200 h-screen w-[var(--viewport-width,100vw)] animate-pulse" />
        </div>
      </template>

      <template v-if="selectedDay">
        <div class="flex flex-col">
          <CpSessionDaySelector
            v-model="selectedDay"
            class="w-[var(--viewport-width,100vw)] bottom-0 left-0 order-last sticky z-sticky sm:bottom-auto sm:order-none"
            :days="days"
          />

          <CpSessionFilterBar
            v-model:search-query="searchQuery"
            v-model:selected-room-ids="selectedRoomIds"
            v-model:selected-tag-ids="selectedTagIds"
            class="p-4 left-0 sticky z-sticky"
            :room-options="roomOptions"
            :tag-options="tagOptions"
          />

          <CpSessionList
            v-if="filteredSessions.length > 0"
            class="sm:hidden"
            :sessions="filteredSessions"
          />
          <CpSessionTable
            v-if="filteredSessions.length > 0"
            class="hidden sm:grid"
            :column-width="200"
            :day="selectedDay"
            :interval="5"
            :row-height="50"
            :sessions="filteredSessions"
            :time-range="['09:00', '17:30']"
          />

          <CpSessionEmptyBanner
            v-if="filteredSessions.length === 0"
            class="mx-4"
          />
        </div>
      </template>

      <p v-else>
        {{ t('noSession') }}
      </p>
    </ClientOnly>
  </main>
</template>

<i18n lang="yaml">
  en:
    noSession: 'Not announced yet, stay tuned.'
    meta:
      title: 'Sessions'
      description: 'Browse the full session schedule for COSCUP 2026 x UbuCon Asia.'
  zh:
    noSession: '尚未公布，敬請期待。'
    meta:
      title: '議程'
      description: '瀏覽 COSCUP 2026 x UbuCon Asia 的完整議程時間表。'
</i18n>
