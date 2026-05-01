import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.path.startsWith('/session') && from.path.startsWith('/session')) {
      return false
    }

    return { top: 0 }
  },
} satisfies RouterConfig
