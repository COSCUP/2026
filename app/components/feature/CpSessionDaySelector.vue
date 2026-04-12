<script setup lang="ts">
const props = defineProps<{
  days: string[]
  selectedDay?: string
}>()

const selectedDay = defineModel<string>()

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
  <div class="px-6 pb-4 pt-3 border-b border-primary-100 flex justify-center">
    <div class="flex flex-wrap gap-3 items-center justify-center">
      <button
        v-for="day in days"
        :key="day"
        class="text-2xl text-white font-bold px-8 py-2 border-3 rounded-full min-w-34 cursor-pointer italic shadow-[0_4px_0_0_var(--un-shadow-color)] transition-colors"
        :class="day === activeDay
          ? 'border-primary-700 bg-primary-400 shadow-primary-700'
          : 'border-primary-700 bg-gray-200 shadow-primary-700'"
        type="button"
        @click="selectedDay = day"
      >
        {{ formatDayLabel(day) }}
      </button>
    </div>
  </div>
</template>
