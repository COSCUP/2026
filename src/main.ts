import { ViteSSG } from 'vite-ssg'
import { createI18n } from 'vue-i18n'
import { routes } from 'vue-router/auto-routes'
import App from '@/App.vue'
import en from '@/locales/en.json'
import zhTW from '@/locales/zh-TW.json'
import 'virtual:uno.css'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'en': en,
    'zh-TW': zhTW,
  },
})

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    app.use(i18n)
  },
)
