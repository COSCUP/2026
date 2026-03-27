<script setup lang="ts">
import { TierLevelSchema } from '#shared/types/sponsorship'
import { useI18n } from 'vue-i18n'
import useLocaleContent from '~/composables/useLocaleContent'
import { renderMarkdown } from '~/utils/renderMarkdown'

const { t, locale, defaultLocale } = useI18n()

const { data: tiers } = await useFetch('/api/sponsorship/tiers')
const { data: addOns } = await useFetch('/api/sponsorship/add-ons')

const overview = await useLocaleContent('/sponsorship/overview', locale, defaultLocale)
const faq = await useLocaleContent('/sponsorship/faq', locale, defaultLocale)
const about = await useLocaleContent('/sponsorship/about', locale, defaultLocale)

const tierLevels = TierLevelSchema.options
const regularTiers = computed(() =>
  tiers.value?.filter((tier) => tier.method === 'amount') ?? [],
)
const communityTier = computed(() =>
  tiers.value?.find((tier) => tier.level === 'community'),
)
</script>

<template>
  <div class="mx-auto px-4 py-8 max-w-5xl prose">
    <h1 class="text-center">
      {{ t('title') }}
    </h1>

    <ContentRenderer
      v-if="overview"
      :value="overview"
    />

    <!-- Sponsorship Tiers -->
    <h2>{{ t('tiers.heading') }}</h2>

    <!-- Top 3 tiers: titanium, diamond, gold -->
    <table>
      <thead>
        <tr>
          <th />
          <th
            v-for="level in tierLevels.slice(0, 3)"
            :key="level"
            class="text-center"
          >
            {{ t(`levels.${level}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>{{ t('tiers.amount') }}</strong></td>
          <td
            v-for="tier in regularTiers.slice(0, 3)"
            :key="tier.level"
          >
            <strong>{{ tier.value[locale] }}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>{{ t('tiers.benefits') }}</strong></td>
          <td
            v-for="tier in regularTiers.slice(0, 3)"
            :key="tier.level"
            v-html="renderMarkdown(tier.benefits[locale])"
          />
        </tr>
      </tbody>
    </table>

    <!-- Bottom 3 tiers: silver, bronze, friend -->
    <table>
      <thead>
        <tr>
          <th />
          <th
            v-for="level in tierLevels.slice(3)"
            :key="level"
            class="text-center"
          >
            {{ t(`levels.${level}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>{{ t('tiers.amount') }}</strong></td>
          <td
            v-for="tier in regularTiers.slice(3)"
            :key="tier.level"
          >
            <strong>{{ tier.value[locale] }}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>{{ t('tiers.benefits') }}</strong></td>
          <td
            v-for="tier in regularTiers.slice(3)"
            :key="tier.level"
            v-html="renderMarkdown(tier.benefits[locale])"
          />
        </tr>
      </tbody>
    </table>

    <!-- Community custom plan -->
    <table v-if="communityTier">
      <thead>
        <tr>
          <th />
          <th class="text-center">
            {{ t('levels.community') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>{{ t('tiers.method') }}</strong></td>
          <td>
            <strong>{{ communityTier.value[locale] }}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>{{ t('tiers.benefits') }}</strong></td>
          <td v-html="renderMarkdown(communityTier.benefits[locale])" />
        </tr>
      </tbody>
    </table>

    <!-- Add-ons -->
    <h2>{{ t('addons.heading') }}</h2>

    <table>
      <thead>
        <tr>
          <th>{{ t('addons.item') }}</th>
          <th
            v-for="level in tierLevels"
            :key="level"
            class="text-center"
          >
            {{ t(`levels.${level}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(addon, idx) in addOns"
          :key="idx"
        >
          <td v-html="renderMarkdown(addon.item[locale])" />
          <td
            v-for="level in tierLevels"
            :key="level"
            class="text-center"
          >
            <strong>{{ addon[`${level}_amount`][locale] }}</strong>
          </td>
        </tr>
      </tbody>
    </table>

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
  title: "COSCUP 2026 贊助方案"
  tiers:
    heading: "贊助方案（單位：新台幣，外稅）"
    amount: "贊助金額"
    benefits: "贊助福利"
    method: "贊助方式"
  addons:
    heading: "贊助方案加價購（單位：新台幣，外税）"
    item: "加價項目"
  levels:
    titanium: "鈦金級"
    diamond: "鑽石級"
    gold: "黃金級"
    silver: "白銀級"
    bronze: "青銅級"
    friend: "好朋友級"
    community: "贊助社群客製化方案"
  deadline: "因應相關製作物所需的工作時間，贊助截止日期：2026 年 7 月 10 日"
  contact: "聯絡我們："
en:
  title: "COSCUP 2026 Sponsorship Program"
  tiers:
    heading: "Sponsorship Package (Unit: TWD, tax excluded)"
    amount: "Cost"
    benefits: "Benefits"
    method: "Methods"
  addons:
    heading: "Sponsorship Add-ons (Unit: TWD, tax excluded)"
    item: "Additional Purchase"
  levels:
    titanium: "Titanium"
    diamond: "Diamond"
    gold: "Gold"
    silver: "Silver"
    bronze: "Bronze"
    friend: "Friend"
    community: "Customized Community Sponsorship Program"
  deadline: "Deadline for sponsorship: July 10, 2026"
  contact: "Contact us:"
</i18n>
