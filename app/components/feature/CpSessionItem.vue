<script setup lang="ts">
import CpBadge from '~/components/shared/CpBadge.vue'

defineProps<{
  // Session link target, rendered as an overlay so the bookmark isn't nested in the anchor.
  to: string
  title: string
  start: string
  end: string
  speaker: string
  room?: string
  tags: string[]
  favorite?: boolean
  // Resolved by the parent to avoid a per-card i18n scope (see CpSessionTable).
  favoriteLabel?: string
  // Shared-list preview: show the filled bookmark as a static, non-toggleable indicator.
  readonly?: boolean
}>()

defineEmits<{
  toggleFavorite: []
}>()
</script>

<template>
  <div
    class="p-2 border rounded transition-colors relative"
    :class="favorite
      ? 'text-cp-orange-700 border-cp-orange-300 bg-cp-orange-50'
      : 'text-primary-600 border-primary-100 bg-primary-50'"
  >
    <!-- Overlay link, so the bookmark is a sibling rather than nested in the anchor.
         Both are absolute; the bookmark follows in DOM order, so it paints on top. -->
    <NuxtLink
      :aria-label="title"
      class="rounded inset-0 absolute"
      :draggable="false"
      :to="to"
    />
    <span
      v-if="readonly"
      aria-hidden="true"
      class="text-xl text-cp-orange-600 leading-none p-1 pointer-events-none right-1 top-1 absolute"
    >
      <Icon name="tabler:bookmark-filled" />
    </span>
    <button
      v-else
      :aria-label="favoriteLabel"
      :aria-pressed="favorite"
      class="text-xl leading-none p-1 rounded cursor-pointer transition-colors right-1 top-1 absolute"
      :class="favorite
        ? 'text-cp-orange-600 hover:text-cp-orange-700'
        : 'text-primary-300 hover:text-primary-500'"
      type="button"
      @click.prevent.stop="$emit('toggleFavorite')"
    >
      <Icon :name="favorite ? 'tabler:bookmark-filled' : 'tabler:bookmark'" />
    </button>
    <div class="pr-6 flex flex-col">
      <h3 class="text-base text-inherit font-normal my-1">
        {{ title }}
      </h3>
      <div class="my-1 flex gap-2 items-center">
        <template v-if="room && room.trim() !== ''">
          <span>{{ room }}</span>
          <span>•</span>
        </template>
        <time class="text-base opacity-50">{{ start }} ~ {{ end }}</time>
      </div>
      <p class="text-sm my-1">
        {{ speaker }}
      </p>
      <p class="flex gap-1">
        <CpBadge
          v-for="tag in tags"
          :key="tag"
        >
          {{ tag }}
        </CpBadge>
      </p>
    </div>
  </div>
</template>
