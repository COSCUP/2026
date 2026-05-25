<script setup lang="ts">
import CpFooter from '~/components/shared/CpFooter.vue'
import CpNavbar from '~/components/shared/CpNavbar.vue'
</script>

<template>
  <div class="w-max">
    <CpNavbar class="w-screen-noscroll left-0 sticky z-10" />
    <main class="w-max">
      <slot />
    </main>

    <CpFooter class="w-screen-noscroll left-0 sticky" />
  </div>
</template>
