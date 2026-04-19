<script setup lang="ts">
import type { SessionDetail } from '#shared/types/session'
import CpSessionInfoCard from '~/components/feature/CpSessionInfoCard.vue'

const { locale } = useI18n()
const route = useRoute()
const router = useRouter()

const { data } = await useFetch<SessionDetail>(`/api/session/${route.params.id}`)

const localeKey = computed(() => locale.value === 'zh' ? 'zh' : 'en')

const sessionInfo = computed(() => {
  if (!data.value) {
    return null
  }

  const content = data.value[localeKey.value]
  const room = locale.value === 'zh'
    ? (data.value.room?.['zh-hans'] || data.value.room?.en || '')
    : (data.value.room?.en || data.value.room?.['zh-hans'] || '')

  return {
    coWrite: data.value.co_write ?? undefined,
    description: content.describe,
    room,
    speakers: data.value.speakers.map((speaker) => ({
      id: speaker.id,
      avatar: speaker.avatar ?? undefined,
      bio: speaker[localeKey.value].bio,
      name: speaker[localeKey.value].name,
    })),
    tags: data.value.tags,
    time: `${data.value.start?.slice(11, 16) ?? ''} ~ ${data.value.end?.slice(11, 16) ?? ''}`,
    title: content.title,
  }
})

function close() {
  router.push('/session')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
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
    class="bg-black/50 inset-0 fixed z-50"
    role="dialog"
    @click.self="close"
  >
    <div class="bg-white flex flex-row-reverse h-full w-120 right-0 top-0 fixed">
      <div>
        <!-- AD -->
      </div>

      <div class="p-3 h-full overflow-y-auto">
        <div class="flex top-0 justify-end sticky z-10">
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
