<script setup lang="ts">
import { onClickOutside, useToggle } from '@vueuse/core'

const props = defineProps<{
  label: string
  items: { label: string, path: string }[]
}>()

const [open, toggle] = useToggle(false)
const containerRef = ref<HTMLElement>()

onClickOutside(containerRef, () => {
  open.value = false
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative"
  >
    <button
      class="flex gap-1 whitespace-nowrap items-center"
      type="button"
      @click="toggle()"
    >
      {{ label }}
      <Icon
        class="transition-transform"
        :class="open ? 'rotate-180' : ''"
        name="tabler:chevron-down"
        size="16"
      />
    </button>
    <ul
      v-if="open"
      class="mt-1 py-1 border border-gray-200 rounded-md bg-white min-w-32 shadow-md left-0 absolute z-dropdown"
    >
      <li
        v-for="item in props.items"
        :key="item.path"
      >
        <NuxtLinkLocale
          class="px-4 py-2 block whitespace-nowrap hover:bg-gray-50"
          :to="item.path"
          @click="open = false"
        >
          {{ item.label }}
        </NuxtLinkLocale>
      </li>
    </ul>
  </div>
</template>
