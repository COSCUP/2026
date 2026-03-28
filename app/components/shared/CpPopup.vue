<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import useToggle from '~/composables/useToggle'

const { isOpen, close, toggle } = useToggle()
const target = ref(null)

onClickOutside(target, close)
</script>

<template>
  <div
    ref="target"
    class="relative"
  >
    <slot
      class="cursor-pointer"
      :is-open="isOpen"
      name="trigger"
      @click="toggle"
    />

    <Teleport to="body">
      <div class="flex items-center inset-0 justify-center absolute">
        <transition
          enter-active-class="ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <slot
            v-if="isOpen"
            :close="close"
            name="content"
          />
        </transition>
      </div>
    </Teleport>
  </div>
</template>
