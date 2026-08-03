<script setup lang="ts">
import type { RewardType, Sponsor } from '#shared/types/sponsor'
import { useI18n } from 'vue-i18n'

const { sponsor } = defineProps<{
  sponsor: Sponsor
}>()

const { locale, t } = useI18n()

const localeKey = computed(() => locale.value === 'zh' ? 'zh-hant' : 'en')
const trackName = computed(() => sponsor.track?.name[localeKey.value] || sponsor.track?.name.en || '')
const communityName = computed(() => sponsor.community?.name[locale.value] || sponsor.community?.name.en || '')

const needsExpand = computed(() => sponsor.intro[locale.value]?.length > 200)

const rewardStyle: Record<Exclude<RewardType, 'Null'>, string> = {
  連續贊助: 'bg-amber-400',
  累計贊助: 'bg-teal-500',
  累計合作: 'bg-teal-500',
}

const rewardI18nKey: Record<Exclude<RewardType, 'Null'>, string> = {
  連續贊助: 'consecutive',
  累計贊助: 'cumulative',
  累計合作: 'collaborator',
}

const ribbon = computed(() => {
  if (sponsor.reward_type === 'Null' || sponsor.reward_data <= 0) {
    return null
  }
  return {
    style: rewardStyle[sponsor.reward_type],
    key: `ribbon.${rewardI18nKey[sponsor.reward_type]}`,
  }
})
</script>

<template>
  <article class="p-4 border border-cp-primary/50 rounded-lg flex flex-col gap-4 relative overflow-hidden md:flex-row md:items-start">
    <span
      v-if="ribbon"
      class="text-[10px] text-white leading-tight font-700 py-1.5 text-center w-[140px] shadow-sm left-[-35px] top-[17px] absolute -rotate-45"
      :class="ribbon.style"
    >
      <span class="block">{{ t(ribbon.key) }}</span>
      <span class="block">{{ t('ribbon.years', { n: sponsor.reward_data }) }}</span>
    </span>
    <NuxtLink
      class="p-4 rounded-xl bg-white flex shrink-0 w-full aspect-[3/2] items-center justify-center md:w-60 md:aspect-[3/2]"
      external
      rel="noreferrer"
      target="_blank"
      :to="sponsor.link"
    >
      <NuxtImg
        :alt="sponsor.name[locale]"
        class="h-full w-full object-contain"
        :src="sponsor.image"
      />
    </NuxtLink>

    <div class="flex-1 min-w-0">
      <div class="flex flex-wrap gap-2 items-center">
        <h3 class="text-lg text-cp-primary font-700">
          <NuxtLink
            class="hover:underline"
            external
            rel="noreferrer"
            target="_blank"
            :to="sponsor.link"
          >
            {{ sponsor.name[locale] }}
          </NuxtLink>
        </h3>
        <NuxtLinkLocale
          v-if="sponsor.track"
          class="text-xs text-cp-accent font-500 px-2 py-0.5 border-1 border-cp-green/20 rounded-full bg-cp-accent/8 transition hover:bg-cp-accent/12"
          :to="`/track/${sponsor.track.id}`"
        >
          {{ t('sponsor_track', { name: trackName }) }}
        </NuxtLinkLocale>
        <NuxtLinkLocale
          v-if="sponsor.community"
          class="text-xs text-cp-accent font-500 px-2 py-0.5 border-1 border-cp-green/20 rounded-full bg-cp-accent/8 transition hover:bg-cp-accent/12"
          to="/community"
        >
          {{ t('sponsor_community', { name: communityName }) }}
        </NuxtLinkLocale>
      </div>

      <template v-if="needsExpand">
        <input
          :id="`expand-${sponsor.id}`"
          class="peer sr-only"
          type="checkbox"
        >
        <MDC
          class="text-sm text-cp-primary leading-7 mt-3 text-left line-clamp-5 prose peer-checked:line-clamp-none"
          :value="sponsor.intro[locale]"
        />
        <label
          class="text-xs text-cp-secondary mt-1 block cursor-pointer hover:underline peer-checked:hidden"
          :for="`expand-${sponsor.id}`"
        >
          {{ t('read_more') }}
        </label>
        <label
          class="text-xs text-cp-secondary mt-1 hidden cursor-pointer hover:underline peer-checked:block"
          :for="`expand-${sponsor.id}`"
        >
          {{ t('show_less') }}
        </label>
      </template>

      <MDC
        v-else
        class="text-sm text-cp-primary leading-7 mt-3 text-left prose"
        :value="sponsor.intro[locale]"
      />
    </div>
  </article>
</template>

<i18n lang="yaml">
zh:
  show_less: "收合"
  read_more: "更多"
  sponsor_track: "贊助：{name}"
  sponsor_community: "社群：{name}"
  ribbon:
    consecutive: "連續贊助"
    cumulative: "累計贊助"
    collaborator: "累計合作"
    years: "{n} 年"
en:
  show_less: "Show less"
  read_more: "Read more"
  sponsor_track: "Sponsor: {name}"
  sponsor_community: "Community: {name}"
  ribbon:
    consecutive: "Consecutive"
    cumulative: "Cumulative"
    collaborator: "Collaborator"
    years: "{n} Yrs"
</i18n>
