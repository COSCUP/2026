<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'

prerenderRoutes(['/api/opass.json'])
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
