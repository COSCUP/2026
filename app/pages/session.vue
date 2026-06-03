<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CpFavoriteImportBanner from '~/components/feature/CpFavoriteImportBanner.vue'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionEmptyBanner from '~/components/feature/CpSessionEmptyBanner.vue'
import CpSessionFilterBar from '~/components/feature/CpSessionFilterBar.vue'
import CpSessionList from '~/components/feature/CpSessionList.vue'
import CpSessionShareButton from '~/components/feature/CpSessionShareButton.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'
import CpSessionViewToggle from '~/components/feature/CpSessionViewToggle.vue'
import { decodeFavorites, useFavorites } from '~/composables/useFavorites'
import { useSessionFilter } from '~/composables/useSessionFilter'

const { locale, t } = useI18n()

const { data } = await useFetch('/api/session')

const { isFavorite, setFavorites, favorites } = useFavorites()
const route = useRoute()
const router = useRouter()

const days = computed(() => Object.keys(data?.value ?? {}).sort())

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

const manualSelectedDay = ref<string | null>(null)
const selectedDay = computed({
  get: () => manualSelectedDay.value ?? firstSharedDay.value ?? days.value[0] ?? null,
  set: (value) => void (manualSelectedDay.value = value),
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

const view = ref<'all' | 'favorite'>('all')
const viewItems = computed(() => [
  { key: 'all', label: t('view.all') },
  { key: 'favorite', label: t('view.favorite'), icon: 'tabler:bookmark' },
])

// The favorites / shared view on top of the room/tag/search filters.
const displayedSessions = computed(() => {
  if (isSharing.value) {
    const shared = new Set(sharedSessionIds.value)
    return filteredSessions.value.filter((session) => shared.has(session.id))
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
  delete query.filter
  router.replace({ query })
  manualSelectedDay.value = null
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

definePageMeta({
  layout: 'session-table',
})
</script>

<template>
  <main v-if="selectedDay">
    <NuxtPage />

    <section class="mb-6">
      <div
        v-if="isSharing || isInvalidShare"
        class="px-4 pt-4 w-screen"
      >
        <CpFavoriteImportBanner
          :count="sharedSessionIds.length"
          :invalid="isInvalidShare"
          @dismiss="clearShare"
          @import="importShared"
        />
      </div>

      <!--
        On desktop, the selector will be at the top of the page.
        On mobile, it will be fixed to the bottom.
      -->
      <CpSessionDaySelector
        v-model="selectedDay"
        class="w-screen bottom-[env(safe-area-inset-bottom)] left-0 fixed z-10 sm:bottom-auto sm:sticky"
        :days="days"
      />

      <!-- Hidden while previewing a shared list. -->
      <CpSessionFilterBar
        v-if="!isSharing"
        v-model:search-query="searchQuery"
        v-model:selected-room-ids="selectedRoomIds"
        v-model:selected-tag-ids="selectedTagIds"
        class="p-4 left-0 sticky z-10"
        :room-options="roomOptions"
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
      <CpSessionTable
        v-if="displayedSessions.length > 0"
        class="hidden sm:grid"
        :column-width="200"
        :day="selectedDay"
        :interval="5"
        :preview="isSharing"
        :row-height="50"
        :sessions="displayedSessions"
        :time-range="['09:00', '17:30']"
      />

      <CpSessionEmptyBanner
        v-if="displayedSessions.length === 0"
        class="mx-4"
        :variant="emptyVariant"
      />
    </section>
  </main>
  <main v-else>
    <p>
      {{ t('noSession') }}
    </p>
  </main>
</template>

<i18n lang="yaml">
  en:
    noSession: 'Not announced yet, stay tuned.'
    view:
      all: 'Sessions'
      favorite: 'Favorites'
  zh:
    noSession: '尚未公布，敬請期待。'
    view:
      all: '議程'
      favorite: '收藏'
</i18n>
