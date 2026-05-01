<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'

const { t } = useI18n()

const { data } = await useFetch('/api/session')

const manualSelectedDay = ref<string | null>(null)
const days = computed(() => Object.keys(data?.value ?? {}).sort())

const selectedDay = computed({
  get: () => manualSelectedDay.value ?? days.value[0] ?? null,
  set: (value) => void (manualSelectedDay.value = value),
})
</script>

<template>
  <main>
    <NuxtPage />
    <template v-if="selectedDay">
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
    </template>
    <p v-else>
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
