<script setup lang="ts">
import CpFooter from '~/components/shared/CpFooter.vue'
import CpNavbar from '~/components/shared/CpNavbar.vue'
import CpSponsorFooter from '~/components/shared/CpSponsorFooter.vue'
</script>

<template>
  <div>
    <CpNavbar variant="landing" />
    <main>
      <slot />
    </main>

    <CpSponsorFooter />
    <CpFooter />
  </div>
</template>
