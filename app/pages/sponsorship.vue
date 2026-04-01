<script setup lang="ts">
import { TIER_LEVELS } from '#shared/types/sponsorship'
import { useI18n } from 'vue-i18n'
import CpPopup from '~/components/shared/CpPopup.vue'
import useLocaleContent from '~/composables/useLocaleContent'

const { t, locale, locales, defaultLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

definePageMeta({
  layout: 'empty',
})

const { data: tiers } = await useFetch('/api/sponsorship/tiers')
const { data: addOns } = await useFetch('/api/sponsorship/add-ons')

const overview = await useLocaleContent('/sponsorship/overview', locale, defaultLocale)
const faq = await useLocaleContent('/sponsorship/faq', locale, defaultLocale)
const about = await useLocaleContent('/sponsorship/about', locale, defaultLocale)

const tierLevels = TIER_LEVELS

const tiersHint = computed(() => t('tiers.hint'))

const addOnFigures = computed(() => [
  { src: '/sponsorship/flag.webp', alt: t('addons.flag') },
  { src: '/sponsorship/lanyards.webp', alt: t('addons.lanyards') },
  { src: '/sponsorship/promotion.webp', alt: t('addons.promotion') },
  { src: '/sponsorship/website-agenda-ads.webp', alt: t('addons.website_and_agenda_ads') },
])
</script>

<template>
  <div class="mx-auto my-8 max-w-[80vw] w-[1200px] prose print:m-0 print:max-w-full print:w-full">
    <h1 class="text-center">
      {{ t('title') }}
    </h1>

    <section class="flex gap-4 justify-center *:text-gray-500 print:hidden">
      <template
        v-for="(l, index) in locales"
        :key="l.code"
      >
        <span v-if="index !== 0"> · </span>
        <NuxtLink
          :to="switchLocalePath(l.code)"
        >
          {{ l.name }}
        </NuxtLink>
      </template>
    </section>

    <ContentRenderer
      v-if="overview"
      :value="overview"
    />

    <!-- Sponsorship Tiers -->
    <h2 class="print:break-after-avoid">
      {{ t('tiers.heading') }}
    </h2>
    <p
      v-if="tiersHint"
      class="print:break-after-avoid"
    >
      {{ tiersHint }}
    </p>

    <div class="flex gap-6 overflow-x-auto snap-x snap-mandatory *:shrink-0 md:flex-wrap print:flex-wrap *:max-w-full md:*:basis-[calc(33.3%-1rem)] print:*:basis-[calc(50%-1rem)]">
      <div
        v-for="tier in tiers"
        :key="tier.level"
        class="p-4 rounded-lg bg-gray-100 flex flex-col snap-center print:flex-row print:gap-4 print:break-inside-avoid"
        :class="{ 'md:basis-full print:basis-full': tier.level === 'community' }"
      >
        <div class="flex flex-col items-center">
          <NuxtPicture
            :alt="t(`levels.${tier.level}`)"
            class="w-fit"
            height="80"
            :src="`/sponsorship/${tier.level}.png`"
            width="80"
          />
          <h3 class="text-lg font-bold text-center">
            {{ t(`levels.${tier.level}`) }}
          </h3>
          <MDC
            class="text-center"
            :value="tier.value[locale]"
          />
        </div>
        <MDC
          class="prose-sm"
          :value="tier.benefits[locale]"
        />
      </div>
    </div>

    <!-- Add-ons -->
    <h2 class="print:m-0 print:break-before-page">
      {{ t('addons.heading') }}
    </h2>
    <p>{{ t('addons.hint') }}</p>

    <div class="overflow-x-auto">
      <table class="print:m-0">
        <thead>
          <tr>
            <th class="min-w-40">
              {{ t('addons.item') }}
            </th>
            <th
              v-for="level in tierLevels"
              :key="level"
              class="text-center whitespace-nowrap"
            >
              <NuxtPicture
                :alt="t(`levels.${level}`)"
                class="mx-auto w-fit"
                height="60"
                :src="`/sponsorship/${level}.png`"
                width="60"
              />
              {{ t(`levels.${level}`) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(addon, idx) in addOns"
            :key="idx"
          >
            <td class="print:p-0">
              <CpPopup v-if="addon.tooltip[locale].trim()">
                <template #trigger="props">
                  <span
                    class="flex gap-2 items-center"
                    v-bind="props"
                  >
                    {{ addon.item[locale] }}
                    <Icon name="tabler:info-circle" />
                  </span>
                </template>
                <template #content>
                  <div class="p-4 rounded bg-white w-[80%] shadow">
                    <MDC :value="addon.tooltip[locale]" />
                  </div>
                </template>
              </CpPopup>
              <MDC
                v-else
                :value="addon.item[locale]"
              />
            </td>
            <td
              v-for="level in tierLevels"
              :key="level"
              class="text-center vertical-middle print:p-0"
            >
              {{ addon[`${level}_amount`][locale] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="not-prose gap-4 grid grid-cols-1 md:grid-cols-2 print:grid-cols-2">
      <figure
        v-for="fig in addOnFigures"
        :key="fig.src"
        class="text-center flex flex-col items-center"
      >
        <NuxtPicture
          :alt="fig.alt"
          :src="fig.src"
        />
        <figcaption class="text-center">
          {{ fig.alt }}
        </figcaption>
      </figure>
    </div>

    <!-- Deadline & Contact -->
    <p>
      {{ t('deadline') }}
    </p>
    <p>
      {{ t('contact') }}
      <NuxtLink to="mailto:sponsorship@coscup.org">
        sponsorship@coscup.org
      </NuxtLink>
    </p>

    <ContentRenderer
      v-if="faq"
      :value="faq"
    />

    <ContentRenderer
      v-if="about"
      :value="about"
    />
  </div>
</template>

<i18n lang="yaml">
zh:
  title: "COSCUP Taiwan 2026 贊助方案"
  tiers:
    heading: "贊助方案（單位：新台幣，外稅）"
    hint: ""
  addons:
    heading: "贊助方案加價購（單位：新台幣，外稅）"
    hint: ""
    item: "加價項目"
    flag: "Keynote 演講廳 垂吊布條"
    lanyards: "頸帶獨家贊助"
    promotion: "大會點心區桌旗（兩天）"
    website_and_agenda_ads: "網站議程頁面廣告"
  levels:
    titanium: "鈦金級"
    diamond: "鑽石級"
    gold: "黃金級"
    silver: "白銀級"
    bronze: "青銅級"
    friend: "好朋友級"
    community: "贊助社群客製化方案"
  deadline: "因應相關製作物所需的工作時間，贊助截止日期：2026 年 7 月 06 日。"
  contact: "聯絡我們："
en:
  title: "COSCUP Taiwan 2026 Sponsorship Program"
  tiers:
    heading: "Sponsorship Package"
    hint: "(Unit: USD. Please note that actual foreign exchange rates will be applied to your sponsor fee, which will differ from the following prices that take 1 USD = 28 TWD)"
  addons:
    heading: "Sponsorship Add-ons"
    hint: "(Unit: USD. Please note that actual foreign exchange rates that will be applied to your sponsor fee will differ from these examples: FOREX as 1 USD = 28 TWD)"
    item: "Additional Purchase"
    flag: "Logo on Stage Flag in Keynote Hall (co-branded with COSCUP)"
    lanyards: "Lanyards (Exclusive Sponsorship)"
    promotion: "Promotion at the Snack Area (2 days)"
    website_and_agenda_ads: "Agenda Page Ads"
  levels:
    titanium: "Titanium"
    diamond: "Diamond"
    gold: "Gold"
    silver: "Silver"
    bronze: "Bronze"
    friend: "Friend"
    community: "Customized Community Sponsorship Program"
  deadline: "Deadline for sponsorship: July 06, 2026"
  contact: "Contact us:"
</i18n>

<style scoped>
@media print {
  @page {
    margin: 0.8cm;
  }
}
</style>
