<script setup lang="ts">
defineProps<{
  title: string
  speaker: string
  start: string
  end: string
  difficulty?: string
}>()
</script>

<template>
  <div class="text-white px-3 py-1.5 rounded-lg bg-primary-400 flex flex-col gap-1 h-full transition-shadow overflow-hidden hover:shadow-lg">
    <!-- 時段過短時整體裁切；外層 flex-1 讓時間列固定在底部 -->
    <div class="flex flex-1 flex-col gap-0.5 min-h-0 overflow-hidden">
      <h4 class="text-sm leading-tight font-bold line-clamp-2">
        {{ title }}
      </h4>
      <p
        v-if="speaker"
        class="text-xs opacity-90 line-clamp-1"
      >
        {{ speaker }}
      </p>
    </div>
    <div class="flex flex-shrink-0 gap-2 items-center">
      <time class="text-xs opacity-80">{{ start }}–{{ end }}</time>
      <span
        v-if="difficulty"
        class="text-[10px] leading-none px-1.5 py-0.5 rounded bg-white/20"
      >
        {{ difficulty }}
      </span>
    </div>
  </div>
</template>
