<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import index from './[lang]/index.vue'

const router = useRouter()

onMounted(() => {
  // Detect user's preferred language or use default
  const userLang = navigator.language?.split('-')[0] ?? 'zh-TW'
  const supportedLangs = ['en', 'zh-TW']
  const lang = supportedLangs.includes(userLang) ? userLang : 'zh-TW'

  router.replace(`/${lang}`)
})
</script>

<template>
  <index />
</template>
