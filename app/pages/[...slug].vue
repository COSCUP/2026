<script setup lang="ts">
import { withLeadingSlash } from 'ufo'
import useLocaleContent from '~/composables/useLocaleContent'

const route = useRoute()
const { locale, defaultLocale } = useI18n()

const slug = computed(() => withLeadingSlash(String(route.params.slug)))

const page = await useLocaleContent(slug, locale, defaultLocale)
</script>

<template>
  <ContentRenderer
    v-if="page"
    class="prose"
    :value="page"
  />
  <div v-else>
    <h1>Page not found</h1>
    <p>This page doesn't exist in {{ locale }} language.</p>
  </div>
</template>
