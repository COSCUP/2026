<script setup lang="ts">
import type { FilterOption } from '~/composables/useSessionFilter'
import CpTextField from '~/components/shared/CpTextField.vue'
import CpSessionFilterDropdown from './CpSessionFilterDropdown.vue'

defineProps<{
  roomOptions: FilterOption[]
  tagOptions: FilterOption[]
}>()

const selectedRoomIds = defineModel<string[]>('selectedRoomIds', { default: () => [] })
const selectedTagIds = defineModel<string[]>('selectedTagIds', { default: () => [] })
const searchQuery = defineModel<string>('searchQuery', { default: '' })

const { t } = useI18n()
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

    <!-- Controls below the search field on mobile, to its left on desktop. -->
    <div class="flex flex-col-reverse gap-3 items-center sm:flex-row sm:items-center">
      <slot name="controls" />

      <CpTextField
        v-model="searchQuery"
        class="min-w-0 w-full sm:flex-none sm:h-9 sm:w-80"
        :clear-label="t('clear')"
        :placeholder="t('placeholder')"
      />
    </div>
  </div>
</template>

<i18n lang="yaml">
  en:
    placeholder: 'Search sessions…'
    clear: 'Clear search'
  zh:
    placeholder: '搜尋議程……'
    clear: '清除搜尋'
</i18n>
