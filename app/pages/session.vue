<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionList from '~/components/feature/CpSessionList.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'

const { t } = useI18n()

const { data } = await useFetch('/api/session')

const manualSelectedDay = ref<string | null>(null)
const days = computed(() => Object.keys(data?.value ?? {}).sort())

const selectedDay = computed({
  get: () => manualSelectedDay.value ?? days.value[0] ?? null,
  set: (value) => void (manualSelectedDay.value = value),
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

    <div class="flex flex-col-reverse sm:flex-col">
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

    <p v-if="!data?.[selectedDay]?.length">
      {{ t('noSession') }}
    </p>
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
