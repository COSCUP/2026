<script setup lang="ts">
import type { Sponsor } from '#shared/types/sponsor'
import { useI18n } from 'vue-i18n'
import SponsorCard from '~/components/feature/CpSponsorCard.vue'

const { t } = useI18n()
const localePath = useLocalePath()

const { data } = await useFetch<Sponsor[]>('/api/sponsor')

const hasSponsor = computed(() => {
  return data.value && data.value.length > 0
})

const sponsorGroups = computed(() => Object.groupBy(data.value || [], (sponsor) => sponsor.level))
</script>

<template>
  <main class="mx-auto my-8 max-w-[80vw] w-[1200px]">
    <section class="p-8 border border-primary-100 rounded-2xl">
      <h1 class="text-lg text-primary-500 font-700 mb-2">
        {{ t('hero.title') }}
      </h1>
      <p class="text-sm text-primary-700 leading-7 md:text-base">
        {{ t('hero.description') }}
      </p>
      <p class="text-sm text-primary-700 leading-7 mt-3 md:text-base">
        {{ t('hero.contact') }}
        <NuxtLink
          class="text-primary-400 underline"
          to="mailto:sponsorship@coscup.org"
        >
          sponsorship@coscup.org
        </NuxtLink>
      </p>
      <p class="mt-3 flex gap-4">
        <NuxtLink
          class="text-sm text-primary-500 font-600 px-4 py-2 border border-primary-200 rounded-full bg-primary-50 transition hover:bg-primary-100"
          :to="localePath('/sponsorship')"
        >
          {{ t('hero.package') }}
        </NuxtLink>
      </p>
    </section>

    <section v-if="!hasSponsor">
      <p class="text-primary-500 mt-8 text-center">
        {{ t('noSponsor') }}
      </p>
    </section>
    <section
      v-else
      class="mt-8"
    >
      <div
        v-for="(sponsors, level) in sponsorGroups"
        :key="level"
        class="mb-6"
      >
        <h2 class="text-md text-primary-500 font-600 mb-2">
          {{ t(`sponsorLevel.${level}`) }}
        </h2>
        <div class="gap-4 grid">
          <div
            v-for="sponsor in sponsors"
            :key="sponsor.id"
          >
            <SponsorCard :sponsor="sponsor" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<i18n lang="yaml">
zh:
  hero:
    title: "成為贊助夥伴"
    description: "COSCUP 是由社群主導的開源年會，致力於促進台灣開源生態的發展。我們誠摯邀請企業與組織加入我們的贊助行列，一同支持這個充滿活力的社群。無論您是大型企業還是新創公司，我們都歡迎您的參與，讓我們一起為台灣的開源未來努力！"
    contact: "如有興趣成為贊助夥伴，請聯繫我們："
    package: "查看贊助方案"
  noSponsor: "贊助夥伴目前尚未公布。"
  sponsorLevel:
    titanium: "鈦金級"
    diamond: "鑽石級"
    gold: "黃金級"
    silver: "白銀級"
    bronze: "青銅級"
    friend: "好朋友級"
    community: "社群夥伴"
en:
  hero:
    title: "Become a Sponsor"
    description: "COSCUP is a community-driven open source conference dedicated to promoting the development of the open source ecosystem in Taiwan. We sincerely invite companies and organizations to join us as sponsors and support this vibrant community. Whether you are a large enterprise or a startup, we welcome your participation. Let's work together for the future of open source in Taiwan!"
    contact: "If you are interested in becoming a sponsor, please contact us:"
    package: "View Sponsorship Packages"
  noSponsor: "Sponsors have not been announced yet."
  sponsorLevel:
    titanium: "Titanium Sponsor"
    diamond: "Diamond Sponsor"
    gold: "Gold Sponsor"
    silver: "Silver Sponsor"
    bronze: "Bronze Sponsor"
    friend: "Friend Sponsor"
    community: "Community Partner"
</i18n>
