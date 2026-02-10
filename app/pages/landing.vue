<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="px-4 text-center flex flex-col gap-4 min-h-screen items-center justify-center from-blue-50 to-white bg-gradient-to-b">
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
        {{ t('call_for_sponsor.title') }}
      </h3>
      <p>
        {{ t('call_for_sponsor.desc') }}
      </p>
      <p>
        <NuxtLink to="mailto:sponsorship@coscup.org">
          sponsorship@coscup.org
        </NuxtLink>
      </p>
    </section>
    <section class="prose">
      <h3 class="text-center">
        {{ t('early_bird_cfp.title') }}
      </h3>
      <p>
        {{ t('early_bird_cfp.desc') }}
      </p>
      <p>
        <NuxtLink
          target="_blank"
          :to="`https://blog.coscup.org/2026/02/lead-trend-coscup-2026-early-bird-cfp.html#${t('early_bird_cfp.anchor')}`"
        >
          {{ t('early_bird_cfp.link_text') }}
        </NuxtLink>
      </p>
    </section>
    <section class="prose *:text-gray-500">
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
  </div>
</template>

<i18n lang="yaml">
en:
  coming_soon: "August 8-9 — See you there."
  co-host: "Co-hosted with UbuCon Asia!"
  call_for_sponsor:
    title: "Support COSCUP"
    desc: "If you are interested in sponsoring COSCUP 2026, please feel free to contact us."
  call_for_volunteer:
    title: "Support COSCUP"
    desc: "If you are interested in volunteering for COSCUP 2026, please feel free to contact us."
  early_bird_cfp:
    title: "Early Bird CfP"
    desc: "Early Bird Call for Proposals is now open — let the community see your ideas sooner!"
    link_text: "Learn more"
    anchor: "cfp-en"
zh:
  coming_soon: "敬請期待——COSCUP 將於 8/8 ~ 8/9 與你相見。"
  co-host: "UbuCon Asia 合辦確定！"
  call_for_sponsor:
    title: "贊助 COSCUP"
    desc: "若您對贊助 COSCUP 2026 有興趣，歡迎透過電子郵件與我們聯繫。"
  call_for_volunteer:
    title: "參與 COSCUP"
    desc: "若您對參與 COSCUP 2026 有興趣，歡迎透過電子郵件與我們聯繫。"
  early_bird_cfp:
    title: "Early Bird CfP"
    desc: "早鳥徵稿已經開跑，讓社群夥伴更早看見您的想法！"
    link_text: "瞭解更多"
    anchor: "cfp-zh"
</i18n>
