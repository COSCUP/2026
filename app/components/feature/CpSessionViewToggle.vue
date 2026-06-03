<script setup lang="ts">
import CpButton from '~/components/shared/CpButton.vue'

export interface SessionViewItem {
  key: string
  label: string
  icon?: string
}

defineProps<{
  items: SessionViewItem[]
}>()

const model = defineModel<string>({ required: true })
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
