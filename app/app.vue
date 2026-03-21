<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'

prerenderRoutes([
  '/json/session.json',
  '/json/pretalx.json',
])
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
