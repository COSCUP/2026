<script setup lang="ts">
withDefaults(defineProps<{
  placeholder?: string
  clearLabel?: string
}>(), {
  placeholder: '',
  clearLabel: 'Clear',
})

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="px-4 py-3 border border-gray-300 rounded-md bg-white flex gap-2 min-h-12 min-w-0 w-full transition-colors duration-200 ease-in-out items-center sm:px-2 sm:py-1.5 focus-within:border-gray-600 sm:gap-1 sm:min-h-0">
    <slot name="prefix-icon">
      <Icon
        class="text-gray-400 shrink-0"
        name="tabler:search"
        size="18"
      />
    </slot>

    <input
      v-model="model"
      class="text-base text-gray-500 leading-none outline-0 border-0 bg-transparent flex-1 min-w-0 sm:text-sm placeholder:text-gray-400"
      :placeholder="placeholder"
      type="text"
    >

    <button
      v-if="model"
      :aria-label="clearLabel"
      class="text-gray-400 p-0 border-0 bg-transparent flex shrink-0 cursor-pointer items-center justify-center hover:text-gray-700"
      type="button"
      @click="model = ''"
    >
      <Icon
        name="tabler:x"
        size="16"
      />
    </button>
  </label>
</template>
