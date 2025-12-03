<script setup lang="ts">
import type { CpMenuOption } from '@/components/shared/CpMenu.vue'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LanguageIcon from '~icons/tabler/language'
import CpMenu from '@/components/shared/CpMenu.vue'

const router = useRouter()
const { locale } = useI18n()

const language: CpMenuOption[] = [
  { label: '繁體中文', value: 'zh-TW' },
  { label: 'English', value: 'en' },
]

watch(locale, (newLocale) => {
  router.push({ params: { lang: newLocale } })
})
</script>

<template>
  <CpMenu
    v-model="locale"
    align="right"
    :options="language"
  >
    <button class="cursor-pointer transition active:scale-95 hover:scale-105">
      <LanguageIcon />
    </button>
  </CpMenu>
</template>
