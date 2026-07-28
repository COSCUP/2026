<script setup lang="ts">
const props = defineProps<{ days: string[] }>()

const selectedDay = defineModel<string | null>({ required: true })

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
  <div class="px-6 pb-4 pt-3 flex justify-center">
    <div class="flex flex-wrap gap-2 items-center justify-center">
      <button
        v-for="day in days"
        :key="day"
        class="text-base leading-6 font-medium px-[17px] py-[9px] border rounded-[2px] cursor-pointer transition-colors"
        :class="day === activeDay
          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
          : 'bg-[#faf9f7] text-[#1a1a1a] border-[rgba(26,26,26,0.12)]'"
        type="button"
        @click="selectedDay = day"
      >
        {{ formatDayLabel(day) }}
      </button>
    </div>
  </div>
</template>
