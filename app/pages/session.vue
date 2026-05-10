<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { prerenderRoutes } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import CpSessionDaySelector from '~/components/feature/CpSessionDaySelector.vue'
import CpSessionList from '~/components/feature/CpSessionList.vue'
import CpSessionTable from '~/components/feature/CpSessionTable.vue'

const { t } = useI18n()

const breakpoints = useBreakpoints(breakpointsTailwind)

const { data } = await useFetch('/api/session')
const isMobile = breakpoints.smaller('sm')

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
</script>

<template>
  <main v-if="selectedDay">
    <NuxtPage />

    <ClientOnly>
      <div
        class="flex"
        :class="isMobile ? 'flex-col-reverse' : 'flex-col'"
      >
        <CpSessionDaySelector
          v-model="selectedDay"
          class="bottom-0 sticky z-10"
          :days="days"
        />

        <CpSessionList
          v-if="isMobile"
          :sessions="data?.[selectedDay] ?? []"
        />
        <CpSessionTable
          v-else
          :day="selectedDay"
          :interval="5"
          :row-height="50"
          :sessions="data?.[selectedDay] ?? []"
          :time-range="['09:00', '17:30']"
        />
      </div>
    </ClientOnly>

    <p v-if="!data?.[selectedDay]">
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
