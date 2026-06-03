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

const { data } = await useFetch('/api/session')

const manualSelectedDay = ref<string | null>(null)
const days = computed(() => Object.keys(data?.value ?? {}).sort())

const selectedDay = computed({
  get: () => manualSelectedDay.value ?? days.value[0] ?? null,
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
      <!--
        On desktop, the selector will be at the top of the page.
        On mobile, it will be fixed to the bottom.
      -->
      <CpSessionDaySelector
        v-model="selectedDay"
        class="w-screen bottom-[env(safe-area-inset-bottom)] left-0 fixed z-10 sm:bottom-auto sm:sticky"
        :days="days"
      />

      <CpSessionFilterBar
        v-model:search-query="searchQuery"
        v-model:selected-room-ids="selectedRoomIds"
        v-model:selected-tag-ids="selectedTagIds"
        class="p-4 left-0 sticky z-10"
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
  zh:
    noSession: '尚未公布，敬請期待。'
</i18n>
