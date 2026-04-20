<script setup lang="ts">
import { useI18n } from '#imports'

const { t, locale } = useI18n()

const pastYears = Array.from(
  { length: new Date().getFullYear() - 2006 },
  (_, i) => 2006 + i,
)

const socials = [
  {
    name: 'facebook',
    icon: 'tabler:brand-facebook',
    url: 'https://www.facebook.com/coscup/',
    label: { en: 'Facebook', zh: 'Facebook' },
  },
  {
    name: 'x',
    icon: 'tabler:brand-x',
    url: 'https://twitter.com/coscup',
    label: { en: 'X', zh: 'X' },
  },
  {
    name: 'youtube',
    icon: 'tabler:brand-youtube',
    url: 'https://www.youtube.com/user/thecoscup',
    label: { en: 'YouTube', zh: 'YouTube' },
  },
  {
    name: 'telegram',
    icon: 'tabler:brand-telegram',
    url: 'https://t.me/coscupchat',
    label: { en: 'Telegram', zh: 'Telegram' },
  },
  {
    name: 'mastodon',
    icon: 'tabler:brand-mastodon',
    url: 'https://floss.social/@COSCUP',
    label: { en: 'Mastodon', zh: 'Mastodon' },
  },
  {
    name: 'linkedin',
    icon: 'tabler:brand-linkedin',
    url: 'https://www.linkedin.com/company/coscup-tw/',
    label: { en: 'LinkedIn', zh: 'LinkedIn' },
  },
]

const contacts = [
  {
    name: 'attendee',
    email: 'attendee@coscup.org',
    label: { en: 'Attendee Services', zh: '會眾服務' },
  },
  {
    name: 'sponsorship',
    email: 'sponsorship@coscup.org',
    label: { en: 'Sponsorship', zh: '贊助合作' },
  },
  {
    name: 'program',
    email: 'program@coscup.org',
    label: { en: 'Call for Proposals', zh: '議程投稿' },
  },
  {
    name: 'marketing',
    email: 'marketing@coscup.org',
    label: { en: 'Marketing', zh: '行銷方案' },
  },
]

const resources = [
  {
    name: 'blog',
    url: 'https://blog.coscup.org/',
    label: { en: 'COSCUP Blog', zh: 'COSCUP 部落格' },
  },
  {
    name: 'newsletter',
    url: 'https://secretary.coscup.org/subscribe/coscup',
    label: { en: 'Newsletter Subscription', zh: '訂閱電子報' },
  },
  {
    name: 'photos',
    url: 'https://www.flickr.com/photos/coscup/',
    label: { en: 'Event Photos', zh: '活動照片' },
  },
]

const communities = [
  { name: 'Facebook', url: 'https://www.facebook.com/coscup/' },
  { name: 'X / Twitter', url: 'https://twitter.com/coscup' },
  { name: 'Telegram', url: 'https://t.me/coscupchat' },
  { name: 'Mastodon', url: 'https://floss.social/@COSCUP' },
]
</script>

<template>
  <footer class="px-8 pb-8 pt-16 border-t border-gray-200 bg-white">
    <div class="mx-auto gap-12 grid grid-cols-[2fr_repeat(3,1fr)] max-w-[1100px] lt-md:grid-cols-2 lt-sm:grid-cols-1">
      <div class="lt-md:col-span-2 lt-sm:col-span-1">
        <h2 class="text-2xl text-gray-900 font-bold mb-2">
          COSCUP 2026
        </h2>
        <p class="text-sm text-gray-400 leading-relaxed max-w-[280px]">
          {{ t('tagline') }}
        </p>
        <div class="mt-6 flex gap-2">
          <NuxtLink
            v-for="social in socials"
            :key="social.name"
            :aria-label="social.label[locale]"
            class="text-gray-500 rounded-full bg-gray-100 flex size-9 transition-colors items-center justify-center hover:text-white hover:bg-cp-green"
            :href="social.url"
            rel="noopener noreferrer"
            target="_blank"
            :title="social.label[locale]"
          >
            <Icon :name="social.icon" />
          </NuxtLink>
        </div>
      </div>

      <div>
        <h3 class="text-xs text-cp-green tracking-wider font-semibold mb-5 uppercase">
          {{ t('contact') }}
        </h3>
        <ul class="space-y-3">
          <li
            v-for="contact in contacts"
            :key="contact.name"
          >
            <NuxtLink
              class="text-sm text-gray-600 transition-colors hover:text-cp-green"
              :href="`mailto:${contact.email}`"
            >
              {{ contact.label[locale] }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xs text-cp-green tracking-wider font-semibold mb-5 uppercase">
          {{ t('resources') }}
        </h3>
        <ul class="space-y-3">
          <li
            v-for="resource in resources"
            :key="resource.name"
          >
            <NuxtLink
              class="text-sm text-gray-600 transition-colors hover:text-cp-green"
              :href="resource.url"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ resource.label[locale] }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xs text-cp-green tracking-wider font-semibold mb-5 uppercase">
          {{ t('community') }}
        </h3>
        <ul class="space-y-3">
          <li
            v-for="community in communities"
            :key="community.name"
          >
            <NuxtLink
              class="text-sm text-gray-600 transition-colors hover:text-cp-green"
              :href="community.url"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ community.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="mx-auto mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-4 max-w-[1100px] items-center justify-between">
      <div class="flex flex-wrap gap-1">
        <NuxtLink
          v-for="year in pastYears"
          :key="year"
          class="text-xs text-gray-400 px-2 py-1 rounded transition-colors hover:text-cp-green hover:bg-cp-green/6"
          :href="`https://coscup.org/${year}/`"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ year }}
        </NuxtLink>
      </div>
      <span class="text-xs text-gray-300">COSCUP 2026</span>
    </div>
  </footer>
</template>

<i18n lang="yaml">
zh:
  sponsors: 贊助夥伴 Sponsors
  tagline: |
   Conference for Open Source Coders, Users, and Promoters
   亞洲最大開源年會，由社群自發舉辦。
  contact: 聯絡我們
  resources: 相關資源
  community: 社群連結
en:
  sponsors: Sponsors
  tagline: |
   Conference for Open Source Coders, Users, and Promoters
   Asia's largest open source community conference.
  contact: Contact
  resources: Resources
  community: Community
</i18n>
