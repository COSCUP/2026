<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import overview from '~/assets/venue/overview.webp'
import rbau from '~/assets/venue/RB-AU.webp'
import tr2f from '~/assets/venue/TR2F.webp'
import tr3f from '~/assets/venue/TR3F.webp'
import tr4f from '~/assets/venue/TR4F.webp'
import tr5f from '~/assets/venue/TR5F.webp'
import tr309 from '~/assets/venue/TR309.webp'
import tr312 from '~/assets/venue/TR312.webp'
import tr409_1 from '~/assets/venue/TR409-1.webp'

const { t } = useI18n()

useSeoMeta({
  title: t('title'),
  description: t('description'),
  ogTitle: t('title'),
  ogDescription: t('description'),
})

type Category = 'floors' | 'booths' | 'overview'

const categories: Category[] = ['overview', 'floors', 'booths']
const activeCategory = ref<Category>('overview')

const overviewImage = [
  { key: 'overview', alt: 'Overview', src: overview },
]

const floorImages = [
  { key: 'RBAU', alt: 'RB/AU', src: rbau },
  { key: 'TR2F', alt: 'TR 2F', src: tr2f },
  { key: 'TR3F', alt: 'TR 3F', src: tr3f },
  { key: 'TR4F', alt: 'TR 4F', src: tr4f },
  { key: 'TR5F', alt: 'TR 5F', src: tr5f },
]

const boothImages = [
  { key: 'TR309', alt: 'TR309', src: tr309 },
  { key: 'TR312', alt: 'TR312', src: tr312 },
  { key: 'TR409-1', alt: 'TR409-1', src: tr409_1 },
]

const activeImages = computed(() => {
  if (activeCategory.value === 'floors') {
    return floorImages
  } else if (activeCategory.value === 'booths') {
    return boothImages
  } else {
    return overviewImage
  }
})
</script>

<template>
  <div class="m-auto flex flex-col gap-4 max-w-[1200px]">
    <div class="flex gap-2">
      <button
        v-for="cat in categories"
        :key="cat"
        :aria-pressed="cat === activeCategory"
        class="text-sm font-bold px-4 py-2 border-b-2 cursor-pointer transition-colors"
        :class="cat === activeCategory
          ? 'text-primary-700 border-primary-700'
          : 'text-gray-500 border-transparent hover:text-primary-500'"
        type="button"
        @click="activeCategory = cat"
      >
        {{ t(cat) }}
      </button>
    </div>

    <div class="flex flex-col gap-4">
      <img
        v-for="img in activeImages"
        :key="img.key"
        :alt="img.alt"
        :src="img.src"
      >
    </div>
  </div>
</template>

<i18n lang="yaml">
zh:
  title: 會場地圖
  description: COSCUP x UbuCon Asia 2026 場地平面圖
  overview: 會場總覽
  floors: 樓層平面圖
  booths: 攤位平面圖
en:
  title: Venue
  description: COSCUP x UbuCon Asia 2026 venue floor plans
  overview: Overview
  floors: Floor Plans
  booths: Booth Plans
</i18n>
