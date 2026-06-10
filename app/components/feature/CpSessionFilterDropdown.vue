<script setup lang="ts">
import { onClickOutside, useToggle } from '@vueuse/core'
import CpButton from '~/components/shared/CpButton.vue'
import CpCheckbox from '~/components/shared/CpCheckbox.vue'
import CpTextField from '~/components/shared/CpTextField.vue'

interface FilterOption {
  id: string
  label: string
}

const props = defineProps<{
  type: 'rooms' | 'tags'
  icon: string
  options: FilterOption[]
}>()

const selectedIds = defineModel<string[]>({ default: () => [] })
const { t } = useI18n()

const [open, toggleOpen] = useToggle(false)
const containerRef = ref<HTMLElement>()
const searchQuery = ref('')

onClickOutside(containerRef, () => {
  open.value = false
})

const selectedLabels = computed(() => {
  const selected = new Set(selectedIds.value)
  return props.options
    .filter((option) => selected.has(option.id))
    .map((option) => option.label)
})

const hasSelection = computed(() => selectedLabels.value.length > 0)
const label = computed(() => t(`${props.type}.label`))
const triggerLabel = computed(() => hasSelection.value ? selectedLabels.value.join(', ') : label.value)

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  if (!query) {
    return props.options
  }

  return props.options.filter((option) => option.label.toLocaleLowerCase().includes(query))
})

function isSelected(id: string) {
  return selectedIds.value.includes(id)
}

function setSelected(id: string, checked: boolean) {
  const next = new Set(selectedIds.value)

  if (checked) {
    next.add(id)
  } else {
    next.delete(id)
  }

  selectedIds.value = Array.from(next)
}

function clearSelection() {
  selectedIds.value = []
}
</script>

<template>
  <div
    ref="containerRef"
    class="session-filter-popover shrink-0 relative"
  >
    <div class="popover-trigger relative">
      <CpButton
        :active="hasSelection"
        class="max-w-[9.5rem] sm:max-w-64"
        :class="{ 'pr-7': hasSelection }"
        type="button"
        variant="basic"
        @click="toggleOpen()"
      >
        <template #icon>
          <Icon
            :name="icon"
            size="18"
          />
        </template>
        <span class="min-w-0 truncate">{{ triggerLabel }}</span>
      </CpButton>
      <button
        v-if="hasSelection"
        :aria-label="t(`${type}.clear`)"
        class="text-primary-600 border border-gray-300 rounded-full bg-white flex h-4 w-4 cursor-pointer items-center justify-center absolute -right-2 -top-2 after:absolute after:-inset-2"
        type="button"
        @click.stop="clearSelection"
      >
        <Icon
          name="tabler:x"
          size="13"
        />
      </button>
    </div>

    <div
      v-if="open"
      class="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 flex flex-col gap-2 max-w-[calc(100vw-32px)] w-72 shadow-md left-1/2 absolute z-dropdown sm:p-2 sm:gap-1 sm:max-w-[calc(100vw-64px)] -translate-x-1/2 sm:translate-x-0 sm:left-0"
    >
      <CpTextField
        v-model="searchQuery"
        class="sm:h-8"
        :clear-label="t(`${type}.clear`)"
        :placeholder="t(`${type}.search`)"
      />

      <div class="my-1 bg-gray-300 h-px" />

      <div class="px-1.5 flex flex-col gap-1 max-h-[50vh] overflow-y-auto sm:gap-2">
        <CpCheckbox
          v-for="option in filteredOptions"
          :key="option.id"
          :model-value="isSelected(option.id)"
          :name="option.id"
          @update:model-value="setSelected(option.id, $event)"
        >
          <span>{{ option.label }}</span>
        </CpCheckbox>

        <p
          v-if="filteredOptions.length === 0"
          class="text-sm text-gray-400 px-1.5 py-3 text-center"
        >
          {{ t('noOptions') }}
        </p>
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
  en:
    rooms:
      label: 'Rooms'
      search: 'Search rooms…'
      clear: 'Clear room filters'
    tags:
      label: 'Tags'
      search: 'Search tags…'
      clear: 'Clear tag filters'
    noOptions: 'No options'
  zh:
    rooms:
      label: '教室'
      search: '搜尋教室……'
      clear: '清除教室篩選'
    tags:
      label: '標籤'
      search: '搜尋標籤……'
      clear: '清除標籤篩選'
    noOptions: '沒有選項'
</i18n>
