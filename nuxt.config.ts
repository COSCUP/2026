import { defineNuxtConfig } from 'nuxt/config'

const YEAR = '2026'
const TITLE = 'COSCUP 2026 x UbuCon Asia'
const DESC = 'Conference for Open Source Coders, Users, and Promoters is a free annual conference providing a platform to connect FLOSS folks across Asia since 2006. It\'s a major force of free software movement advocacy in Taiwan.'
const URL = `https://coscup.org/${YEAR}`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    baseURL: '/2026/',
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/2026/favicon.svg' },
        { rel: 'canonical', href: URL },
      ],
      meta: [
        { property: 'title', content: TITLE },
        { property: 'description', content: DESC },
        { property: 'og:title', content: TITLE },
        { property: 'og:description', content: DESC },
        { property: 'og:url', content: URL },
        { property: 'og:site:name', content: TITLE },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESC },
        { name: 'twitter:site', content: '@coscup' },
      ],
    },
  },

  nitro: {
    output: {
      publicDir: process.env.NUXT_OUTPUT_DIR || '.output/public',
    },
  },

  imports: {
    scan: false,
  },

  typescript: {
    typeCheck: true,
  },

  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    'nuxt-gtag',
  ],

  content: {
    experimental: { nativeSqlite: true },
    renderer: { anchorLinks: false },
  },

  eslint: {
    config: { standalone: false },
  },

  icon: {
    customCollections: [
      { prefix: 'local', dir: './app/assets/icons' },
    ],
    class: 'icon',
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', language: 'en-US' },
      { code: 'zh', name: '中文', language: 'zh-Hant-TW' },
    ],
    defaultLocale: 'zh',
    detectBrowserLanguage: false, // https://github.com/nuxt-modules/i18n/issues/3262
  },

  runtimeConfig: {
    pretalxApiToken: '',
    pretalxApiUrl: '',
    googleSheetId: '',
  },

  gtag: {
    id: 'G-C9EMTMDSS1',
    enabled: process.env.NODE_ENV === 'production',
    config: {
      page_title: 'COSCUP 2026',
    },
  },
})
