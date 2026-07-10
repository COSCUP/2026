<script setup lang="ts">
import type { FilterOption } from '~/composables/useSessionFilter'
import CpTextField from '~/components/shared/CpTextField.vue'
import CpSessionFilterDropdown from './CpSessionFilterDropdown.vue'
import CpSessionViewToggle from './CpSessionViewToggle.vue'

export type TableViewMode = 'track' | 'table'

defineProps<{
  tagOptions: FilterOption[]
}>()

const viewMode = defineModel<TableViewMode>('viewMode', { default: () => 'track' })
const selectedTagIds = defineModel<string[]>('selectedTagIds', { default: () => [] })
const searchQuery = defineModel<string>('searchQuery', { default: '' })

const { t } = useI18n()

const viewModeItems = computed<{ key: TableViewMode, label: string, icon: string }[]>(() => [
  { key: 'track', label: t('viewMode.track'), icon: 'tabler:layout-rows' },
  { key: 'table', label: t('viewMode.table'), icon: 'tabler:layout-columns' },
])
</script>

<template>
  <div class="flex flex-col gap-3 w-[var(--viewport-width,100vw)] items-stretch sm:flex-row sm:items-center sm:justify-between">
    <div class="flex shrink-0 gap-3 items-center justify-center sm:justify-start">
      <CpSessionViewToggle
        v-model="viewMode"
        class="hidden sm:inline-flex"
        :items="viewModeItems"
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
  viewMode:
    track: 'By Track'
    table: 'By Room'
  placeholder: 'Search sessions…'
  clear: 'Clear search'
zh:
  viewMode:
    track: '依議程軌'
    table: '依教室'
  placeholder: '搜尋議程……'
  clear: '清除搜尋'
</i18n>
