<script setup lang="ts">
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
  description: string
}>()

const { t } = useI18n()

const speakerNames = computed(() =>
  props.speakers.map((s) => s.name).join(', '),
)
</script>

<template>
  <article class="p-6 bg-white flex flex-col gap-3">
    <header>
      <h1 class="text-2xl text-primary-400 leading-tight font-bold mb-4">
        {{ title }}
      </h1>
      <table class="border-separate border-spacing-4">
        <tbody>
          <tr class="border-none">
            <td class="text-gray-400">
              <Icon name="tabler:clock" />
              {{ t("time") }}
            </td>
            <td class="text-gray-700">
              {{ time }}
            </td>
          </tr>
          <tr class="border-none">
            <td class="text-gray-400">
              <Icon name="tabler:user" />
              {{ t("speaker") }}
            </td>
            <td class="text-gray-700">
              {{ speakerNames }}
            </td>
          </tr>
          <tr class="border-none">
            <td class="text-gray-400">
              <Icon name="tabler:map-pin" />
              {{ t("room") }}
            </td>
            <td class="text-gray-700">
              {{ room }}
            </td>
          </tr>
          <tr class="border-none">
            <td class="text-gray-400">
              <Icon name="tabler:file-text" />
              {{ t("co-write") }}
            </td>
            <td class="text-gray-700">
              <a
                v-if="coWrite?.startsWith('http')"
                class="underline cursor-pointer"
                :href="coWrite"
              >{{ coWrite }}</a>
              <span
                v-else
              >{{ coWrite }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="mt-5 pb-3 border-b border-gray-200 flex flex-wrap gap-2"
      >
        <span
          v-for="tag in tags"
          :key="tag"
          class="text-xs text-primary-700 font-medium px-3 py-1 rounded-full bg-primary-100"
        >
          {{ tag }}
        </span>
      </div>
    </header>
    <section>
      <h2 class="text-lg text-primary-400 font-bold my-3">
        {{ t("abstract") }}
      </h2>
      <div
        class="text-gray-700 leading-relaxed whitespace-pre-wrap"
      >
        {{ description }}
      </div>
    </section>
    <section>
      <h2 class="text-lg text-primary-400 font-bold my-2">
        {{ t("speaker") }}
      </h2>
      <div class="flex flex-col gap-6">
        <div
          v-for="speaker in speakers"
          :key="speaker.name"
          class="flex flex-col gap-4"
        >
          <div class="flex gap-4 items-center">
            <div
              class="border-2 border-primary-100 rounded-full bg-gray-100 flex-shrink-0 h-16 w-16 overflow-hidden"
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
              <h3 class="text-lg text-gray-700 font-bold">
                {{ speaker.name }}
              </h3>
            </div>
          </div>
          <div
            class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"
          >
            {{ speaker.bio }}
          </div>
        </div>
      </div>
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
    abstract: 摘要
    room: 位置
    speaker: 講者
    time: 時間
    co-write: 共筆
</i18n>
