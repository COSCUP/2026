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
  <div class="mx-auto px-4 py-8 flex flex-col gap-12 max-w-4xl">
    <section class="text-center flex flex-col gap-3 items-center">
      <h1 class="text-5xl text-cp-green m-0">
        COSCUP x UbuCon Asia 2026
      </h1>
    </section>

    <section
      :aria-label="t('event_details.title')"
      class="py-6 border-y border-cp-green gap-6 grid sm:grid-cols-2"
    >
      <div class="flex gap-3 items-start">
        <Icon
          class="text-cp-green mt-1 shrink-0"
          name="tabler:calendar-event"
          size="28"
        />
        <div class="flex flex-col gap-1">
          <h2 class="text-lg text-gray-900 font-semibold m-0">
            {{ t('event_details.date.title') }}
          </h2>
          <time
            class="text-lg text-gray-700"
            datetime="2026-08-08/2026-08-09"
          >
            {{ t('event_details.date.value') }}
          </time>
        </div>
      </div>

      <div class="flex gap-3 items-start">
        <Icon
          class="text-cp-green mt-1 shrink-0"
          name="tabler:map-pin"
          size="28"
        />
        <div class="flex flex-col gap-1">
          <h2 class="text-lg text-gray-900 font-semibold m-0">
            {{ t('event_details.venue.title') }}
          </h2>
          <p class="text-lg text-gray-700 m-0">
            {{ t('event_details.venue.name') }}
          </p>
          <p class="text-sm text-gray-600 m-0">
            {{ t('event_details.venue.address') }}
          </p>
          <NuxtLinkLocale
            class="text-cp-green font-medium mt-1 w-max hover:text-primary-700 hover:underline"
            to="/transportation"
          >
            {{ t('event_details.venue.transportation') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </section>

    <section
      :aria-label="t('ubucon.title')"
      class="p-6 text-center border border-green-200 rounded-lg bg-green-50 flex flex-col gap-2 items-center"
    >
      <h2 class="text-xl text-gray-900 font-semibold m-0">
        {{ t('ubucon.title') }}
      </h2>
      <p class="text-gray-700 leading-relaxed m-0">
        {{ t('ubucon.desc') }}
      </p>
      <NuxtLink
        class="text-cp-green font-medium mt-1 w-max hover:text-green-700 hover:underline"
        target="_blank"
        to="https://2026.ubucon.asia/"
      >
        {{ t('ubucon.link_text') }}
      </NuxtLink>
    </section>

    <section class="gap-6 grid md:grid-cols-2">
      <article class="p-6 border border-gray-200 rounded-lg bg-white flex flex-col gap-4 shadow-sm">
        <h2 class="text-xl text-gray-900 font-semibold m-0">
          {{ t('donate.title') }}
        </h2>
        <p class="text-gray-700 leading-relaxed m-0">
          {{ t('donate.desc') }}
        </p>
        <NuxtLink
          class="text-white mt-auto px-4 py-2 rounded bg-cp-green w-max shadow-sm hover:shadow-md"
          target="_blank"
          to="https://s.coscup.org/individualsupporter"
        >
          {{ t('donate.link_text') }}
        </NuxtLink>
      </article>

      <article class="p-6 border border-gray-200 rounded-lg bg-white flex flex-col gap-4 shadow-sm">
        <h2 class="text-xl text-gray-900 font-semibold m-0">
          {{ t('call_for_sponsor.title') }}
        </h2>
        <p class="text-gray-700 leading-relaxed m-0">
          {{ t('call_for_sponsor.desc') }}
        </p>
        <NuxtLink
          class="text-white mt-auto px-4 py-2 rounded bg-cp-green w-max shadow-sm hover:shadow-md"
          :to="t('call_for_sponsor.link')"
        >
          {{ t('call_for_sponsor.link_text') }}
        </NuxtLink>
      </article>

      <article class="p-6 border border-gray-200 rounded-lg bg-white flex flex-col gap-4 shadow-sm">
        <h2 class="text-xl text-gray-900 font-semibold m-0">
          {{ t('accepted_booths.title') }}
        </h2>
        <p class="text-gray-700 leading-relaxed m-0">
          {{ t('accepted_booths.desc') }}
        </p>
        <NuxtLink
          class="text-white mt-auto px-4 py-2 rounded bg-cp-green w-max shadow-sm hover:shadow-md"
          target="_blank"
          :to="t('accepted_booths.link')"
        >
          {{ t('accepted_booths.link_text') }}
        </NuxtLink>
      </article>

      <article class="p-6 border border-gray-200 rounded-lg bg-white flex flex-col gap-4 shadow-sm">
        <h2 class="text-xl text-gray-900 font-semibold m-0">
          {{ t('bof.title') }}
        </h2>
        <p class="text-gray-700 leading-relaxed m-0">
          {{ t('bof.desc') }}
        </p>
        <NuxtLink
          class="text-white mt-auto px-4 py-2 rounded bg-cp-green w-max shadow-sm hover:shadow-md"
          target="_blank"
          :to="t('bof.link')"
        >
          {{ t('bof.link_text') }}
        </NuxtLink>
      </article>
    </section>
  </div>
</template>

<i18n lang="yaml">
en:
  meta:
    description: "COSCUP x UbuCon Asia 2026 — Taiwan's largest open source community conference."
  ubucon:
    title: "About UbuCon Asia"
    desc: "UbuCon Asia is a community-organized conference that brings together Ubuntu enthusiasts, engineers, creators, researchers, entrepreneurs, and contributors from across Asia, driven by volunteers from the Ubuntu community."
    link_text: "Visit UbuCon Asia 2026"
  event_details:
    title: "Event details"
    date:
      title: "Date"
      value: "August 8-9, 2026"
    venue:
      title: "Venue"
      name: "National Taiwan University of Science and Technology"
      address: "No. 43, Sec. 4, Keelung Rd., Da’an Dist., Taipei City"
      transportation: "Transportation and venue map"
  call_for_sponsor:
    title: "Support COSCUP"
    desc: "If you are interested in sponsoring COSCUP x UbuCon Asia 2026, please refer to our sponsorship package or contact us directly via email."
    link: "/en/sponsorship"
    link_text: "I want to sponsor"
  accepted_booths:
    title: "Full List of Accepted Community Booths at COSCUP x UbuCon Asia 2026"
    desc: "Community track and booth applications are now closed — see the full list of accepted community booths at COSCUP x UbuCon Asia 2026!"
    link: "https://blog.coscup.org/2026/06/coscup-x-ubucon-asia-2026-full-list-of.html"
    link_text: "View the list"
  bof:
    title: "BoF / Hacking Corner"
    desc: "Meet friends at the BoF sessions or hacking corners of COSCUP x UbuCon Asia 2026!"
    link: "https://blog.coscup.org/2026/06/coscup-2026-bof-hacking-corners.html"
    link_text: "Learn more"
  donate:
    title: "Individual Sponsorship"
    desc: "In the age of AI, help support the open-source community infrastructure and join us in supporting COSCUP x UbuCon Asia 2026!"
    link_text: "Individual Sponsorship"
    anchor: ""
zh:
  meta:
    description: "COSCUP x UbuCon Asia 2026——臺灣最大的開源社群年會。"
  ubucon:
    title: "關於 UbuCon Asia"
    desc: "UbuCon Asia 是由 Ubuntu 社群志工發起的社群年會，集結來自亞洲各地的 Ubuntu 愛好者、工程師、創作者、研究者、創業者與貢獻者。"
    link_text: "前往 UbuCon Asia 2026"
  event_details:
    title: "活動資訊"
    date:
      title: "活動日期"
      value: "2026 年 8 月 8 日至 9 日"
    venue:
      title: "活動地點"
      name: "國立臺灣科技大學"
      address: "台北市大安區基隆路四段 43 號"
      transportation: "交通方式與會場地圖"
  call_for_sponsor:
    title: "贊助 COSCUP"
    desc: "若您對贊助 COSCUP x UbuCon Asia 2026 有興趣，歡迎參考贊助方案，或直接透過電子郵件與我們聯繫。"
    link: "/sponsorship"
    link_text: "我要贊助"
  accepted_booths:
    title: "COSCUP x UbuCon Asia 2026 錄取攤位公告"
    desc: "社群議程軌與社群攤位申請已截止，一同來看 COSCUP x UbuCon Asia 2026 的錄取攤位名單！"
    link: "https://blog.coscup.org/2026/06/coscup-x-ubucon-asia-2026-full-list-of.html"
    link_text: "查看名單"
  bof:
    title: "BoF / Hacking Corner"
    desc: "在 COSCUP x UbuCon Asia 2026，來與朋友一起參加 BoF 會議或 Hacking Corner 吧！"
    link: "https://blog.coscup.org/2026/06/coscup-2026-bof-hacking-corners.html"
    link_text: "瞭解更多"
  donate:
    title: "個人贊助"
    desc: "AI 時代，撐起開源舞台鷹架，一同支持 COSCUP x UbuCon Asia 2026 吧！"
    link_text: "個人贊助"
    anchor: ""
</i18n>
