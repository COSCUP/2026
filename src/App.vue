<script setup lang="ts">
import IconCpCoscupSolid from '~icons/cp/coscup-solid'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <Navbar />
  <main>
    <router-view />
  </main>
  <h1>Hello, @coscup 2026 <IconCpCoscupSolid /></h1>
</template>
