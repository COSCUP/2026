<script setup lang="ts">
import type { SessionSummary } from '#shared/types/session'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'

const { data } = await useFetch<Record<string, SessionSummary[]>>('/api/session')

const days = computed(() => Object.keys(data?.value ?? {}).sort())
</script>

<template>
  <main>
    <div class="px-6 pb-4 border-b border-primary-100 flex gap-2">
      <button
        v-for="day in days"
        :key="day"
        class="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
      >
        {{ day }}
      </button>
    </div>
    <CpSessionTable
      :day="days[0]!"
      :interval="5"
      :row-height="50"
      :sessions="data?.[days[0]!] ?? []"
      :time-range="['09:00', '17:30']"
    />
  </main>
</template>
