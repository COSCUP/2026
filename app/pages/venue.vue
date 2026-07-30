<script setup lang="ts">
import tr309 from '~/assets/venue/TR309.svg'
import tr312 from '~/assets/venue/TR312.svg'
import tr409 from '~/assets/venue/TR409.svg'

const { t } = useI18n()

useSeoMeta({
  title: t('title'),
  description: t('description'),
  ogTitle: t('title'),
  ogDescription: t('description'),
})
</script>

<template>
  <div class="m-auto flex flex-col max-w-[1200px]">
    <img
      alt="TR309"
      :src="tr309"
    >
    <img
      alt="TR312"
      :src="tr312"
    >
    <img
      alt="TR409"
      :src="tr409"
    >
  </div>
</template>

<i18n lang="yaml">
zh:
  title: 會場地圖
  description: COSCUP x UbuCon Asia 2026 場地平面圖
en:
  title: Venue
  description: COSCUP x UbuCon Asia 2026 venue floor plans
</i18n>
