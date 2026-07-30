<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { useRoute } from 'vue-router'
import CpDropdown from './CpDropdown.vue'

const props = defineProps<{
  variant?: 'landing'
}>()

const route = useRoute()
const { locale, locales, defaultLocale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

type MenuItem = {
  key: string
  external?: boolean
  newPage?: boolean
} & (
  | { path: string, children?: never } |
  { path?: never, children: { label: string, path: string }[] }
)

const isApp = computed(() => route.query.mode === 'app')
const isLanding = computed(() => props.variant === 'landing')

const menu = computed<MenuItem[]>(() => [
  { key: 'about', path: '/about' },
  { key: 'session', path: '/session' },
  { key: 'transportation', path: '/transportation' },
  { key: 'venue', path: '/venue' },
  { key: 'sponsors', path: '/sponsor' },
  {
    key: 'participate',
    children: [
      { label: t('menu.participate_index'), path: '/participate' },
      { label: t('menu.participate_first_time'), path: '/participate/first-time' },
      { label: t('menu.participate_activity'), path: '/participate/activity' },
      { label: t('menu.participate_speaker_participation'), path: '/participate/speaker-participation' },
      { label: t('menu.participate_welcome_party'), path: '/participate/welcome-party' },
      { label: t('menu.participate_oversea'), path: '/participate/oversea' },
      { label: t('menu.participate_open_source_community'), path: '/participate/open-source-community' },
      { label: t('menu.participate_sponsor_partner'), path: '/participate/sponsor-partner' },
      { label: t('menu.invitation_letter_guide'), path: '/participate/invitation-letter-guide' },
    ],
  },
  { key: 'staff', path: '/staff' },
  { key: 'bof', path: 'https://docs.google.com/document/d/1ZerJ-5QYcEJ5guhxtK-SBW2BA6RMHtVJnqNIWxRCz18/edit?tab=t.0', external: true, newPage: true },
  { key: 'blog', path: 'https://blog.coscup.org/', external: true },
  { key: 'coc', path: `https://hackmd.io/@coscup/cococo-${locale.value}`, external: true },
])

const otherLocale = computed(() => {
  const defaultLocaleObject = locales.value.find((l) => l.code === defaultLocale)!
  return locales.value.find((l) => l.code !== locale.value) ?? defaultLocaleObject
})

const menuOpen = ref(false)
const mobileDropdownOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
  mobileDropdownOpen.value = false
}

// Overflow detection
const navRef = ref<HTMLElement>()
const logoRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const localeRef = ref<HTMLElement>()
const isOverflowing = ref(false)
let cachedMenuWidth = 0
let cachedLocaleWidth = 0

function checkOverflow() {
  if (!navRef.value || !menuRef.value || !logoRef.value || !localeRef.value) {
    return
  }

  if (!isOverflowing.value) {
    cachedMenuWidth = menuRef.value.scrollWidth
    cachedLocaleWidth = localeRef.value.offsetWidth
  }

  const needed = logoRef.value.offsetWidth +
    (cachedMenuWidth || menuRef.value.scrollWidth) +
    (cachedLocaleWidth || localeRef.value.offsetWidth) +
    24 // gap allowance
  isOverflowing.value = needed > navRef.value.clientWidth
}

useResizeObserver(navRef, checkOverflow)
</script>

