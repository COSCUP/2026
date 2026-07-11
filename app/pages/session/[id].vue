<script setup lang="ts">
import type { Ad } from '#shared/types/ad'
import type { SessionDetail, SessionSummary } from '#shared/types/session'
import { useMediaQuery } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import CpSessionInfoCard from '~/components/feature/CpSessionInfoCard.vue'
import { useFavorites } from '~/composables/useFavorites'
import { buildTrackColorMap, trackKey } from '~/utils/tracks'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const isDesktop = useMediaQuery('(min-width: 640px)')
const sessionId = computed(() => String(route.params.id ?? ''))
const { isFavorite, toggleFavorite } = useFavorites()
const scroller = ref<HTMLElement | null>(null)
const dragOffsetY = ref(0)
const isDragging = ref(false)
const dragCloseThreshold = 140
const dragState = {
  startY: 0,
}

const { data: sessionDetail, error } = await useFetch<SessionDetail>(`/api/session/${sessionId.value}`)
if (error.value) {
  throw error.value.statusCode === 404
    ? createError({ status: 404, statusText: 'Page Not Found' })
    : error.value
}
const { data: sessionsByDay } = await useFetch<Record<string, SessionSummary[]>>('/api/session')
const { data: ad } = await useFetch<Ad[]>('/api/ad')
const randomAd = ref<Ad | null>(null)

const localeKey = computed(() => locale.value === 'zh' ? 'zh' : 'en')

const sessionTrackColor = computed(() => {
  const session = sessionDetail.value
  if (!session?.start) {
    return '#e76f51'
  }

  const day = session.start.slice(0, 10)
  const daySessions = sessionsByDay.value?.[day] ?? []
  const trackColors = buildTrackColorMap(daySessions)

  return trackColors.get(trackKey(session)) ?? '#e76f51'
})

const sessionInfo = computed(() => {
  if (!sessionDetail.value) {
    return null
  }

  const content = sessionDetail.value[localeKey.value]
  const room = locale.value === 'zh'
    ? (sessionDetail.value.room?.['zh-hant'] || sessionDetail.value.room?.en || '')
    : (sessionDetail.value.room?.en || sessionDetail.value.room?.['zh-hant'] || '')
  const track = sessionDetail.value.track
    ? {
        id: sessionDetail.value.track.id,
        name: locale.value === 'zh'
          ? (sessionDetail.value.track?.name?.['zh-hant'] || sessionDetail.value.track?.name?.en || '')
          : (sessionDetail.value.track?.name?.en || sessionDetail.value.track?.name?.['zh-hant'] || ''),
        color: sessionTrackColor.value,
      }
    : undefined

  return {
    coWrite: sessionDetail.value.co_write ?? undefined,
    description: content.describe,
    room,
    speakers: sessionDetail.value.speakers.map((speaker) => ({
      id: speaker.id,
      avatar: speaker.avatar ?? undefined,
      bio: speaker[localeKey.value].bio,
      name: speaker[localeKey.value].name,
    })),
    tags: sessionDetail.value.tags,
    track,
    time: `${sessionDetail.value.start?.slice(0, 16).replace('T', ' ') ?? ''} ~ ${sessionDetail.value.end?.slice(11, 16) ?? ''}`,
    title: content.title,
  }
})

useSeoMeta({
  title: () => sessionInfo.value?.title,
  description: () => sessionInfo.value?.description,
  ogTitle: () => sessionInfo.value?.title,
  ogDescription: () => sessionInfo.value?.description,
  twitterTitle: () => sessionInfo.value?.title,
  twitterDescription: () => sessionInfo.value?.description,
})

function close() {
  router.push(localePath({ path: '/session', query: route.query }))
}

const sheetStyle = computed(() => ({
  transform: dragOffsetY.value > 0 ? `translateY(${dragOffsetY.value}px)` : undefined,
  transition: isDragging.value ? 'none' : undefined,
}))

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && !!target.closest('a, button, input, textarea, select, [role="button"]')
}

function resetDrag() {
  isDragging.value = false
  dragOffsetY.value = 0
  dragState.startY = 0
}

function onTouchStart(event: TouchEvent) {
  if (isDesktop.value || event.touches.length !== 1 || isInteractiveTarget(event.target)) {
    return
  }

  if ((scroller.value?.scrollTop ?? 0) > 0) {
    return
  }

  isDragging.value = true
  dragState.startY = event.touches[0]?.clientY ?? 0
}

