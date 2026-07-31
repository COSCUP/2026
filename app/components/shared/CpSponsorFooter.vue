<script setup lang="ts">
import type { RewardType, Sponsor } from '#shared/types/sponsor'
import { useI18n } from 'vue-i18n'
import { SPONSOR_LEVELS } from '#shared/types/sponsor'

const { locale, t } = useI18n()

const { data } = useFetch('/api/sponsor', { default: () => [] as Sponsor[] })

const sponsorGroups = computed(() => {
  const grouped = Object.groupBy(data.value || [], (sponsor) => sponsor.level)
  return SPONSOR_LEVELS
    .filter((level) => grouped[level]?.length)
    .map((level) => ({
      level,
      sponsors: grouped[level]!,
    }))
})

const hasSponsor = computed(() => !!data.value?.length)

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

function getRibbon(sponsor: Sponsor) {
  if (sponsor.reward_type === 'Null' || sponsor.reward_data <= 0) {
    return null
  }
  return {
    style: rewardStyle[sponsor.reward_type],
    key: `ribbon.${rewardI18nKey[sponsor.reward_type]}`,
  }
}
</script>

<template>
  <section
    v-if="hasSponsor"
    class="px-8 pb-8 pt-16 bg-gray-50"
  >
    <div class="mx-auto max-w-[1100px]">
      <div
        v-for="{ level, sponsors } in sponsorGroups"
        :key="level"
        class="mb-8 last:mb-0"
      >
        <h3 class="text-sm text-gray-600 tracking-wider font-bold mb-4 text-center uppercase">
          {{ t(`level.${level}`) }}
        </h3>
        <div
          class="gap-4 grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4"
        >
          <NuxtLink
            v-for="sponsor in sponsors"
            :key="sponsor.id"
            class="p-3 rounded-lg bg-white flex shadow-sm transition items-center justify-center relative overflow-hidden hover:shadow-md hover:scale-105"
            external
            rel="noreferrer"
            target="_blank"
            :title="sponsor.name[locale]"
            :to="sponsor.link"
          >
            <span
              v-if="getRibbon(sponsor)"
              class="text-[8px] text-white leading-tight font-700 py-1 text-center w-[90px] pointer-events-none left-[-24px] top-[8px] absolute -rotate-45"
              :class="getRibbon(sponsor)!.style"
            >
              <span class="block">{{ t(getRibbon(sponsor)!.key) }}</span>
              <span class="block">{{ t('ribbon.years', { n: sponsor.reward_data }) }}</span>
            </span>
            <NuxtImg
              :alt="sponsor.name[locale]"
              class="h-20 max-h-full max-w-full object-contain md:h-24"
              :src="sponsor.image"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<i18n lang="yaml">
zh:
  title: 贊助夥伴
  level:
    titanium: 鈦金級
    diamond: 鑽石級
    gold: 黃金級
    silver: 白銀級
    bronze: 青銅級
    friend: 好朋友級
    community: 社群夥伴
    thanks: 特別感謝
    co-host: "共同主辦單位"
    co-organizer: "協辦單位"
  ribbon:
    consecutive: 連續贊助
    cumulative: 累計贊助
    collaborator: 累計合作
    years: "{n} 年"
en:
  title: Sponsors
  level:
    titanium: Titanium
    diamond: Diamond
    gold: Gold
    silver: Silver
    bronze: Bronze
    friend: Friend
    community: Community Partner
    thanks: Special Thanks
    co-host: "Co-host"
    co-organizer: "Co-organizer"
  ribbon:
    consecutive: Consecutive
    cumulative: Cumulative
    collaborator: Collaborator
    years: "{n} Yrs"
</i18n>
