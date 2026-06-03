<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import CpButton from '~/components/shared/CpButton.vue'
import { encodeFavorites, useFavorites } from '~/composables/useFavorites'

const { favorites } = useFavorites()
const { t } = useI18n()
const { copy, copied, isSupported } = useClipboard()

function share() {
  // Current URL (keeps locale prefix + base) with only the favorites filter.
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('filter', encodeFavorites(favorites.value))
  copy(url.toString())
}
</script>

<template>
  <CpButton
    v-if="isSupported"
    :aria-label="copied ? t('copied') : t('share')"
    variant="secondary"
    @click="share"
  >
    <template #icon>
      <Icon
        :name="copied ? 'tabler:check' : 'tabler:share-2'"
        size="18"
      />
    </template>
    <span class="hidden sm:inline">{{ copied ? t('copied') : t('share') }}</span>
  </CpButton>
</template>

<i18n lang="yaml">
  en:
    share: 'Share favorites'
    copied: 'Link copied'
  zh:
    share: '分享收藏'
    copied: '已複製連結'
</i18n>
