<script setup lang="ts">
import type { Ad } from '#shared/types/ad'
import type { SessionDetail } from '#shared/types/session'
import { useI18n } from 'vue-i18n'
import CpSessionDetailModal from '~/components/feature/CpSessionDetailModal.vue'
import { DEFAULT_TRACK_COLOR } from '~/utils/tracks'

const { locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const sessionId = computed(() => String(route.params.id ?? ''))

const { data: sessionDetail, error } = await useFetch<SessionDetail>(`/api/session/${sessionId.value}`)
if (error.value) {
  throw error.value.statusCode === 404
    ? createError({ status: 404, statusText: 'Page Not Found' })
    : error.value
}
const { data: ad } = await useFetch<Ad[]>('/api/ad')

const localeKey = computed(() => locale.value === 'zh' ? 'zh' : 'en')
// Extract the yyyy-MM-dd part from the session start date.
const sessionDay = computed(() => sessionDetail.value?.start?.slice(0, 10) ?? null)

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
        color: sessionDetail.value.trackColor,
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
  const day = sessionDay.value
  router.push(localePath(day ? { path: '/session', query: { day } } : { path: '/session' }))
}
</script>

<template>
  <CpSessionDetailModal
    v-if="sessionInfo"
    :ads="ad ?? []"
    :co-write="sessionInfo.coWrite"
    :description="sessionInfo.description"
    :room="sessionInfo.room"
    :session-id="sessionId"
    :speakers="sessionInfo.speakers"
    :tags="sessionInfo.tags"
    :time="sessionInfo.time"
    :title="sessionInfo.title"
    :track="sessionInfo.track"
    :track-color="sessionDetail?.trackColor ?? DEFAULT_TRACK_COLOR"
    @close="close"
  />
</template>
