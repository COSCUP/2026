<script setup lang="ts">
import { TierLevelSchema } from '#shared/types/sponsorship'
import { useI18n } from 'vue-i18n'
import useLocaleContent from '~/composables/useLocaleContent'

const { t, locale, defaultLocale } = useI18n()

const { data: tiers } = await useFetch('/api/sponsorship/tiers')
const { data: addOns } = await useFetch('/api/sponsorship/add-ons')

const overview = await useLocaleContent('/sponsorship/overview', locale, defaultLocale)
const faq = await useLocaleContent('/sponsorship/faq', locale, defaultLocale)
const about = await useLocaleContent('/sponsorship/about', locale, defaultLocale)

const tierLevels = TierLevelSchema.options
</script>

<template>
  <div class="mx-auto prose">
    <h1 class="text-center">
      {{ t('title') }}
    </h1>

    <ContentRenderer
      v-if="overview"
      :value="overview"
    />

    <!-- Sponsorship Tiers -->
    <h2>{{ t('tiers.heading') }}</h2>

    <div class="flex gap-6 overflow-x-auto *:shrink-0 md:flex-wrap *:max-w-full md:*:basis-[calc(33.3%-1rem)]">
      <div
        v-for="tier in tiers"
        :key="tier.level"
        class="p-4 rounded-lg bg-gray-100 flex flex-col"
        :class="{ 'md:basis-full': tier.level === 'community' }"
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
    <h2>{{ t('addons.heading') }}</h2>

    <div class="overflow-x-auto">
      <table>
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
            <td><MDC :value="addon.item[locale]" /></td>
            <td
              v-for="level in tierLevels"
              :key="level"
              class="text-center vertical-middle"
            >
              {{ addon[`${level}_amount`][locale] }}
            </td>
          </tr>
        </tbody>
      </table>
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
  title: "COSCUP 2026 贊助方案"
  tiers:
    heading: "贊助方案（單位：新台幣，外稅）"
  addons:
    heading: "贊助方案加價購（單位：新台幣，外稅）"
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
    heading: "Sponsorship Package (Unit: TWD, before tax)"
  addons:
    heading: "Sponsorship Add-ons (Unit: TWD, before tax)"
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
