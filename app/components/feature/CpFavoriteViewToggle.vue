<script setup lang="ts">
import type { Item } from '~/components/shared/CpGroupButton.vue'
import { useI18n } from 'vue-i18n'
import CpButton from '~/components/shared/CpButton.vue'
import CpGroupButton from '~/components/shared/CpGroupButton.vue'

type SessionViewItemKey = 'all' | 'favorite'

const model = defineModel<SessionViewItemKey>({ required: true })

const { t } = useI18n()

const viewItems = computed<Item<SessionViewItemKey>[]>(() => [
  { key: 'all', label: t('view.all') },
  { key: 'favorite', label: t('view.favorite'), icon: 'tabler:bookmark' },
])

function switchView() {
  model.value = model.value === 'all' ? 'favorite' : 'all'
}
</script>

<template>
  <!-- Flush segments so the toggle's height matches the adjacent search field. -->
  <CpGroupButton
    v-model="model"
    class="hidden md:inline-flex"
    :items="viewItems"
  />
  <div class="border border-gray-200 rounded-md bg-white inline-flex overflow-hidden md:hidden">
    <CpButton
      :class="model === 'favorite' ? '!bg-yellow-400 !text-white' : '!bg-white !text-black'"
      variant="basic"
      @click="switchView"
    >
      <Icon
        :name="model === 'favorite' ? 'tabler:star-filled' : 'tabler:star'"
        size="18"
      />
    </CpButton>
  </div>
</template>

<i18n lang="yaml">
  en:
    view:
      all: 'Sessions'
      favorite: 'Favorites'
  zh:
    view:
      all: '議程'
      favorite: '收藏'
</i18n>
