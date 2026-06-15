<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionList from '~/components/feature/CpSessionList.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'
import CpNotFound from '~/components/shared/CpNotFound.vue'

const { data } = await useFetch('/api/session')
const route = useRoute()
const isSessionNotFound = ref(false)

const manualSelectedDay = ref<string | null>(null)
const days = computed(() => Object.keys(data?.value ?? {}).sort())

const selectedDay = computed({
  get: () => manualSelectedDay.value ?? days.value[0] ?? null,
  set: (value) => void (manualSelectedDay.value = value),
})

provide('setSessionNotFound', (value: boolean) => {
  isSessionNotFound.value = value
})

watch(() => route.params.id, (newId) => {
  if (!newId) {
    isSessionNotFound.value = false
  }
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
  <main>
    <NuxtPage />

    <ClientOnly>
      <template #fallback>
        <div
          v-if="!isSessionNotFound"
          class="flex flex-col-reverse sm:flex-col"
        >
          <!-- DaySelector -->
          <div class="px-6 pb-4 pt-3 flex w-screen justify-center">
            <div class="rounded-full bg-gray-200 h-12 w-1/2 animate-pulse" />
          </div>

          <!-- Session -->
          <div class="rounded-xl bg-gray-200 h-screen w-[var(--viewport-width,100vw)] animate-pulse" />
        </div>
      </template>

      <template v-if="!isSessionNotFound">
        <div v-if="selectedDay" class="flex flex-col-reverse sm:flex-col">
          <CpSessionDaySelector
            v-model="selectedDay"
            class="w-screen bottom-0 left-0 sticky z-10 sm:bottom-auto"
            :days="days"
          />

          <CpSessionList
            class="sm:hidden"
            :sessions="data?.[selectedDay] ?? []"
          />
          <CpSessionTable
            class="hidden sm:grid"
            :column-width="200"
            :day="selectedDay"
            :interval="5"
            :row-height="50"
            :sessions="data?.[selectedDay] ?? []"
            :time-range="['09:00', '17:30']"
          />
        </div>

        <div v-else class="flex flex-col min-h-[60vh] w-[100vw] items-center justify-center">
          <CpNotFound />
        </div>
      </template>
    </ClientOnly>
  </main>
</template>
