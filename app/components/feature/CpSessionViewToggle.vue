<script setup lang="ts" generic="T extends string">
import CpButton from '~/components/shared/CpButton.vue'

export interface SessionViewItem<T extends string> {
  key: T
  label: string
  icon?: string
}

defineProps<{
  items: SessionViewItem<T>[]
}>()

const model = defineModel<T>({ required: true })
</script>

<template>
  <!-- Flush segments so the toggle's height matches the adjacent search field. -->
  <div class="border border-gray-200 rounded-md bg-white inline-flex overflow-hidden">
    <CpButton
      v-for="item in items"
      :key="item.key"
      :active="model === item.key"
      :aria-pressed="model === item.key"
      class="!rounded-none"
      variant="basic"
      @click="model = item.key"
    >
      <template
        v-if="item.icon"
        #icon
      >
        <Icon
          :name="item.icon"
          size="18"
        />
      </template>
      {{ item.label }}
    </CpButton>
  </div>
</template>
