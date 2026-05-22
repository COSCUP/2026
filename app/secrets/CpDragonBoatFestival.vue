<script setup>
const show = ref(false)
let weight = 0.9
let interval = null
let timeout = null

function rollDice() {
  if (Math.random() > weight) {
    weight = 0.9
    return true
  } else {
    weight -= 0.1
    return false
  }
}

function cb() {
  if (show.value) {
    return
  }

  if (rollDice()) {
    show.value = true
    timeout = setTimeout(() => {
      show.value = false
    }, 10_000)
  }
}

onMounted(() => {
  interval = setInterval(cb, 10_000)
})

onUnmounted(() => {
  clearInterval(interval)
  clearTimeout(timeout)
})
</script>

<template>
  <img
    v-if="show"
    alt="Dragon Boat Festival"
    class="dragon-boat"
    src="/dragon-boat-festival.webp"
  >
</template>

<style scoped>
.dragon-boat {
  width: 150px;
  position: fixed;
  bottom: -10px;
  left: -100%;
  animation:
    sail 10s linear infinite,
    bob 0.8s ease-in-out infinite;
}

@keyframes sail {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(2px) rotate(0deg);
  }
  50% {
    transform: translateY(8px) rotate(-2deg);
  }
}
</style>
