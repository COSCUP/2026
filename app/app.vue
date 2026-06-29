<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'
import { useSecretFeature } from '~/secrets/useSecretFeature'

prerenderRoutes(['/api/opass.json'])
useSecretFeature()

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

// Site-wide fallback OG image; individual pages override it with their own.
defineOgImage('Default')
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
