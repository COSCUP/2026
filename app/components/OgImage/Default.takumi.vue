<script setup lang="ts">
import { OG_COLORS, OG_LOGO, ogCardBaseStyle } from './theme'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: 'COSCUP 2026 x UbuCon Asia',
    subtitle: '',
  },
)
</script>

<template>
  <div :style="{ ...ogCardBaseStyle, padding: '80px' }">
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <svg
        height="61"
        :viewBox="OG_LOGO.viewBox"
        width="150"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          :d="OG_LOGO.path"
          :fill="OG_COLORS.accent"
          fill-rule="evenodd"
          :transform="OG_LOGO.transform"
        />
      </svg>
      <span :style="{ marginLeft: '28px', fontSize: '34px', fontWeight: 700, color: OG_COLORS.brand }">
        COSCUP 2026 x UbuCon Asia
      </span>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'column' }">
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
      <div
        v-if="subtitle"
        :style="{
          display: 'block',
          marginTop: '28px',
          fontSize: '32px',
          lineHeight: 1.4,
          color: OG_COLORS.muted,
        }"
      >
        {{ subtitle }}
      </div>
    </div>

    <div :style="{ display: 'flex', height: '12px', width: '180px', backgroundColor: OG_COLORS.accent, borderRadius: '6px' }" />
  </div>
</template>
