<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CpButton from '~/components/shared/CpButton.vue'

type SessionViewItemKey = 'all' | 'favorite'

interface SessionViewItem {
  key: SessionViewItemKey
  label: string
  icon?: string
}

const model = defineModel<SessionViewItemKey>({ required: true })

const { t } = useI18n()

const viewItems = computed<SessionViewItem[]>(() => [
  { key: 'all', label: t('view.all') },
  { key: 'favorite', label: t('view.favorite'), icon: 'tabler:bookmark' },
])
</script>

<template>
  <!-- Flush segments so the toggle's height matches the adjacent search field. -->
  <div class="border border-gray-200 rounded-md bg-white inline-flex overflow-hidden">
    <CpButton
      v-for="item in viewItems"
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
