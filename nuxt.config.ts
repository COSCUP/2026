import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/2026/',
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/2026/favicon.svg' },
      ],
    },
  },

  nitro: {
    output: {
      publicDir: process.env.NUXT_OUTPUT_DIR || '.output/public',
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
  },
})
