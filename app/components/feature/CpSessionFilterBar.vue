<script setup lang="ts">
import type { FilterOption } from '~/composables/useSessionFilter'
import CpSessionFilterDropdown from './CpSessionFilterDropdown.vue'
import CpSessionSearchField from './CpSessionSearchField.vue'

defineProps<{
  roomOptions: FilterOption[]
  tagOptions: FilterOption[]
}>()

const selectedRoomIds = defineModel<string[]>('selectedRoomIds', { default: () => [] })
const selectedTagIds = defineModel<string[]>('selectedTagIds', { default: () => [] })
const searchQuery = defineModel<string>('searchQuery', { default: '' })
</script>

<template>
  <div class="flex flex-col gap-3 w-[var(--viewport-width,100vw)] items-stretch sm:flex-row sm:items-center sm:justify-between">
    <div class="flex shrink-0 gap-3 items-center justify-center sm:justify-start">
      <CpSessionFilterDropdown
        v-model="selectedRoomIds"
        icon="tabler:map-pin"
        :options="roomOptions"
        type="rooms"
      />
      <CpSessionFilterDropdown
        v-model="selectedTagIds"
        icon="tabler:tag"
        :options="tagOptions"
        type="tags"
      />
    </div>

    <CpSessionSearchField
      v-model="searchQuery"
      class="min-w-0 w-full sm:flex-none sm:h-9 sm:w-80"
    />
  </div>
</template>
