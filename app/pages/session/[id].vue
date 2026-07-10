<script setup lang="ts">
import type { Ad } from '#shared/types/ad'
import type { SessionDetail } from '#shared/types/session'
import { useMediaQuery } from '@vueuse/core'
import CpSessionInfoCard from '~/components/feature/CpSessionInfoCard.vue'

const { locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const isDesktop = useMediaQuery('(min-width: 640px)')

const { data: sessionDetail, error } = await useFetch<SessionDetail>(`/api/session/${route.params.id}`)
if (error.value) {
  throw error.value.statusCode === 404
    ? createError({ status: 404, statusText: 'Page Not Found' })
    : error.value
}
const { data: ad } = await useFetch<Ad[]>('/api/ad')
const randomAd = ref<Ad | null>(null)

const localeKey = computed(() => locale.value === 'zh' ? 'zh' : 'en')

const sessionInfo = computed(() => {
  if (!sessionDetail.value) {
    return null
  }

  const content = sessionDetail.value[localeKey.value]
  const room = locale.value === 'zh'
    ? (sessionDetail.value.room?.['zh-hant'] || sessionDetail.value.room?.en || '')
    : (sessionDetail.value.room?.en || sessionDetail.value.room?.['zh-hant'] || '')

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
    time: `${sessionDetail.value.start?.slice(11, 16) ?? ''} ~ ${sessionDetail.value.end?.slice(11, 16) ?? ''}`,
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
    class="bg-black/50 inset-0 fixed z-modal"
    role="dialog"
    @click.self="close"
  >
    <div class="bg-white flex flex-row-reverse h-full w-full right-0 top-0 fixed sm:w-auto">
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

      <div class="p-3 h-full w-full overflow-y-auto sm:w-120">
        <div class="flex top-0 justify-end sticky z-content">
          <button
            aria-label="close"
            class="text-gray-500 rounded-full flex h-8 w-8 transition-colors items-center justify-center hover:bg-gray-100"
            type="button"
            @click="close"
          >
            <Icon
              class="h-4 w-4"
              name="tabler:x"
            />
          </button>
        </div>

        <CpSessionInfoCard
          v-if="sessionInfo"
          :ad="randomAd"
          :co-write="sessionInfo.coWrite"
          :description="sessionInfo.description"
          :room="sessionInfo.room"
          :speakers="sessionInfo.speakers"
          :tags="sessionInfo.tags"
          :time="sessionInfo.time"
          :title="sessionInfo.title"
        />
      </div>
    </div>
  </div>
</template>
