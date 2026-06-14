<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo'
import useLocaleContent from '~/composables/useLocaleContent'

const route = useRoute()
const { locale, defaultLocale } = useI18n()

const slug = computed(() => {
  const rawSlug = route.params.slug
  const segments = (Array.isArray(rawSlug) ? rawSlug : [rawSlug])
    .filter((segment): segment is string => typeof segment === 'string' && segment.length > 0)

  if (segments.length === 0) {
    return '/'
  }

  return withoutTrailingSlash(withLeadingSlash(segments.join('/')))
})

const page = await useLocaleContent(slug, locale, defaultLocale)

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
  twitterTitle: () => page.value?.title,
  twitterDescription: () => page.value?.description,
})
</script>

<template>
  <ContentRenderer
    v-if="page"
    class="m-auto prose"
    :value="page"
  />
  <div v-else>
    <h1>Page not found</h1>
    <p>This page doesn't exist in {{ locale }} language.</p>
  </div>
</template>
