<script setup lang="ts">
import type { Sponsor } from '#shared/types/sponsor'
import { useI18n } from 'vue-i18n'

const { sponsor } = defineProps<{
  sponsor: Sponsor
}>()

const { t, locale } = useI18n()

const expanded = ref(false)

const shouldCollapse = computed(() => sponsor.intro[locale.value].length > 180)
</script>

<template>
  <article class="p-4 border border-primary-200 rounded-lg flex flex-col gap-4 md:flex-row md:items-start">
    <NuxtLink
      class="p-4 rounded-xl bg-white flex shrink-0 w-full aspect-[3/2] items-center justify-center md:w-60 md:aspect-[3/2]"
      external
      rel="noreferrer"
      target="_blank"
      :to="sponsor.link"
    >
      <img
        :alt="sponsor.name[locale]"
        class="h-full w-full object-contain"
        :src="sponsor.image"
      >
    </NuxtLink>

    <div class="flex-1 min-w-0">
      <h3 class="text-lg text-primary-500 font-700">
        <NuxtLink
          class="hover:underline"
          external
          rel="noreferrer"
          target="_blank"
          :to="sponsor.link"
        >
          {{ sponsor.name[locale] }}
        </NuxtLink>
      </h3>

      <p
        class="text-sm text-primary-700 leading-7 mt-3 whitespace-pre-line"
        :class="{ 'line-clamp-5': shouldCollapse && !expanded }"
      >
        {{ sponsor.intro[locale] }}
      </p>

      <button
        v-if="shouldCollapse"
        class="text-sm text-primary-400 font-600 mt-3 p-0 border-none bg-transparent"
        type="button"
        @click="expanded = !expanded"
      >
        {{ expanded ? t('Show less') : t('Read more') }}
      </button>
    </div>
  </article>
</template>

<i18n lang="yaml">
zh:
  Show less: "收合"
  Read more: "更多"
en:
  Show less: "Show less"
  Read more: "Read more"
</i18n>
