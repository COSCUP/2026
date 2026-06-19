<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useSeoMeta({
  description: () => t('meta.description'),
  ogDescription: () => t('meta.description'),
  twitterDescription: () => t('meta.description'),
})
</script>

<template>
  <div class="pa-4 text-center flex flex-col gap-4 items-center">
    <section class="prose">
      <h1 class="text-5xl text-cp-green">
        COSCUP 2026
      </h1>
      <p class="text-2xl text-cp-green">
        {{ t('co-host') }}
      </p>
      <p class="text-2xl text-cp-green">
        {{ t('coming_soon') }}
      </p>
    </section>
    <section class="prose">
      <h3 class="text-center">
        {{ t('donate.title') }}
      </h3>
      <p>
        {{ t('donate.desc') }}
      </p>
      <p>
        <NuxtLink
          class="not-prose text-white px-4 py-2 rounded bg-cp-green shadow hover:shadow-lg"
          target="_blank"
          to="https://s.coscup.org/individualsupporter"
        >
          {{ t('donate.link_text') }}
        </NuxtLink>
      </p>
    </section>
    <section class="prose">
      <h3 class="text-center">
        {{ t('call_for_sponsor.title') }}
      </h3>
      <p>
        {{ t('call_for_sponsor.desc') }}
      </p>
      <p>
        <NuxtLink
          class="not-prose text-white px-4 py-2 rounded bg-cp-green shadow hover:shadow-lg"
          :to="t('call_for_sponsor.link')"
        >
          {{ t('call_for_sponsor.link_text') }}
        </NuxtLink>
      </p>
    </section>
    <section class="prose">
      <h3 class="text-center">
        {{ t('call_for_participation.title') }}
      </h3>
      <p>
        {{ t('call_for_participation.desc') }}
      </p>
      <p>
        <NuxtLink
          class="not-prose text-white px-4 py-2 rounded bg-cp-green shadow hover:shadow-lg"
          target="_blank"
          :to="`https://blog.coscup.org/2026/02/coscup-2026-call-for-participation.html#${t('call_for_participation.anchor')}`"
        >
          {{ t('call_for_participation.link_text') }}
        </NuxtLink>
      </p>
    </section>
  </div>
</template>

<i18n lang="yaml">
en:
  meta:
    description: "COSCUP 2026 x UbuCon Asia — Taiwan's largest open source community conference."
  coming_soon: "August 8-9 — See you there."
  co-host: "Co-hosted with UbuCon Asia!"
  call_for_sponsor:
    title: "Support COSCUP"
    desc: "If you are interested in sponsoring COSCUP 2026, please refer to our sponsorship package or contact us directly via email."
    link: "/en/sponsorship"
    link_text: "I want to sponsor"
  call_for_participation:
    title: "Call for Participation"
    desc: "We're now accepting community track and booth applications — bring your community to COSCUP 2026!"
    link_text: "Learn more"
    anchor: "anchor2"
  donate:
    title: "Individual Sponsorship"
    desc: "In the age of AI, help support the open-source community infrastructure and join us in supporting COSCUP 2026!"
    link_text: "Individual Sponsorship"
    anchor: ""
zh:
  meta:
    description: "COSCUP 2026 x UbuCon Asia——臺灣最大的開源社群年會。"
  coming_soon: "敬請期待——COSCUP 將於 8/8 ~ 8/9 與你相見。"
  co-host: "UbuCon Asia 合辦確定！"
  call_for_sponsor:
    title: "贊助 COSCUP"
    desc: "若您對贊助 COSCUP 2026 有興趣，歡迎參考贊助方案，或直接透過電子郵件與我們聯繫。"
    link: "/sponsorship"
    link_text: "我要贊助"
  call_for_participation:
    title: "徵求社群參與"
    desc: "社群議程軌與社群攤位開放申請中，帶領您的社群參與 COSCUP 2026！"
    link_text: "瞭解更多"
    anchor: ""
  donate:
    title: "個人贊助"
    desc: "AI 時代，撐起開源舞台鷹架，一同支持 COSCUP 2026 吧！"
    link_text: "個人贊助"
    anchor: ""
</i18n>
