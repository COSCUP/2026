<script setup lang="ts">
const { locale, locales, defaultLocale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const menu = computed(() => [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'transportation', path: '/transportation' },
  { key: 'sessions', path: '#' },
  { key: 'topics', path: '#' },
  { key: 'sponsors', path: '#' },
  { key: 'communities', path: '#' },
  { key: 'staff', path: '#' },
  { key: 'fringe', path: '#' },
  { key: 'blog', path: 'https://blog.coscup.org/', external: true },
  { key: 'coc', path: `https://hackmd.io/@coscup/cococo-${locale.value}`, external: true },
])

const otherLocale = computed(() => {
  const defaultLocaleObject = locales.value.find((l) => l.code === defaultLocale)!
  return locales.value.find((l) => l.code !== locale.value) ?? defaultLocaleObject
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <nav class="text-gray-700 px-3 py-1 bg-#f9f9f9 flex h-16 justify-between *:h-full">
      <div class="flex items-center">
        <NuxtPicture
          :alt="t('logo_alt')"
          :img-attrs="{ class: 'object-cover h-8' }"
          src="/coscup_logo.png"
        />
      </div>
      <ul class="flex gap-3 items-center justify-center">
        <li
          v-for="item in menu"
          :key="item.key"
        >
          <NuxtLinkLocale
            class="flex gap-1 whitespace-nowrap items-center"
            :external="item.external"
            :to="item.path"
          >
            {{ t(`menu.${item.key}`) }}
            <Icon
              v-if="item.external"
              name="tabler:external-link"
            />
          </NuxtLinkLocale>
        </li>
      </ul>
      <div class="flex items-center">
        <NuxtLink
          class="flex gap-1 items-center"
          :to="switchLocalePath(otherLocale.code)"
        >
          <Icon name="tabler:world" />
          {{ otherLocale.name }}
        </NuxtLink>
      </div>
    </nav>

    <NuxtPage class="mx-auto py-2" />
  </div>
</template>

<i18n lang="yaml">
en:
  logo_alt: "COSCUP 2026 Logo"
  menu:
    home: "Home"
    about: "About"
    transportation: "Transportation"
    sessions: "Sessions"
    topics: "Topics"
    sponsors: "Sponsors"
    communities: "Communities"
    staff: "Staff"
    fringe: "Fringe"
    blog: "Blog"
    coc: "CoC"
zh:
  logo_alt: "COSCUP 2026 標誌"
  menu:
    home: "首頁"
    about: "關於我們"
    transportation: "交通"
    sessions: "議程表"
    topics: "議程主題"
    sponsors: "贊助夥伴"
    communities: "社群夥伴"
    staff: "工作人員"
    fringe: "周邊活動"
    blog: "部落格"
    coc: "社群守則"
</i18n>
