<script setup lang="ts">
import CpFooter from '~/components/shared/CpFooter.vue'
import CpNavbar from '~/components/shared/CpNavbar.vue'
</script>

<template>
  <div>
    <CpNavbar />
    <main class="px-4 py-4">
      <slot />
    </main>

    <CpFooter />
  </div>
</template>
