<script setup lang="ts">
import type { Sponsor } from '#shared/types/sponsor'
import CpContentCard from '~/components/shared/CpContentCard.vue'

const { sponsor } = defineProps<{
  sponsor: Sponsor
}>()

const item = computed(() => ({
  id: `sponsor-${sponsor.id}`,
  title: sponsor.name,
  intro: sponsor.intro,
  link: sponsor.link,
  image: sponsor.image,
  reward_type: sponsor.reward_type,
  reward_data: sponsor.reward_data,
}))
</script>

<template>
  <CpContentCard :item="item" />
</template>
