<script setup lang="ts">
import CpFooter from '~/components/shared/CpFooter.vue'
import CpNavbar from '~/components/shared/CpNavbar.vue'
import CpSponsorFooter from '~/components/shared/CpSponsorFooter.vue'

function updateViewportWidth() {
  document.documentElement.style.setProperty('--viewport-width', `${document.documentElement.clientWidth}px`)
}

onMounted(() => {
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportWidth)
  document.documentElement.style.removeProperty('--viewport-width')
})
</script>

<template>
  <div class="sm:w-max">
    <CpNavbar class="w-[var(--viewport-width,100vw)] left-0 sticky z-sticky" />
    <main class="sm:w-max">
      <slot />
    </main>

    <CpSponsorFooter class="w-[var(--viewport-width,100vw)] left-0 sticky" />
    <CpFooter class="w-[var(--viewport-width,100vw)] left-0 sticky" />
  </div>
</template>