function onTouchMove(event: TouchEvent) {
  if (!isDragging.value || event.touches.length !== 1) {
    return
  }

  const distance = (event.touches[0]?.clientY ?? 0) - dragState.startY
  dragOffsetY.value = Math.max(0, distance)

  if (dragOffsetY.value > 0 && event.cancelable) {
    event.preventDefault()
  }
}

function onTouchEnd() {
  if (!isDragging.value) {
    return
  }

  if (dragOffsetY.value >= dragCloseThreshold) {
    close()
    return
  }

  resetDrag()
}

function pickWeightedAd(ads: Ad[]) {
  if (!ads.length) {
    return null
  }

  const weightedAds = ads.map((ad) => ({
    ad,
    weight: ad.weight,
  }))

  const totalWeight = weightedAds.reduce((total, { weight }) => (
    Number.isFinite(weight) && weight > 0 ? total + weight : total
  ), 0)

  if (totalWeight <= 0) {
    return ads[Math.floor(Math.random() * ads.length)] ?? null
  }

  let random = Math.random() * totalWeight

  for (const { ad, weight } of weightedAds) {
    if (!Number.isFinite(weight) || weight <= 0) {
      continue
    }

    random -= weight

    if (random < 0) {
      return ad
    }
  }

  return ads.at(-1) ?? null
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  randomAd.value = pickWeightedAd(ad.value ?? [])
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    :aria-label="sessionInfo?.title"
    aria-modal="true"
    class="bg-black/50 flex items-end inset-0 justify-center fixed z-modal sm:items-center"
    role="dialog"
    @click.self="close"
  >
    <div
      class="rounded-lg bg-white flex flex-col h-80vh max-w-5xl w-full transition-transform duration-200 ease-out overflow-hidden sm:h-70vh sm:w-80vw"
      :style="sheetStyle"
      @touchcancel="resetDrag"
      @touchend="onTouchEnd"
      @touchmove="onTouchMove"
      @touchstart="onTouchStart"
    >
      <div
        class="h-2"
        :style="{ backgroundColor: sessionTrackColor }"
      />

      <div class="flex flex-1 min-h-0">
        <NuxtLink
          v-if="randomAd && isDesktop"
          class="shrink-0 h-full aspect-[1/4]"
          target="_blank"
          :to="randomAd.link"
        >
          <!-- AD -->
          <NuxtImg
            :alt="randomAd.id"
            class="h-full w-full object-contain"
            :src="randomAd.imageVertical"
          />
        </NuxtLink>

        <div
          ref="scroller"
          class="h-full w-full overflow-y-auto"
        >
          <div class="py-2 flex justify-center sm:hidden">
            <div class="rounded-full bg-gray-300 h-1 w-10" />
          </div>

          <div class="mr-4 flex gap-2 h-0 top-5 justify-end relative z-content overflow-visible sm:mr-6">
            <button
              :aria-label="isFavorite(sessionId) ? t('removeFavorite') : t('addFavorite')"
              class="text-sm font-500 px-3 border-2 rounded flex gap-1 h-8 cursor-pointer transition-colors items-center"
              :class="isFavorite(sessionId) ? 'bg-favorite border-favorite text-white' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'"
              @click="toggleFavorite(sessionId)"
            >
              <Icon
                class="h-4 w-4"
                :class="isFavorite(sessionId) ? 'text-white' : 'text-gray-500'"
                :name="isFavorite(sessionId) ? 'tabler:star-filled' : 'tabler:star'"
              />
              <span class="hidden sm:inline">{{ isFavorite(sessionId) ? t('saved') : t('save') }}</span>
            </button>
            <button
              aria-label="close"
              class="text-gray-500 rounded flex h-8 w-8 cursor-pointer transition-colors items-center justify-center hover:bg-gray-100"
              type="button"
              @click="close"
            >
              <Icon
                class="h-5 w-5"
                name="tabler:x"
              />
            </button>
          </div>

          <CpSessionInfoCard
            v-if="sessionInfo"
            :ad="randomAd"
            :co-write="sessionInfo.coWrite"
            :description="sessionInfo.description"
            has-title-margin-right
            :room="sessionInfo.room"
            :speakers="sessionInfo.speakers"
            :tags="sessionInfo.tags"
            :time="sessionInfo.time"
            :title="sessionInfo.title"
            :track="sessionInfo.track"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
  en:
    addFavorite: 'Save session'
    removeFavorite: 'Remove from favorites'
    save: 'Save'
    saved: 'Saved'
  zh:
    addFavorite: '收藏議程'
    removeFavorite: '取消收藏議程'
    save: '收藏'
    saved: '已收藏'
</i18n>
