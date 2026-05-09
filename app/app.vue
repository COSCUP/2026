<script setup lang="ts">
import { prerenderRoutes } from 'nuxt/app'
import { useSecretFeature } from '~/secrets/useSecretFeature'

prerenderRoutes(['/api/opass.json'])
useSecretFeature()
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
