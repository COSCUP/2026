<script setup lang="ts">
import { onClickOutside, useToggle } from '@vueuse/core'
import { ref } from 'vue'

const [isOpen, toggle] = useToggle()
const target = ref(null)
const close = () => toggle(false)
function onTriggerClick() {
  toggle()
}

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
      @click="onTriggerClick"
    />

    <Teleport to="body">
      <div
        v-show="isOpen"
        class="bg-black/50 flex items-center inset-0 justify-center fixed z-50"
      >
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
