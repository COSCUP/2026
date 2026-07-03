import type { InjectionKey, Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { inject, provide } from 'vue'

const STORAGE_KEY = 'coscup-2026-favorite-sessions'

export interface FavoritesStore {
  favorites: Ref<Set<string>>
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  setFavorites: (ids: Iterable<string>) => void
}

const FavoritesKey: InjectionKey<FavoritesStore> = Symbol('favorites')

// Pretalx submission codes (e.g. `W3BES9`)
const CODE_PATTERN = /^[A-Z0-9]{1,16}$/i
const MAX_SHARED = 300

/** Serialize favorited session codes into a `?filter=` query value. */
export function encodeFavorites(ids: Iterable<string>): string {
  return [...new Set(ids)].sort().join(',')
}

/** Parse a `?filter=` query value back into a list of valid session codes. */
export function decodeFavorites(filter: string): string[] {
  return [...new Set(
    filter
      .split(',')
      .map((code) => code.trim())
      .filter((code) => CODE_PATTERN.test(code)),
  )].slice(0, MAX_SHARED)
}

function createFavoritesStore(): FavoritesStore {
  // Server-side this store is re-created for every prerendered route; using
  // useStorage there leaks reactive effects and OOMs the build. `initOnMounted`
  // also keeps the first client render an empty Set, matching the SSG markup.
  const favorites = useStorage(STORAGE_KEY, new Set<string>(), undefined, { initOnMounted: true })

  function isFavorite(id: string) {
    return favorites.value.has(id)
  }

  function toggleFavorite(id: string) {
    // A fresh Set so consumers re-render.
    const next = new Set(favorites.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    favorites.value = next
  }

  function setFavorites(ids: Iterable<string>) {
    favorites.value = new Set(ids)
  }

  return { favorites, isFavorite, toggleFavorite, setFavorites }
}

/** Create the favorites store and provide it to the tree. Call once at the app root. */
export function provideFavorites(): FavoritesStore {
  const store = createFavoritesStore()
  provide(FavoritesKey, store)
  return store
}

export function useFavorites(): FavoritesStore {
  const store = inject(FavoritesKey)
  if (!store) {
    throw new Error('useFavorites() requires provideFavorites() to be called by an ancestor (see app.vue).')
  }
  return store
}

/**
 * The bookmark `aria-label` for a session, resolved by the parent list so the
 * per-card `CpSessionItem` stays free of an i18n scope (hundreds of cards would
 * otherwise OOM the prerender). Shared by both the table and list layouts.
 */
export function useFavoriteLabel(): (id: string, preview?: boolean) => string {
  const { isFavorite } = useFavorites()
  const { t } = useI18n({
    useScope: 'local',
    messages: {
      en: { add: 'Add to favorites', remove: 'Remove from favorites' },
      zh: { add: '加入收藏', remove: '取消收藏' },
    },
  })

  return (id, preview = false) => (preview || isFavorite(id)) ? t('remove') : t('add')
}
