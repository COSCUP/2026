<script setup lang="ts">
import type { Ad } from '#shared/types/ad'
import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  title: string
  time: string
  speakers: {
    id?: string
    name: string
    bio: string
    avatar?: string
  }[]
  room: string
  coWrite?: string
  tags: string[]
  track?: {
    id: number
    name: string
    color: string
  }
  description: string
  ad: Ad | null
  hasTitleMarginRight?: boolean
}>()

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const isMobile = useMediaQuery('(max-width: 639px)')
const localePath = useLocalePath()

const speakerNames = computed(() =>
  props.speakers.map((s) => s.name).join(', '),
)
</script>

<template>
  <article class="py-5 bg-white flex flex-col gap-3 min-w-0">
    <header class="px-4 sm:px-6">
      <h1
        class="text-xl leading-tight font-bold mb-4 break-words sm:text-2xl"
        :class="hasTitleMarginRight ? 'mr-30 sm:mr-60' : ''"
      >
        {{ title }}
      </h1>
      <dl class="mb-3 flex flex-col gap-2">
        <div
          class="gap-4 grid"
          :class="isZh ? 'grid-cols-[auto_minmax(0,1fr)]' : 'grid-cols-[6rem_minmax(0,1fr)]'"
        >
          <dt class="text-sm text-neutral-500 flex gap-1.5 items-center">
            <Icon
              class="shrink-0 h-4 w-4"
              name="tabler:clock"
            />
            {{ t("time") }}
          </dt>
          <dd class="text-zinc-900 min-w-0 break-words">
            {{ time }}
          </dd>
        </div>
        <div
          class="gap-4 grid"
          :class="isZh ? 'grid-cols-[auto_minmax(0,1fr)]' : 'grid-cols-[6rem_minmax(0,1fr)]'"
        >
          <dt class="text-sm text-neutral-500 flex gap-1.5 items-center">
            <Icon
              class="shrink-0 h-4 w-4"
              name="tabler:user"
            />
            {{ t("speaker") }}
          </dt>
          <dd class="text-zinc-900 min-w-0 break-words">
            {{ speakerNames }}
          </dd>
        </div>
        <div
          class="gap-4 grid"
          :class="isZh ? 'grid-cols-[auto_minmax(0,1fr)]' : 'grid-cols-[6rem_minmax(0,1fr)]'"
        >
          <dt class="text-sm text-neutral-500 flex gap-1.5 items-center">
            <Icon
              class="shrink-0 h-4 w-4"
              name="tabler:map-pin"
            />
            {{ t("room") }}
          </dt>
          <dd class="text-zinc-900 min-w-0 break-words">
            {{ room }}
          </dd>
        </div>
        <div
          class="gap-4 grid"
          :class="isZh ? 'grid-cols-[auto_minmax(0,1fr)]' : 'grid-cols-[6rem_minmax(0,1fr)]'"
        >
          <dt class="text-sm text-neutral-500 flex gap-1.5 items-center">
            <Icon
              class="shrink-0 h-4 w-4"
              name="tabler:file-text"
            />
            {{ t("co-write") }}
          </dt>
          <dd class="text-zinc-900 min-w-0 break-words">
            <a
              v-if="coWrite?.startsWith('http')"
              class="underline cursor-pointer break-all"
              :href="coWrite"
            >{{ coWrite }}</a>
            <span v-else>{{ coWrite }}</span>
          </dd>
        </div>
      </dl>
      <div
        class="flex flex-wrap gap-2"
      >
        <NuxtLink
          v-if="track"
          class="text-xs text-white font-medium px-3 py-1 rounded-full underline-offset-2 flex gap-0.5 items-center hover:underline"
          :style="{ backgroundColor: track.color }"
          :to="localePath(`/track/${track.id}`)"
        >
          {{ track.name }}
          <Icon
            class="h-4 w-4"
            name="tabler:arrow-up-right"
          />
        </NuxtLink>
        <span
          v-for="tag in tags"
          :key="tag"
          class="text-xs text-zinc-900 font-medium px-3 py-1 rounded-full bg-stone-100"
        >
          {{ tag }}
        </span>
      </div>
    </header>
    <div class="border-b border-gray-200" />
    <section class="px-4 sm:px-6">
      <h2 class="text-lg font-bold my-2">
        {{ t("abstract") }}
      </h2>
      <div
        class="text-gray-700 leading-relaxed whitespace-pre-wrap break-words"
      >
        <MDC :value="description" />
      </div>
    </section>
    <section class="px-4 sm:px-6">
      <h2 class="text-lg font-bold my-2">
        {{ t("speaker") }}
      </h2>
      <div class="flex flex-col gap-4">
        <div
          v-for="speaker in speakers"
          :key="speaker.name"
          class="p-4 rounded bg-gray-50 flex flex-col gap-4"
        >
          <div class="flex gap-4">
            <div
              class="border-2 border-gray-100 rounded-full bg-gray-100 flex-shrink-0 h-16 w-16 top-3 sticky overflow-hidden"
            >
              <img
                v-if="speaker.avatar"
                :alt="speaker.name"
                class="h-full w-full object-cover"
                :src="speaker.avatar"
              >
              <div
                v-else
                class="text-gray-400 flex h-full w-full items-center justify-center"
              >
                <Icon
                  class="h-8 w-8"
                  name="tabler:user"
                />
              </div>
            </div>
            <div>
              <div>
                <h3 class="text-lg text-gray-700 font-bold">
                  {{ speaker.name }}
                </h3>
              </div>
              <div
                class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words"
              >
                <MDC :value="speaker.bio" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      v-if="ad && isMobile"
      class="px-4 w-full aspect-[18/5]"
    >
      <NuxtLink
        class="h-full w-full block"
        target="_blank"
        :to="ad.link"
      >
        <NuxtImg
          :alt="ad.id"
          class="h-full w-full object-contain"
          :src="ad.imageHorizontal"
        />
      </NuxtLink>
    </section>
  </article>
</template>

<i18n lang="yaml">
en:
    abstract: Abstract
    co-write: Co-write
    room: Room
    speaker: Speaker
    time: time
zh:
    abstract: 議程簡介
    room: 位置
    speaker: 講者
    time: 時間
    co-write: 共筆
</i18n>
