<script setup lang="ts">
import { useI18n } from 'vue-i18n'
// The overview tab is what renders first, so its markup ships with the page
// instead of costing an extra round trip.
import overviewSvg from '~/assets/venue/overview.svg?raw'
import rbau from '~/assets/venue/RB-AU.webp'
import '~/assets/venue/fonts.css'

const { t } = useI18n()

useSeoMeta({
  title: t('title'),
  description: t('description'),
  ogTitle: t('title'),
  ogDescription: t('description'),
})

type Category = 'floors' | 'booths' | 'overview'

interface Plan {
  /** Matches the file name in `~/assets/venue/`. */
  key: string
  alt: string
  /** Set only for plans that have no usable vector source and stay raster. */
  src?: string
}

// Every plan shares this viewBox, so one ratio keeps the layout from shifting
// while a plan's chunk is still loading.
const ASPECT_RATIO = '7083 / 4753'

const categories: Category[] = ['overview', 'floors', 'booths']
const activeCategory = ref<Category>('overview')

const plans: Record<Category, Plan[]> = {
  overview: [
    { key: 'overview', alt: 'Overview' },
  ],
  floors: [
    // RB-AU's SVG export holds no vector data at all — it is one embedded PNG in
    // an <svg> wrapper, 1.1 MB against 235 KB for the webp — so this plan alone
    // stays a raster image. See scripts/prepare-venue-svg.mjs.
    { key: 'RB-AU', alt: 'RB/AU', src: rbau },
    { key: 'TR2F', alt: 'TR 2F' },
    { key: 'TR3F', alt: 'TR 3F' },
    { key: 'TR4F', alt: 'TR 4F' },
    { key: 'TR5F', alt: 'TR 5F' },
  ],
  booths: [
    { key: 'TR309', alt: 'TR309' },
    { key: 'TR312', alt: 'TR312' },
    { key: 'TR409-1', alt: 'TR409-1' },
  ],
}

const activePlans = computed(() => plans[activeCategory.value])

// The plans are inlined rather than loaded through <img> because an <img>-hosted
// SVG is an isolated document that cannot reach the page's fonts, and these
// exports hard-code a per-glyph x offset for every character. Inlining lets
// fonts.css apply and the labels keep their intended spacing.
// overview is excluded because it is imported statically above; letting it match
// here too would make Vite warn that the dynamic import cannot split it out.
const svgLoaders = import.meta.glob<string>([
  '../assets/venue/*.svg',
  '!../assets/venue/overview.svg',
], {
  query: '?raw',
  import: 'default',
})

const svgMarkup = reactive<Record<string, string>>({ overview: overviewSvg })

async function loadPlan(key: string) {
  if (svgMarkup[key]) {
    return
  }

  const loader = svgLoaders[`../assets/venue/${key}.svg`]
  if (loader) {
    svgMarkup[key] = await loader()
  }
}

watch(activeCategory, (category) => {
  for (const plan of plans[category]) {
    if (!plan.src) {
      loadPlan(plan.key)
    }
  }
}, { immediate: true })
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
      <template
        v-for="plan in activePlans"
        :key="plan.key"
      >
        <img
          v-if="plan.src"
          :alt="plan.alt"
          class="h-auto w-full"
          height="4753"
          :src="plan.src"
          width="7084"
        >
        <!-- eslint-disable-next-line vue/no-v-html -- build output of scripts/prepare-venue-svg.mjs, no user input involved -->
        <div
          v-else-if="svgMarkup[plan.key]"
          :aria-label="plan.alt"
          class="venue-plan w-full"
          role="img"
          :style="{ aspectRatio: ASPECT_RATIO }"
          v-html="svgMarkup[plan.key]"
        />
        <div
          v-else
          class="rounded bg-gray-100 w-full animate-pulse"
          :style="{ aspectRatio: ASPECT_RATIO }"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.venue-plan :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

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
