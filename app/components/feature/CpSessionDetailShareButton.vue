<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { title } = defineProps<{
  title: string
}>()

const { t } = useI18n()
const { copy, copied } = useClipboard()

function currentUrl() {
  const url = new URL(window.location.href)
  url.hash = ''
  url.search = ''
  return url.toString()
}

async function share() {
  const url = currentUrl()

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({
        text: title,
        title,
        url,
      })
      return
    } catch (error) {
      // Closing the native share sheet is not a failed share and should not copy.
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
    }
  }

  await copy(url)
}
</script>

<template>
  <button
    :aria-label="copied ? t('copied') : t('share')"
    class="text-sm font-500 px-3 border-2 border-gray-300 rounded bg-gray-100 flex gap-1 h-8 cursor-pointer transition-colors items-center hover:bg-gray-200"
    type="button"
    @click="share"
  >
    <Icon
      class="text-gray-500 h-4 w-4"
      :name="copied ? 'tabler:check' : 'tabler:share-2'"
    />
    <span class="hidden sm:inline">{{ copied ? t('copied') : t('share') }}</span>
  </button>
</template>

<i18n lang="yaml">
  en:
    share: 'Share'
    copied: 'Link copied'
  zh:
    share: '分享'
    copied: '已複製連結'
</i18n>
