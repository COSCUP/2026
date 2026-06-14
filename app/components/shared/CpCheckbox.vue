<script setup lang="ts">
defineProps<{
  name: string
}>()

const checked = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="text-base text-gray-600 leading-normal inline-flex gap-2 min-h-10 cursor-pointer select-none items-center sm:text-sm sm:gap-1 sm:min-h-6">
    <input
      v-model="checked"
      class="m-0 accent-primary-400 shrink-0 h-5 w-5 cursor-pointer sm:h-4 sm:w-4"
      :name="name"
      type="checkbox"
    >
    <slot />
  </label>
</template>