<template>
  <nav
    v-if="!isApp"
    ref="navRef"
    class="px-3 py-1 border-b flex h-16 justify-between relative *:h-full"
    :class="isLanding
      ? 'border-landing-accent bg-landing-accent text-white'
      : 'border-gray-300 bg-white text-gray-700'"
  >
    <div
      ref="logoRef"
      class="flex flex-shrink-0 items-center"
    >
      <NuxtLinkLocale
        class="flex h-full items-center"
        to="/"
      >
        <NuxtPicture
          :alt="t('logo_alt')"
          :img-attrs="{ class: 'object-contain h-8' }"
          :src="isLanding ? '/coscup_logo_white.png' : '/coscup_logo.png'"
        />
      </NuxtLinkLocale>
    </div>

    <!-- Desktop menu -->
    <ul
      ref="menuRef"
      :class="isOverflowing ? 'hidden' : 'flex gap-3 items-center justify-center'"
    >
      <li
        v-for="item in menu"
        :key="item.key"
      >
        <NuxtLinkLocale
          v-if="!item.children"
          class="flex gap-1 whitespace-nowrap items-center"
          :external="item.external"
          :rel="item.newPage ? 'noopener noreferrer' : undefined"
          :target="item.newPage ? '_blank' : undefined"
          :to="item.path"
        >
          {{ t(`menu.${item.key}`) }}
          <Icon
            v-if="item.external"
            name="tabler:external-link"
          />
        </NuxtLinkLocale>
        <CpDropdown
          v-else
          :items="item.children"
          :label="t(`menu.${item.key}`)"
        />
      </li>
    </ul>

    <!-- Right side: locale switcher (desktop) or hamburger -->
    <div class="flex items-center">
      <div
        ref="localeRef"
        :class="isOverflowing ? 'hidden' : 'flex items-center'"
      >
        <NuxtLink
          class="flex gap-1 items-center"
          :to="switchLocalePath(otherLocale.code)"
        >
          <Icon name="tabler:world" />
          {{ otherLocale.name }}
        </NuxtLink>
      </div>

      <button
        v-if="isOverflowing"
        :aria-expanded="menuOpen"
        :aria-label="t('menu_toggle')"
        class="p-2 rounded"
        :class="isLanding ? 'hover:bg-white/15' : 'hover:bg-gray-100'"
        type="button"
        @click="menuOpen = !menuOpen"
      >
        <Icon
          :name="menuOpen ? 'tabler:x' : 'tabler:menu-2'"
          size="24"
        />
      </button>
    </div>

    <!-- Mobile backdrop -->
    <div
      v-if="menuOpen && isOverflowing"
      class="bg-black/30 inset-0 top-16 fixed z-modal"
      @click="closeMenu"
    />

    <!-- Mobile dropdown -->
    <div
      v-if="menuOpen && isOverflowing"
      class="text-gray-700 border-b border-gray-300 bg-white h-max shadow-md left-0 right-0 top-16 absolute z-toast"
    >
      <ul class="py-2 flex flex-col">
        <template
          v-for="item in menu"
          :key="item.key"
        >
          <li v-if="!item.children">
            <NuxtLinkLocale
              class="px-4 py-3 flex gap-1 items-center hover:bg-gray-50"
              :external="item.external"
              :rel="item.newPage ? 'noopener noreferrer' : undefined"
              :target="item.newPage ? '_blank' : undefined"
              :to="item.path"
              @click="closeMenu"
            >
              {{ t(`menu.${item.key}`) }}
              <Icon
                v-if="item.external"
                name="tabler:external-link"
              />
            </NuxtLinkLocale>
          </li>
          <li v-else>
            <button
              class="px-4 py-3 flex gap-1 w-full items-center hover:bg-gray-50"
              type="button"
              @click="mobileDropdownOpen = !mobileDropdownOpen"
            >
              {{ t(`menu.${item.key}`) }}
              <Icon
                class="transition-transform"
                :class="mobileDropdownOpen ? 'rotate-180' : ''"
                name="tabler:chevron-down"
                size="16"
              />
            </button>
            <ul v-if="mobileDropdownOpen">
              <li
                v-for="child in item.children"
                :key="child.path"
              >
                <NuxtLinkLocale
                  class="px-4 py-3 pl-8 flex gap-1 items-center hover:bg-gray-50"
                  :to="child.path"
                  @click="closeMenu"
                >
                  {{ child.label }}
                </NuxtLinkLocale>
              </li>
            </ul>
          </li>
        </template>
        <li class="mt-1 pt-1 border-t border-gray-200">
          <NuxtLink
            class="px-4 py-3 flex gap-1 items-center hover:bg-gray-50"
            :to="switchLocalePath(otherLocale.code)"
            @click="closeMenu"
          >
            <Icon name="tabler:world" />
            {{ otherLocale.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<i18n lang="yaml">
en:
  logo_alt: "COSCUP x UbuCon Asia 2026 Logo"
  menu_toggle: "Toggle menu"
  menu:
    home: "Home"
    session: "Session"
    about: "About"
    transportation: "Transportation"
    venue: "Venue"
    participate: "Participate"
    participate_index: "Participate Guide"
    participate_first_time: "First Timer"
    participate_activity: "Activity"
    participate_speaker_participation: "Speaker Participation"
    participate_welcome_party: "Welcome Party"
    participate_oversea: "For Overseas Visitors"
    participate_open_source_community: "Open Source Communities"
    participate_sponsor_partner: "Sponsorship Partners"
    invitation_letter_guide: "Invitation Letter Guide"
    sponsors: "Sponsors"
    staff: "Staff"
    bof: "Fringe Events / BoF"
    blog: "Blog"
    coc: "CoC"
zh:
  logo_alt: "COSCUP x UbuCon Asia 2026 標誌"
  menu_toggle: "切換選單"
  menu:
    home: "首頁"
    session: "議程"
    about: "關於我們"
    transportation: "交通"
    venue: "會場地圖"
    participate: "參與指南"
    participate_index: "參與指南"
    participate_first_time: "第一次參與"
    participate_activity: "活動參與"
    participate_speaker_participation: "講者參與"
    participate_welcome_party: "前夜派對"
    participate_oversea: "海外參與者"
    participate_open_source_community: "開源社群、攤位及議程軌"
    participate_sponsor_partner: "贊助夥伴"
    sponsors: "贊助夥伴"
    staff: "工作人員"
    bof: "周邊活動 / BoF"
    invitation_letter_guide: "邀請函申請指南"
    blog: "部落格"
    coc: "社群守則"
</i18n>
