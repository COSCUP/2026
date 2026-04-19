<script setup lang="ts">
import type { SessionSummary } from '#shared/types/session'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'

const { data } = await useFetch<Record<string, SessionSummary[]>>('/api/session')

const days = computed(() => Object.keys(data?.value ?? {}).sort())

const selectedDay = ref(days.value[0]!)
</script>

<template>
  <main>
    <NuxtPage />

    <CpSessionDaySelector
      v-model="selectedDay"
      :days="days"
    />
    <CpSessionTable
      :day="selectedDay"
      :interval="5"
      :row-height="50"
      :sessions="data?.[selectedDay] ?? []"
      :time-range="['09:00', '17:30']"
    />
  </main>
</template>
