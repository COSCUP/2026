<script setup lang="ts">
import { OG_COLORS, OG_LOGO, ogCardBaseStyle } from './theme'

withDefaults(
  defineProps<{
    title?: string
    speakers?: string
    room?: string
    time?: string
  }>(),
  {
    title: '',
    speakers: '',
    room: '',
    time: '',
  },
)
</script>

<template>
  <div :style="{ ...ogCardBaseStyle, padding: '72px' }">
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <svg
        height="54"
        :viewBox="OG_LOGO.viewBox"
        width="132"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          :d="OG_LOGO.path"
          :fill="OG_COLORS.accent"
          fill-rule="evenodd"
          :transform="OG_LOGO.transform"
        />
      </svg>
      <span :style="{ marginLeft: '24px', fontSize: '30px', fontWeight: 700, color: OG_COLORS.brand }">
        COSCUP 2026 x UbuCon Asia
      </span>
    </div>

    <div
      :style="{
        display: 'block',
        fontSize: '60px',
        fontWeight: 400,
        lineHeight: 1.25,
        color: OG_COLORS.text,
      }"
    >
      {{ title }}
    </div>

    <div :style="{ display: 'flex', flexDirection: 'column', fontSize: '32px', color: OG_COLORS.brand }">
      <div
        v-if="speakers"
        :style="{ display: 'flex', alignItems: 'center', color: OG_COLORS.text, fontWeight: 400 }"
      >
        {{ speakers }}
      </div>
      <div
        v-if="room || time"
        :style="{ display: 'flex', marginTop: '12px', color: OG_COLORS.muted }"
      >
        {{ [room, time].filter(Boolean).join('  ·  ') }}
      </div>
    </div>
  </div>
</template>
