<script setup lang="ts">
import { useI18n } from 'vue-i18n'

export interface ContentCardItem {
  id: string
  title: {
    zh: string
    en: string
  }
  intro: {
    zh: string
    en: string
  }
  link: string
  image: string
  reward_type?: string
  reward_data?: number
}

const { item } = defineProps<{
  item: ContentCardItem
}>()

const { locale, t } = useI18n()
const activeLocale = computed(() => locale.value === 'zh' ? 'zh' : 'en')

const needsExpand = computed(() => item.intro[activeLocale.value]?.length > 200)

const hasRibbon = computed(() => item.reward_type !== 'Null' && item.reward_data && item.reward_data > 0)
const ribbonColorClass = computed(() =>
  item.reward_type === '連續贊助' ? 'bg-amber-400' : 'bg-teal-500',
)
const ribbonTypeKey = computed(() =>
  item.reward_type === '連續贊助' ? 'consecutive' : 'cumulative',
)
</script>

<template>
  <article class="p-4 border border-primary-200 rounded-lg flex flex-col gap-4 relative overflow-hidden md:flex-row md:items-start">
    <span
      v-if="hasRibbon"
      class="text-[10px] text-white leading-tight font-700 py-1.5 text-center w-[140px] shadow-sm left-[-35px] top-[17px] absolute -rotate-45"
      :class="ribbonColorClass"
    >
      <span class="block">{{ t(`ribbon.${ribbonTypeKey}`) }}</span>
      <span class="block">{{ t('ribbon.years', { n: item.reward_data }) }}</span>
    </span>
    <NuxtLink
      class="p-4 rounded-xl bg-white flex shrink-0 w-full aspect-[3/2] items-center justify-center md:w-60 md:aspect-[3/2]"
      external
      rel="noreferrer"
      target="_blank"
      :to="item.link"
    >
      <NuxtImg
        :alt="item.title[locale]"
        class="h-full w-full object-contain"
        :src="item.image"
      />
    </NuxtLink>

    <div class="flex-1 min-w-0">
      <h3 class="text-lg text-primary-500 font-700">
        <NuxtLink
          class="hover:underline"
          external
          rel="noreferrer"
          target="_blank"
          :to="item.link"
        >
          {{ item.title[locale] }}
        </NuxtLink>
      </h3>

      <template v-if="needsExpand">
        <input
          :id="`expand-${item.id}`"
          class="peer sr-only"
          type="checkbox"
        >
        <MDC
          class="text-sm text-primary-700 leading-7 mt-3 text-left line-clamp-5 prose peer-checked:line-clamp-none"
          :value="item.intro[locale]"
        />
        <label
          class="text-xs text-primary-500 mt-1 block cursor-pointer hover:underline peer-checked:hidden"
          :for="`expand-${item.id}`"
        >
          {{ t('read_more') }}
        </label>
        <label
          class="text-xs text-primary-500 mt-1 hidden cursor-pointer hover:underline peer-checked:block"
          :for="`expand-${item.id}`"
        >
          {{ t('show_less') }}
        </label>
      </template>

      <MDC
        v-else
        class="text-sm text-primary-700 leading-7 mt-3 text-left prose"
        :value="item.intro[locale]"
      />
    </div>
  </article>
</template>

<i18n lang="yaml">
zh:
  show_less: "收合"
  read_more: "更多"
  ribbon:
    consecutive: "連續贊助"
    cumulative: "累積贊助"
    years: "{n} 年"
en:
  show_less: "Show less"
  read_more: "Read more"
  ribbon:
    consecutive: "Consecutive"
    cumulative: "Cumulative"
    years: "{n} Yrs"
</i18n>
