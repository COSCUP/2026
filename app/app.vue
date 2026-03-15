<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'

prerenderRoutes(['/json/session.json'])
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
