<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

interface CommunitySponsor {
  id: string
  name: { zh: string, en: string }
  link: string
  image: string
}

interface Community {
  id: string
  logo?: string
  url?: string
  booth: string
  track: {
    title: { zh: string, en: string }
    id: string
  }
  sponsors: CommunitySponsor[]
  zh: { name: string, description: string }
  en: { name: string, description: string }
}

const { data } = await useFetch<Community[]>('/api/community')

const communities = computed(() => data.value ?? [])

function communityName(community: Community) {
  return locale.value === 'zh' ? community.zh.name : community.en.name
}

function communityDescription(community: Community) {
  return locale.value === 'zh' ? community.zh.description : community.en.description
}

function needsExpand(community: Community) {
  const desc = communityDescription(community)
  return desc.length > 200
}

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  twitterTitle: () => t('meta.title'),
  twitterDescription: () => t('meta.description'),
})
</script>

<template>
  <main class="mx-auto my-8 max-w-[80vw] w-[1200px]">
    <section v-if="communities.length === 0">
      <p class="text-primary-500 mt-8 text-center">
        {{ t('empty') }}
      </p>
    </section>

    <div
      v-else
      class="flex flex-col gap-4"
    >
      <article
        v-for="community in communities"
        :key="community.id"
        class="p-4 border border-primary-200 rounded-lg flex flex-col gap-4 md:flex-row md:items-start"
      >
        <div class="p-4 rounded-xl bg-white flex shrink-0 w-full aspect-[3/2] items-center justify-center md:w-40 md:aspect-square">
          <NuxtImg
            v-if="community.logo"
            :alt="communityName(community)"
            class="h-full w-full object-contain"
            :src="community.logo"
          />
          <Icon
            v-else
            class="text-primary-200"
            name="tabler:users"
            size="48"
          />
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-lg text-primary-500 font-700">
            <NuxtLink
              v-if="community.url"
              class="hover:underline"
              external
              rel="noreferrer noopener"
              target="_blank"
              :to="community.url"
            >
              {{ communityName(community) }}
            </NuxtLink>
            <template v-else>
              {{ communityName(community) }}
            </template>
          </h3>
          <div class="mt-1.5 flex flex-wrap gap-1.5">
            <span
              v-if="community.booth"
              class="text-xs text-primary-500 font-600 px-2 py-0.5 border border-primary-200 rounded-full bg-primary-50"
            >
              {{ t('track.booth') }}
            </span>
            <NuxtLinkLocale
              v-if="community.track.id"
              class="text-xs text-primary-500 font-600 px-2 py-0.5 border border-primary-200 rounded-full bg-primary-50 transition hover:bg-primary-100"
              :to="`/track/${community.track.id}`"
            >
              {{ t('track.session') }}: {{ locale === 'zh' ? community.track.title.zh : community.track.title.en }}
            </NuxtLinkLocale>
            <NuxtLink
              v-for="s in community.sponsors"
              :key="s.id"
              class="text-xs text-primary-500 font-600 px-2 py-0.5 border border-primary-200 rounded-full bg-primary-50 inline-flex gap-1 transition items-center hover:bg-primary-100"
              external
              rel="noreferrer"
              target="_blank"
              :to="s.link"
            >
              <NuxtImg
                :alt="locale === 'zh' ? s.name.zh : s.name.en"
                class="rounded-sm h-3.5 w-3.5 object-contain"
                :src="s.image"
              />
              {{ t('sponsored_by_name', { name: locale === 'zh' ? s.name.zh : s.name.en }) }}
            </NuxtLink>
          </div>
          <template v-if="needsExpand(community)">
            <input
              :id="`expand-${community.id}`"
              class="peer sr-only"
              type="checkbox"
            >
            <MDC
              class="text-sm text-primary-700 leading-7 mt-2 line-clamp-5 prose peer-checked:line-clamp-none"
              :value="communityDescription(community)"
            />
            <label
              class="text-xs text-primary-500 mt-1 block cursor-pointer hover:underline peer-checked:hidden"
              :for="`expand-${community.id}`"
            >
              {{ t('read_more') }}
            </label>
            <label
              class="text-xs text-primary-500 mt-1 hidden cursor-pointer hover:underline peer-checked:block"
              :for="`expand-${community.id}`"
            >
              {{ t('show_less') }}
            </label>
          </template>
          <MDC
            v-else
            class="text-sm text-primary-700 leading-7 mt-2 prose"
            :value="communityDescription(community)"
          />
        </div>
      </article>
    </div>
  </main>
</template>

<i18n lang="yaml">
zh:
  meta:
    title: "社群"
    description: "參與 COSCUP x UbuCon Asia 2026 的開源社群。"
  empty: "社群資料尚未公布。"
  read_more: "更多"
  show_less: "收折"
  sponsored_by_name: "贊助：{name}"
  track:
    booth: "攤位"
    session: "議程軌"
en:
  meta:
    title: "Communities"
    description: "Open source communities participating in COSCUP x UbuCon Asia 2026."
  empty: "Community information has not been announced yet."
  read_more: "Read more"
  show_less: "Show less"
  sponsored_by_name: "Sponsor: {name}"
  track:
    booth: "Booth"
    session: "Session Track"
</i18n>
