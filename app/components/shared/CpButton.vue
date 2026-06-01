<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'basic'
  active?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  active: false,
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  if (props.variant === 'primary') {
    return 'bg-primary-400 text-white hover:enabled:bg-primary-500'
  }

  if (props.variant === 'secondary') {
    return 'border border-primary-400 bg-white text-primary-400 hover:enabled:bg-primary-50'
  }

  return props.active
    ? 'bg-primary-50 text-primary-600'
    : 'bg-transparent text-gray-500 hover:enabled:bg-gray-200 active:enabled:bg-gray-300'
})
</script>

<template>
  <button
    class="text-base leading-none font-normal px-4 py-3 outline-0 border-0 rounded-md flex gap-2 min-h-12 w-max transition-all duration-200 ease-in-out items-center justify-center sm:text-sm sm:px-2.5 sm:py-2 disabled:opacity-65 sm:gap-1 sm:min-h-9 enabled:cursor-pointer disabled:cursor-not-allowed disabled:transform-none active:enabled:translate-y-0 hover:enabled:-translate-y-px"
    :class="variantClasses"
    :disabled="disabled"
    :type="type"
    @click="emit('click', $event)"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>
