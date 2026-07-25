<script setup lang="ts">
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
  track: {
    id?: number
    name: string
    color: string
  }
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
    class="p-2 border border-l-5 border-gray-300 rounded transition-colors relative"
    :style="{ 'border-left-color': track.color }"
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
      <Icon name="tabler:star-filled" />
    </span>
    <button
      v-else
      :aria-label="favoriteLabel"
      :aria-pressed="favorite"
      class="text-xl leading-none p-1 rounded cursor-pointer transition-colors right-1 top-1 absolute"
      :class="favorite
        ? 'text-yellow-400'
        : 'text-gray-600'"
      type="button"
      @click.prevent.stop="$emit('toggleFavorite')"
    >
      <Icon :name="favorite ? 'tabler:star-filled' : 'tabler:star'" />
    </button>
    <div class="pr-6 flex flex-col">
      <span
        class="text-xs text-white font-medium px-3 py-1 rounded-full flex gap-0.5 w-max items-center"
        :style="{ backgroundColor: track.color }"
      >
        {{ track.name }}
      </span>
      <h3 class="text-base text-inherit font-bold my-1">
        {{ title }}
      </h3>
      <p class="text-sm my-1">
        {{ speaker }}
      </p>
      <div class="my-1 flex gap-2 items-center">
        <template v-if="room && room.trim() !== ''">
          <span>{{ room }}</span>
          <span>•</span>
        </template>
        <time class="text-base opacity-50">{{ start }} ~ {{ end }}</time>
      </div>

      <p class="flex gap-1">
        <span
          v-for="tag in tags"
          :key="tag"
          class="text-xs text-gray-600 font-medium px-3 py-1 rounded-full bg-stone-100"
        >
          {{ tag }}
        </span>
      </p>
    </div>
  </div>
</template>
