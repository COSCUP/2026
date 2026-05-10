<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'

prerenderRoutes(['/api/opass.json'])

const route = useRoute()
const { baseUrl } = useRuntimeConfig()

const canonicalUrl = computed(() => `${baseUrl}${route.path}`)

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
  meta: [
    { property: 'og:url', content: canonicalUrl },
  ],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
