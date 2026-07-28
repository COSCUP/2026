<script setup lang="ts">
import { useI18n } from '#imports'

const props = defineProps<{
  title: string
  subtitle?: string
  count: number
  days: string[]
  rooms: string[]
  links: { label: string, url: string }[]
}>()

const { t } = useI18n()

const selectedDay = defineModel<string>({ required: true })

function formatDayLabel(day: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Taipei',
  })
    .format(new Date(`${day}T00:00:00+08:00`))
    .replace(' ', '.')
}

const activeDay = computed(() => selectedDay.value ?? props.days[0] ?? '')
</script>

<template>
  <header class="flex flex-col gap-5">
    <div class="flex gap-4 items-start justify-between">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl text-primary-700 font-bold sm:text-4xl">
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="text-gray-500"
        >
          {{ subtitle }}
        </p>
      </div>

      <span class="text-sm text-gray-600 font-medium px-3 py-1.5 rounded-full bg-gray-100 flex-shrink-0 whitespace-nowrap">
        {{ t('count', { count }) }}
      </span>
    </div>

    <div class="text-sm flex flex-wrap gap-x-6 gap-y-3 items-center">
      <!-- 議程日數 -->
      <div
        v-if="days.length"
        class="flex gap-2 items-center"
      >
        <span class="text-gray-500">{{ t('days') }}</span>
        <button
          v-for="day in days"
          :key="day"
          :aria-pressed="day === activeDay"
          class="text-sm font-medium px-3 py-1.5 border rounded-lg cursor-pointer transition-colors"
          :class="day === activeDay
            ? 'bg-primary-700 text-white border-primary-700'
            : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'"
          type="button"
          @click="selectedDay = day"
        >
          {{ formatDayLabel(day) }}
        </button>
      </div>

      <!-- 教室 -->
      <div
        v-if="rooms.length"
        class="text-gray-600 flex gap-1.5 items-center"
      >
        <Icon
          class="h-4 w-4"
          name="tabler:map-pin"
        />
        <span>{{ rooms.join(t('separator')) }}</span>
      </div>

      <!-- 社群連結 -->
      <div
        v-if="links.length"
        class="flex flex-wrap gap-2 items-center"
      >
        <span class="text-gray-500">{{ t('links') }}</span>
        <a
          v-for="link in links"
          :key="link.url"
          class="text-sm text-white font-medium px-3 py-1.5 rounded-lg bg-primary-400 inline-flex gap-1.5 transition-colors items-center hover:bg-primary-500"
          :href="link.url"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon
            class="h-4 w-4"
            name="tabler:external-link"
          />
          {{ link.label }}
        </a>
      </div>
    </div>
  </header>
</template>

<i18n lang="yaml">
  en:
    count: '{count} sessions'
    days: 'Days'
    links: 'Community'
    separator: ', '
  zh:
    count: '{count} 場議程'
    days: '議程日數'
    links: '社群連結'
    separator: '、'
</i18n>
