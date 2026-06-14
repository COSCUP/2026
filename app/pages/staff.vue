<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data: staffGroups } = await useFetch('/api/staff')
const noStaff = computed(() => !staffGroups.value || staffGroups.value.length === 0)

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
  <div class="mx-auto my-8 max-w-[80vw] w-[1200px]">
    <section v-if="noStaff">
      <p class="text-primary-500 mt-8 text-center">
        {{ t('noStaff') }}
      </p>
    </section>

    <section v-else>
      <div
        v-for="{ group, members } in staffGroups"
        :key="group"
        class="mb-16"
      >
        <h2 class="text-2xl text-gray-900 font-semibold mb-6">
          {{ t(`group.${group}`) }}
        </h2>
        <ul class="gap-6 grid grid-cols-3 justify-items-center md:grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))]">
          <li
            v-for="member in members"
            :key="member.hash"
            class="flex flex-col gap-2 max-w-30 w-full"
          >
            <NuxtImg
              :alt="member.name"
              class="rounded-full aspect-square ring-4 ring-gray-200 overflow-hidden"
              decoding="async"
              loading="lazy"
              :src="member.avatar"
            />
            <span class="text-gray-900 text-center">{{ member.name }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<i18n lang="yaml">
zh:
  noStaff: 工作人員目前尚未公布
  meta:
    title: 工作人員
    description: 認識籌備 COSCUP 2026 x UbuCon Asia 的志工團隊。
  group:
    coordinator: 總召組
    secretary: 行政組
    program: 議程組
    sponsorship: 贊助組
    engagement: 交流組
    pr: 公關組
    it: 資訊組
    design: 設計組
    documentary: 紀錄組
    finance: 財務組
    service: 場務組
    production: 製播組
en:
  noStaff: The staff information has not been announced yet.
  meta:
    title: Staff
    description: Meet the volunteer teams organizing COSCUP 2026 x UbuCon Asia.
  group:
    coordinator: General Coordinator
    secretary: Secretary
    program: Program
    sponsorship: Sponsorship
    engagement: Engagement
    pr: Public Relations
    it: IT
    design: Design
    documentary: Documentary
    finance: Finance
    service: Service
    production: Production
</i18n>
