import { defineNuxtConfig } from 'nuxt/config'

const YEAR = '2026'
const TITLE = 'COSCUP 2026 x UbuCon Asia'
const TITLE_ZH = '開源人年會 2026 x UbuCon Asia'
const DESC = 'Conference for Open Source Coders, Users, and Promoters is a free annual conference providing a platform to connect FLOSS folks across Asia since 2006. It\'s a major force of free software movement advocacy in Taiwan.'
const URL = `https://coscup.org/${YEAR}`

const EVENT_COMMON = {
  startDate: '2026-08-08T09:00:00+08:00',
  endDate: '2026-08-09T17:00:00+08:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  inLanguage: ['zh-Hant-TW', 'en'],
  location: {
    '@type': 'Place',
    'name': 'National Taiwan University of Science and Technology',
    'sameAs': 'https://en.wikipedia.org/wiki/National_Taiwan_University_of_Science_and_Technology',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'No. 43, Sec. 4, Keelung Road',
      'addressLocality': 'Da\'an District',
      'addressRegion': 'Taipei',
      'postalCode': '106335',
      'addressCountry': 'TW',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 25.0137,
      'longitude': 121.5405,
    },
  },
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    baseURL: '/2026',
    head: {
      title: TITLE,
      titleTemplate: `%s | ${TITLE}`,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/2026/favicon.svg' },
      ],
      meta: [
        { name: 'description', content: DESC },
        { property: 'og:title', content: TITLE },
        { property: 'og:description', content: DESC },
        { property: 'og:site_name', content: TITLE },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESC },
        { name: 'twitter:site', content: '@coscup' },
      ],
      script: [
        {
          type: 'application/ld+json',
          textContent: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            'name': TITLE,
            'alternateName': TITLE_ZH,
            'description': DESC,
            'url': URL,
            ...EVENT_COMMON,
            'isAccessibleForFree': true,
            'image': [`${URL}/coscup_logo.png`],
            'organizer': {
              '@type': 'Organization',
              'name': 'COSCUP',
              'url': 'https://coscup.org/',
              'sameAs': [
                'https://en.wikipedia.org/wiki/COSCUP',
                'https://www.wikidata.org/wiki/Q10846717',
              ],
            },
            'subEvent': {
              '@type': 'Event',
              'name': 'UbuCon Asia 2026',
              'url': 'https://2026.ubucon.asia/',
              ...EVENT_COMMON,
            },
          }),
        },
      ],
    },
  },

  nitro: {
    output: {
      publicDir: process.env.NUXT_OUTPUT_DIR || '.output/public',
    },
    prerender: {
      failOnError: false,
    },
  },

  imports: {
    scan: false,
  },

  typescript: {
    typeCheck: true,
    tsConfig: {
      vueCompilerOptions: {
        strictTemplates: true,
        strictVModel: true,
        strictCssModules: true,
        checkUnknownProps: true,
        checkUnknownEvents: true,
        checkUnknownDirectives: true,
        checkUnknownComponents: true,
        target: 3.5,
      },
    },
  },

  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    'nuxt-gtag',
    'nuxt-og-image',
  ],

  // Origin only — app.baseURL ('/2026') is appended automatically by nuxt-site-config.
  site: {
    url: 'https://coscup.org',
    name: TITLE,
  },

  fonts: {
    // global: true required so nuxt-og-image's renderer can use these fonts.
    // Only weight 400: the Takumi renderer corrupts the 700-weight CJK glyphs
    // (double-draw artifacts), so OG templates render CJK at regular weight.
    // Order matters: Takumi picks one font per script run, so the widest-coverage
    // CJK font (SC) must be first.
    families: [
      { name: 'Noto Sans SC', weights: [400], global: true },
      { name: 'Noto Sans TC', weights: [400], global: true },
      { name: 'Noto Sans JP', weights: [400], global: true },
      { name: 'Noto Sans KR', weights: [400], global: true },
    ],
  },

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
    // Match site.url so nuxt-site-config can build absolute hreflang/canonical links.
    baseUrl: 'https://coscup.org',
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
    baseUrl: URL,
  },

  gtag: {
    id: 'G-C9EMTMDSS1',
    enabled: process.env.NODE_ENV === 'production',
    config: {
      page_title: 'COSCUP 2026',
    },
  },
})
