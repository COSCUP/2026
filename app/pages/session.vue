<script setup lang="ts">
import type { TableViewMode } from '~/components/feature/CpSessionFilterBar.vue'
import { useStorage } from '@vueuse/core'
import { prerenderRoutes } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from '#imports'
import CpFavoriteImportBanner from '~/components/feature/CpFavoriteImportBanner.vue'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionEmptyBanner from '~/components/feature/CpSessionEmptyBanner.vue'
import CpSessionFilterBar from '~/components/feature/CpSessionFilterBar.vue'
import CpSessionList from '~/components/feature/CpSessionList.vue'
import CpSessionShareButton from '~/components/feature/CpSessionShareButton.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'
import CpSessionTrackTable from '~/components/feature/CpSessionTrackTable.vue'
import CpSessionViewToggle from '~/components/feature/CpSessionViewToggle.vue'
import { decodeFavorites, provideFavorites } from '~/composables/useFavorites'
import { useSessionFilter } from '~/composables/useSessionFilter'

const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()

const { data } = await useFetch('/api/session')
const { isFavorite, setFavorites, favorites } = provideFavorites()

const days = computed(() => Object.keys(data?.value ?? {}).sort())
const queryDay = computed(() => {
  const day = route.query.day
  return typeof day === 'string' && days.value.includes(day) ? day : null
})

// A `?filter=` link carries someone else's favorites, to preview and import.
const hasShareLink = computed(() => String(route.query.filter ?? '').length > 0)
const sharedIds = computed(() => decodeFavorites(String(route.query.filter ?? '')))

const allSessionIds = computed(
  () => new Set(Object.values(data?.value ?? {}).flat().map((session) => session.id)),
)
const sharedSessionIds = computed(() => sharedIds.value.filter((id) => allSessionIds.value.has(id)))

// A link resolving to no real session is broken: show an error, don't import.
const isSharing = computed(() => sharedSessionIds.value.length > 0)
const isInvalidShare = computed(() => hasShareLink.value && sharedSessionIds.value.length === 0)

// Jump to the first day holding a shared session so the preview isn't empty.
const firstSharedDay = computed(() => {
  if (!isSharing.value) {
    return null
  }
  const shared = new Set(sharedSessionIds.value)
  return days.value.find((day) => (data?.value?.[day] ?? []).some((s) => shared.has(s.id))) ?? null
})

const selectedDay = computed({
  get: () => queryDay.value ?? firstSharedDay.value ?? days.value[0] ?? null,
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
  daySessions,
  filteredSessions,
  tagOptions,
  selectedTagIds,
} = useSessionFilter({
  sessionsByDay: data,
  selectedDay,
  locale,
})

// Persist the table/track choice across refreshes and language switches. localStorage is
// shared across the /en and /zh routes, and this toggle only renders inside <ClientOnly>.
const viewMode = useStorage<TableViewMode>('coscup-session-view-mode', 'track')

type SessionView = 'all' | 'favorite'
const view = ref<SessionView>('all')
const viewItems = computed<{ key: SessionView, label: string, icon?: string }[]>(() => [
  { key: 'all', label: t('view.all') },
  { key: 'favorite', label: t('view.favorite'), icon: 'tabler:bookmark' },
])

// The favorites / shared view on top of the room/tag/search filters.
const displayedSessions = computed(() => {
  if (isSharing.value) {
    // From unfiltered sessions: the filter bar is hidden while sharing, so a
    // leftover filter must not hide valid shared sessions.
    const shared = new Set(sharedSessionIds.value)
    return daySessions.value.filter((session) => shared.has(session.id))
  }
  if (view.value === 'favorite') {
    return filteredSessions.value.filter((session) => isFavorite(session.id))
  }
  return filteredSessions.value
})

const emptyVariant = computed<'filter' | 'favorite' | 'shared'>(() => {
  if (isSharing.value) {
    return 'shared'
  }
  return view.value === 'favorite' ? 'favorite' : 'filter'
})

function clearShare() {
  const query = { ...route.query }
  const day = selectedDay.value

  // Pin the current day before the share query disappears; otherwise selectedDay
  // falls back to days[0], which may hold none of the imported sessions.
  if (day && days.value.includes(day)) {
    query.day = day
  }

  delete query.filter
  void router.replace({ query })
}

function importShared() {
  setFavorites(sharedSessionIds.value)
  clearShare()
  view.value = 'favorite'
}

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
          <div class="p-4 flex flex-col gap-3 w-[var(--viewport-width,100vw)] items-stretch sm:flex-row sm:items-center sm:left-0 sm:justify-between sm:sticky sm:z-sticky">
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
          <!-- A `?filter=` link carries shared favorites: preview them and offer import. -->
          <div
            v-if="isSharing || isInvalidShare"
            class="px-4 pt-4 w-[var(--viewport-width,100vw)]"
          >
            <CpFavoriteImportBanner
              :count="sharedSessionIds.length"
              :invalid="isInvalidShare"
              @dismiss="clearShare"
              @import="importShared"
            />
          </div>

          <CpSessionDaySelector
            v-model="selectedDay"
            class="w-[var(--viewport-width,100vw)] bottom-0 left-0 order-last sticky z-sticky sm:bottom-auto sm:order-none"
            :days="days"
          />

          <CpSessionFilterBar
            v-model:search-query="searchQuery"
            v-model:selected-tag-ids="selectedTagIds"
            v-model:view-mode="viewMode"
            class="p-4 sm:left-0 sm:sticky sm:z-sticky"
            :tag-options="tagOptions"
          >
            <template #controls>
              <!-- Mobile: toggle, then share. Desktop: share, then toggle. -->
              <div class="flex gap-3 items-center sm:flex-row-reverse">
                <CpSessionViewToggle
                  v-model="view"
                  :items="viewItems"
                />
                <CpSessionShareButton v-if="view === 'favorite' && favorites.size > 0" />
              </div>
            </template>
          </CpSessionFilterBar>

          <CpSessionList
            v-if="displayedSessions.length > 0"
            class="sm:hidden"
            :preview="isSharing"
            :sessions="displayedSessions"
          />
          <CpSessionTrackTable
            v-if="displayedSessions.length > 0 && viewMode !== 'table'"
            class="hidden sm:grid"
            :column-width="20"
            :day="selectedDay"
            :interval="5"
            :preview="isSharing"
            :row-height="80"
            :sessions="displayedSessions"
            :time-range="['09:00', '17:30']"
          />
          <CpSessionTable
            v-if="displayedSessions.length > 0 && viewMode === 'table'"
            class="hidden sm:grid"
            :column-width="180"
            :day="selectedDay"
            :interval="5"
            :preview="isSharing"
            :row-height="10"
            :sessions="displayedSessions"
            :time-range="['09:00', '17:30']"
          />

          <CpSessionEmptyBanner
            v-if="displayedSessions.length === 0"
            class="mx-4"
            :variant="emptyVariant"
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
      description: 'Browse the full session schedule for COSCUP x UbuCon Asia 2026.'
    view:
      all: 'Sessions'
      favorite: 'Favorites'
  zh:
    noSession: '尚未公布，敬請期待。'
    meta:
      title: '議程'
      description: '瀏覽 COSCUP x UbuCon Asia 2026 的完整議程時間表。'
    view:
      all: '議程'
      favorite: '收藏'
</i18n>
