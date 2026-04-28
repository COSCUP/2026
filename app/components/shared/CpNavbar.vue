<script setup lang="ts">
const { locale, locales, defaultLocale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const menu = computed(() => [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'transportation', path: '/transportation' },
  { key: 'blog', path: 'https://blog.coscup.org/', external: true },
  { key: 'coc', path: `https://hackmd.io/@coscup/cococo-${locale.value}`, external: true },
])

const otherLocale = computed(() => {
  const defaultLocaleObject = locales.value.find((l) => l.code === defaultLocale)!
  return locales.value.find((l) => l.code !== locale.value) ?? defaultLocaleObject
})

const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <nav class="text-gray-700 px-3 py-1 border-b border-gray-300 bg-white flex h-16 justify-between relative *:h-full">
    <div class="flex items-center">
      <NuxtPicture
        :alt="t('logo_alt')"
        :img-attrs="{ class: 'object-cover h-8' }"
        src="/coscup_logo.png"
      />
    </div>

    <!-- Desktop menu -->
    <ul class="gap-3 hidden items-center justify-center sm:flex">
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
      class="bg-black/30 inset-0 top-16 fixed z-40 sm:hidden"
      @click="closeMenu"
    />

    <!-- Mobile dropdown -->
    <div
      v-if="menuOpen"
      class="border-b border-gray-300 bg-white h-max shadow-md left-0 right-0 top-16 absolute z-50 sm:hidden"
    >
      <ul class="py-2 flex flex-col">
        <li
          v-for="item in menu"
          :key="item.key"
        >
          <NuxtLinkLocale
            class="px-4 py-3 flex gap-1 items-center hover:bg-gray-50"
            :external="item.external"
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
  logo_alt: "COSCUP 2026 Logo"
  menu_toggle: "Toggle menu"
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
  menu_toggle: "切換選單"
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
