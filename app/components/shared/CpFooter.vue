<script setup lang="ts">
import { useI18n } from '#imports'

const { t, tm, rt } = useI18n()

interface ContactItem {
  name: string
  email: string
}

interface SocialItem {
  icon: string
  label: string
  name: string
  url: string
}

interface ResourceItem {
  label: string
  name: string
  url: string
}

interface CommunityItem {
  name: string
  url: string
}

const pastYears = Array.from(
  { length: new Date().getFullYear() - 2006 },
  (_, i) => 2006 + i,
)

const socials = computed(() => tm('socials') as SocialItem[])
const contacts = computed(() => tm('contact.items') as ContactItem[])
const resources = computed(() => tm('resources.items') as ResourceItem[])
const sitemaps = computed(() => tm('sitemap.items') as CommunityItem[])
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
            :key="rt(social.name)"
            :aria-label="rt(social.label)"
            class="text-gray-500 rounded-full bg-gray-100 flex size-9 transition-colors items-center justify-center hover:text-white hover:bg-cp-green"
            :href="rt(social.url)"
            target="_blank"
            :title="rt(social.label)"
          >
            <Icon :name="rt(social.icon)" />
          </NuxtLink>
        </div>
      </div>

      <div>
        <h3 class="text-xs text-cp-green tracking-wider font-semibold mb-5 uppercase">
          {{ t('contact.title') }}
        </h3>
        <ul class="space-y-3">
          <li
            v-for="contact in contacts"
            :key="rt(contact.name)"
          >
            <NuxtLink
              class="text-sm text-gray-600 transition-colors hover:text-cp-green"
              :href="`mailto:${rt(contact.email)}`"
            >
              {{ rt(contact.name) }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xs text-cp-green tracking-wider font-semibold mb-5 uppercase">
          {{ t('resources.title') }}
        </h3>
        <ul class="space-y-3">
          <li
            v-for="resource in resources"
            :key="rt(resource.name)"
          >
            <NuxtLink
              class="text-sm text-gray-600 transition-colors hover:text-cp-green"
              :href="rt(resource.url)"
              target="_blank"
            >
              {{ rt(resource.label) }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xs text-cp-green tracking-wider font-semibold mb-5 uppercase">
          {{ t('sitemap.title') }}
        </h3>
        <ul class="space-y-3">
          <li
            v-for="sitemap in sitemaps"
            :key="rt(sitemap.name)"
          >
            <NuxtLink
              class="text-sm text-gray-600 transition-colors hover:text-cp-green"
              :href="rt(sitemap.url)"
            >
              {{ rt(sitemap.name) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="mx-auto mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-1 max-w-[1100px] tabular-nums">
      <NuxtLink
        v-for="year in pastYears"
        :key="year"
        class="text-xs text-gray-400 px-2 py-1 rounded transition-colors hover:text-cp-green hover:bg-cp-green/6"
        :href="`https://coscup.org/${year}/`"
        target="_blank"
      >
        {{ year }}
      </NuxtLink>
    </div>
  </footer>
</template>

<i18n lang="yaml">
zh:
  sponsors: 贊助夥伴 Sponsors
  tagline: |
   Conference for Open Source Coders, Users, and Promoters \|
   亞洲最大開源年會，由社群自發舉辦。
  socials:
    - name: facebook
      icon: tabler:brand-facebook
      label: Facebook
      url: https://www.facebook.com/coscup/
    - name: x
      icon: tabler:brand-x
      label: X
      url: https://twitter.com/coscup
    - name: youtube
      icon: tabler:brand-youtube
      label: YouTube
      url: https://www.youtube.com/user/thecoscup
    - name: telegram
      icon: tabler:brand-telegram
      label: Telegram
      url: https://t.me/coscupchat
    - name: mastodon
      icon: tabler:brand-mastodon
      label: Mastodon
      url: https://floss.social/%40COSCUP
    - name: linkedin
      icon: tabler:brand-linkedin
      label: LinkedIn
      url: https://www.linkedin.com/company/coscup-tw/
  contact:
    title: 聯絡我們
    items:
      - name: 會眾服務
        email: attendee%40coscup.org
      - name: 贊助合作
        email: sponsorship%40coscup.org
      - name: 議程投稿
        email: program%40coscup.org
      - name: 行銷方案
        email: marketing%40coscup.org

  resources:
    title: 相關資源
    items:
      - name: blog
        label: COSCUP 部落格
        url: https://blog.coscup.org/
      - name: newsletter
        label: 訂閱電子報
        url: https://secretary.coscup.org/subscribe/coscup
      - name: photos
        label: 活動照片
        url: https://www.flickr.com/photos/coscup/
  sitemap:
    title: 網站導覽
    items:
      - name: 首頁
        url: /
      - name: 關於我們
        url: /about
      - name: 交通資訊
        url: /transportation
en:
  sponsors: Sponsors
  tagline: |
   Conference for Open Source Coders, Users, and Promoters \|
   Asia's largest open source community conference.
  socials:
    - name: facebook
      icon: tabler:brand-facebook
      label: Facebook
      url: https://www.facebook.com/coscup/
    - name: x
      icon: tabler:brand-x
      label: X
      url: https://twitter.com/coscup
    - name: youtube
      icon: tabler:brand-youtube
      label: YouTube
      url: https://www.youtube.com/user/thecoscup
    - name: telegram
      icon: tabler:brand-telegram
      label: Telegram
      url: https://t.me/coscupchat
    - name: mastodon
      icon: tabler:brand-mastodon
      label: Mastodon
      url: https://floss.social/%40COSCUP
    - name: linkedin
      icon: tabler:brand-linkedin
      label: LinkedIn
      url: https://www.linkedin.com/company/coscup-tw/
  contact:
    title: Contact
    items:
      - name: Attendee Services
        email: attendee%40coscup.org
      - name: Sponsorship
        email: sponsorship%40coscup.org
      - name: Call for Proposals
        email: program%40coscup.org
      - name: Marketing
        email: marketing%40coscup.org
  resources:
    title: Resources
    items:
      - name: blog
        label: COSCUP Blog
        url: https://blog.coscup.org/
      - name: newsletter
        label: Newsletter Subscription
        url: https://secretary.coscup.org/subscribe/coscup
      - name: photos
        label: Event Photos
        url: https://www.flickr.com/photos/coscup/
  sitemap:
    title: Sitemap
    items:
      - name: Home
        url: /
      - name: About
        url: /about
      - name: Transportation
        url: /transportation
</i18n>
