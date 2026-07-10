<script setup lang="ts">
import type { SessionSummary } from '#shared/types/session'
import { useI18n } from '#imports'
import CpSessionInfoCard from './CpSessionInfoCard.vue'

const { session } = defineProps<{
  session: SessionSummary
}>()

const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useI18n()

const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en'))

const sessionInfo = computed(() => {
  const content = session[localeKey.value]
  const room = locale.value === 'zh'
    ? (session.room?.['zh-hant'] || session.room?.en || '')
    : (session.room?.en || session.room?.['zh-hant'] || '')

  return {
    description: content.describe,
    room,
    speakers: session.speakers.map((speaker) => ({
      id: speaker.id,
      avatar: speaker.avatar ?? undefined,
      bio: speaker[localeKey.value].bio,
      name: speaker[localeKey.value].name,
    })),
    tags: session.tags,
    time: `${session.start?.slice(11, 16) ?? ''} ~ ${session.end?.slice(11, 16) ?? ''}`,
    title: content.title,
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
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
    :aria-label="sessionInfo.title"
    aria-modal="true"
    class="z-modal bg-black/50 inset-0 fixed"
    role="dialog"
    @click.self="emit('close')"
  >
    <div class="bg-white flex flex-row-reverse h-full max-w-120 w-full right-0 top-0 fixed">
      <div class="p-3 h-full w-full overflow-y-auto">
        <div class="z-content flex top-0 justify-end sticky">
          <button
            :aria-label="t('close')"
            class="text-gray-500 rounded-full flex h-8 w-8 transition-colors items-center justify-center hover:bg-gray-100"
            type="button"
            @click="emit('close')"
          >
            <Icon
              class="h-4 w-4"
              name="tabler:x"
            />
          </button>
        </div>

        <CpSessionInfoCard
          :ad="null"
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

<i18n lang="yaml">
  en:
    close: 'Close'
  zh:
    close: '關閉'
</i18n>
