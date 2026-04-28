<script setup lang="ts">
import type { Sponsor } from '#shared/types/sponsor'
import { useI18n } from 'vue-i18n'

const { sponsor } = defineProps<{
  sponsor: Sponsor
}>()

const { locale, t } = useI18n()

const needsExpand = computed(() => sponsor.intro[locale.value]?.length > 200)
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
      <NuxtImg
        :alt="sponsor.name[locale]"
        class="h-full w-full object-contain"
        :src="sponsor.image"
      />
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

      <template v-if="needsExpand">
        <input
          :id="`expand-${sponsor.id}`"
          class="peer sr-only"
          type="checkbox"
        >
        <p class="text-sm text-primary-700 leading-7 mt-3 text-left line-clamp-5 peer-checked:line-clamp-none">
          <MDC :value="sponsor.intro[locale]" />
        </p>
        <label
          class="text-xs text-primary-500 mt-1 block cursor-pointer hover:underline peer-checked:hidden"
          :for="`expand-${sponsor.id}`"
        >
          {{ t('read_more') }}
        </label>
        <label
          class="text-xs text-primary-500 mt-1 hidden cursor-pointer hover:underline peer-checked:block"
          :for="`expand-${sponsor.id}`"
        >
          {{ t('show_less') }}
        </label>
      </template>

      <p
        v-else
        class="text-sm text-primary-700 leading-7 mt-3 text-left"
      >
        <MDC :value="sponsor.intro[locale]" />
      </p>
    </div>
  </article>
</template>

<i18n lang="yaml">
zh:
  show_less: "收合"
  read_more: "更多"
en:
  show_less: "Show less"
  read_more: "Read more"
</i18n>
