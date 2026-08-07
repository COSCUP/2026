<script setup lang="ts">
import type { Ad } from '#shared/types/ad'
import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TAG_NAMES } from '#shared/utils/session'

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
  slide?: string
  record?: string
  tags: string[]
  track?: {
    id: number
    name: string
    color: string
  }
  description: string
  ad: Ad | null
}>()

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh')
const isMobile = useMediaQuery('(max-width: 639px)')
const localePath = useLocalePath()

const speakerNames = computed(() =>
  props.speakers.map((s) => s.name).join(', '),
)

const infoFields = computed(() => [
  { key: 'time', icon: 'tabler:clock', text: props.time },
  { key: 'speaker', icon: 'tabler:user', text: speakerNames.value },
  { key: 'room', icon: 'tabler:map-pin', text: props.room },
  { key: 'co-write', icon: 'tabler:file-text', text: props.coWrite },
  { key: 'slide', icon: 'tabler:presentation', text: props.slide },
  { key: 'record', icon: 'tabler:live-photo', text: props.record },
].filter((f): f is { key: string, icon: string, text: string } => !!f.text))

function localizeTag(tag: string) {
  const names = TAG_NAMES[tag]
  if (names) {
    return locale.value === 'zh' ? names.zh : names.en
  }
  return tag
}
</script>

<template>
  <article class="py-4 bg-white flex flex-col gap-3 min-w-0">
    <header class="px-4 sm:px-6">
      <h1 class="text-xl leading-tight font-bold mb-4 break-words sm:text-2xl">
        {{ title }}
      </h1>
      <dl class="mb-3 flex flex-col gap-2">
        <div
          v-for="field in infoFields"
          :key="field.key"
          class="gap-4 grid"
          :class="isZh ? 'grid-cols-[5.5rem_minmax(0,1fr)]' : 'grid-cols-[7.5rem_minmax(0,1fr)]'"
        >
          <dt class="text-sm text-neutral-500 flex gap-1.5 items-center">
            <Icon
              class="shrink-0 h-4 w-4"
              :name="field.icon"
            />
            {{ t(field.key) }}
          </dt>
          <dd class="text-zinc-900 min-w-0 break-words">
            <a
              v-if="field.text.startsWith('http')"
              class="underline cursor-pointer break-all"
              :href="field.text"
              rel="noreferrer noopener"
              target="_blank"
            >{{ field.text }}</a>
            <span v-else>{{ field.text }}</span>
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
          {{ localizeTag(tag) }}
        </span>
      </div>
    </header>
    <div class="border-b border-gray-200" />
    <section class="px-4 sm:px-6">
      <h2 class="text-lg font-bold my-2">
        {{ t("abstract") }}
      </h2>
      <MDC
        class="max-w-full break-words prose prose-zinc prose-sm"
        :value="description"
      />
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
              <MDC
                class="max-w-full break-words prose prose-zinc prose-sm"
                :value="speaker.bio"
              />
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
    slide: Slide
    record: Live Caption
    room: Room
    speaker: Speaker
    time: Time
zh:
    abstract: 議程簡介
    room: 位置
    speaker: 講者
    time: 時間
    co-write: 共筆
    slide: 簡報
    record: 即時字幕
</i18n>
