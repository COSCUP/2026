<script setup lang="ts">
import CpBadge from '~/components/shared/CpBadge.vue'

defineProps<{
  title: string
  start: string
  end: string
  speaker: string
  room?: string
  tags: string[]
}>()
</script>

<template>
  <div class="text-primary-600 p-2 border border-primary-100 rounded bg-primary-50 relative">
    <div class="flex flex-col">
      <h3 class="text-base text-inherit font-normal my-1">
        {{ title }}
      </h3>
      <div class="my-1 flex gap-2 items-center">
        <CpBadge
          v-if="room && room.trim() !== ''"
          class="text-xs text-primary-700 bg-primary-200 !px-2 !py-0.5"
        >
          {{ room }}
        </CpBadge>
        <time class="text-base opacity-50">{{ start }} ~ {{ end }}</time>
      </div>
      <p class="text-sm my-1">
        {{ speaker }}
      </p>
      <p class="flex gap-1">
        <CpBadge
          v-for="tag in tags"
          :key="tag"
        >
          {{ tag }}
        </CpBadge>
      </p>
    </div>
  </div>
</template>
