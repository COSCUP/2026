<script setup lang="ts">
import type { Fringe } from '#shared/types/fringe'
import { useI18n } from 'vue-i18n'
import CpFringeCard from '~/components/feature/CpFringeCard.vue'

const { t } = useI18n()

const { data: fringes } = await useFetch<Fringe[]>('/api/fringe')
const noFringe = computed(() => !fringes.value || fringes.value.length === 0)
</script>

<template>
  <main class="mx-auto my-8 max-w-[80vw] w-[1200px]">
    <section v-if="noFringe">
      <p class="text-primary-500 text-center">
        {{ t('noFringe') }}
      </p>
    </section>
    <section
      v-else
      class="gap-4 grid"
    >
      <CpFringeCard
        v-for="fringe in fringes"
        :key="fringe.id"
        :fringe="fringe"
      />
    </section>
  </main>
</template>

<i18n lang="yaml">
zh:
  noFringe: "周邊活動目前尚未公布。"
en:
  noFringe: "Fringe events have not been announced yet."
</i18n>
