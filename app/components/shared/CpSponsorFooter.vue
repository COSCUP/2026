<script setup lang="ts">
import type { Sponsor } from '#shared/types/sponsor'
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
            class="p-3 rounded-lg bg-white flex shadow-sm transition items-center justify-center hover:shadow-md hover:scale-105"
            external
            rel="noreferrer"
            target="_blank"
            :title="sponsor.name[locale]"
            :to="sponsor.link"
          >
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
    thinks: Special Thanks
</i18n>
