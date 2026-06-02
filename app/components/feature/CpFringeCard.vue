<script setup lang="ts">
import type { Fringe } from '#shared/types/fringe'
import CpContentCard from '~/components/shared/CpContentCard.vue'

const { fringe } = defineProps<{
  fringe: Fringe
}>()

const item = computed(() => ({
  id: `fringe-${fringe.id}`,
  title: fringe.title,
  intro: fringe.intro,
  link: fringe.link,
  image: fringe.logo,
}))
</script>

<template>
  <CpContentCard :item="item" />
</template>
