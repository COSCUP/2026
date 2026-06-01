import type { RouterConfig } from '@nuxt/schema'

const SESSION_PATH_RE = /^\/(?:[^/]+\/)?session(?:\/|$)/

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    const isSessionPath = (path: string) => SESSION_PATH_RE.test(path)

    if (isSessionPath(to.path) && isSessionPath(from.path)) {
      return false
    }

    return { top: 0 }
  },
} satisfies RouterConfig
