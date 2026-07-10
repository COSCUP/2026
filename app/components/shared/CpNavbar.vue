<script setup lang="ts">
import CpDropdown from './CpDropdown.vue'

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

const menu = computed<MenuItem[]>(() => [
  { key: 'about', path: '/about' },
  { key: 'session', path: '/session' },
  { key: 'transportation', path: '/transportation' },
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
</script>

<template>
  <nav class="text-gray-700 px-3 py-1 border-b border-gray-300 bg-white flex h-16 justify-between relative *:h-full">
    <NuxtLinkLocale
      class="flex flex-shrink-0 items-center"
      to="/"
    >
      <NuxtPicture
        :alt="t('logo_alt')"
        :img-attrs="{ class: 'object-contain h-8' }"
        src="/coscup_logo.png"
      />
    </NuxtLinkLocale>

    <!-- Desktop menu -->
    <ul class="gap-3 hidden items-center justify-center sm:flex">
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

    <!-- Desktop locale switcher -->
    <div class="hidden items-center sm:flex">
      <NuxtLink
        class="flex gap-1 items-center"
        :to="switchLocalePath(otherLocale.code)"
      >
        <Icon name="tabler:world" />
        {{ otherLocale.name }}
      </NuxtLink>
    </div>

    <!-- Mobile hamburger button -->
    <div class="flex items-center sm:hidden">
      <button
        :aria-expanded="menuOpen"
        :aria-label="t('menu_toggle')"
        class="p-2 rounded hover:bg-gray-100"
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
      v-if="menuOpen"
      class="bg-black/30 inset-0 top-16 fixed z-modal sm:hidden"
      @click="closeMenu"
    />

    <!-- Mobile dropdown -->
    <div
      v-if="menuOpen"
      class="border-b border-gray-300 bg-white h-max shadow-md left-0 right-0 top-16 absolute z-toast sm:hidden"
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
    bof: "周邊活動 / BoF"
    invitation_letter_guide: "邀請函申請指南"
    blog: "部落格"
    coc: "社群守則"
</i18n>
