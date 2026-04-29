<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'

const { t } = useI18n()

const { data } = await useFetch('/api/session')

const days = computed(() => Object.keys(data?.value ?? {}).sort())

const selectedDay = ref<string | null>(null)

watch(days, (newDays) => {
  if (selectedDay.value === null && newDays.length > 0) {
    selectedDay.value = newDays[0]!
  }
}, { immediate: true })
</script>

<template>
  <main>
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
