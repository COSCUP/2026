import type { RouterConfig } from '@nuxt/schema'

const SESSION_PATH_RE = /^\/(?:[^/]+\/)?session(?:\/|$)/
const TRACK_PATH_RE = /^\/(?:[^/]+\/)?track(?:\/|$)/

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    const isSessionPath = (path: string) => SESSION_PATH_RE.test(path)

    if (isSessionPath(to.path) && isSessionPath(from.path)) {
      return false
    }

    // 議程軌頁面只變更 query/hash（例如以 ?session= 展開議程面板）時，維持捲動位置。
    if (TRACK_PATH_RE.test(to.path) && to.path === from.path) {
      return false
    }

    return { top: 0 }
  },
} satisfies RouterConfig
