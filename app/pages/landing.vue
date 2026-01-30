<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="text-center flex flex-col gap-12 min-h-screen items-center justify-center from-blue-50 to-white bg-gradient-to-b">
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
    desc: "If you are interested in sponsoring COSCUP 2026, please feel free to contact us at sponsorship{'@'}coscup.org"
  call_for_volunteer:
    title: "Support COSCUP"
    desc: "If you are interested in volunteering for COSCUP 2026, please feel free to contact us at volunteer{'@'}coscup.org"
zh:
  coming_soon: "敬請期待——COSCUP 將於 8/8 ~ 8/9 與你相見。"
  co-host: "UbuCon Asia 合辦確定！"
  call_for_sponsor:
    title: "贊助 COSCUP"
    desc: "若您對贊助 COSCUP 2026 有興趣，歡迎透過電子郵件與我們聯繫：sponsorship{'@'}coscup.org"
  call_for_volunteer:
    title: "參與 COSCUP"
    desc: "若您對參與 COSCUP 2026 有興趣，歡迎透過電子郵件與我們聯繫：volunteer{'@'}coscup.org"
</i18n>
