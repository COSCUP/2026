<script setup lang="ts">
import type { FilterOption } from '~/composables/useSessionFilter'
import CpGroupButton from '~/components/shared/CpGroupButton.vue'
import CpTextField from '~/components/shared/CpTextField.vue'
import CpSessionFilterDropdown from './CpSessionFilterDropdown.vue'

export type TableViewMode = 'track' | 'table'

defineProps<{
  tagOptions: FilterOption[]
  preview?: boolean
}>()

const viewMode = defineModel<TableViewMode>('viewMode', { default: () => 'track' })
const selectedTagIds = defineModel<string[]>('selectedTagIds', { default: () => [] })
const searchQuery = defineModel<string>('searchQuery', { default: '' })

const { t } = useI18n()

const desktopModeItems = computed<{ key: TableViewMode, label: string, icon: string }[]>(() => [
  { key: 'track', label: t('viewMode.track'), icon: 'tabler:layout-rows' },
  { key: 'table', label: t('viewMode.table'), icon: 'tabler:layout-columns' },
])

const mobileModeItems = computed<{ key: TableViewMode, label: string, icon: string, srOnlyLabel: boolean }[]>(() => [
  { key: 'track', label: t('viewMode.track'), icon: 'tabler:clock', srOnlyLabel: true },
  { key: 'table', label: t('viewMode.table'), icon: 'tabler:list-details', srOnlyLabel: true },
])
</script>

<template>
  <div class="flex flex-wrap gap-3 w-[var(--viewport-width,100vw)] items-stretch sm:flex-nowrap">
    <CpGroupButton
      v-model="viewMode"
      class="hidden md:inline-flex"
      :items="desktopModeItems"
    />

    <CpGroupButton
      v-model="viewMode"
      class="hidden sm:inline-flex md:hidden"
      :items="mobileModeItems"
    />

    <CpSessionFilterDropdown
      v-if="!preview"
      v-model="selectedTagIds"
      icon="tabler:tag"
      :options="tagOptions"
      type="tags"
    />

    <span class="flex-1" />

    <slot
      v-if="!preview"
      name="controls"
    />

    <CpTextField
      v-if="!preview"
      v-model="searchQuery"
      class="min-w-0 w-full order-first sm:flex-none sm:h-9 sm:w-60 sm:order-none"
      :clear-label="t('clear')"
      :placeholder="t('placeholder')"
    />
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
