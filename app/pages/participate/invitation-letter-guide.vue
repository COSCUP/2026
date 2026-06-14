<script setup lang="ts">
const { t, locale } = useI18n()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  twitterTitle: () => t('meta.title'),
  twitterDescription: () => t('meta.description'),
})

const { data } = useFetch('/api/hackmd/ry2VoMnqWl', {
  key: 'hackmd:invitation-letter-guide',
})

const content = computed(() => {
  if (!data.value) {
    return ''
  }

  const raw = data.value
    .replaceAll('*(中文版本在下方 / Chinese version below)*', '')
    .replaceAll('*(English version above / 英文版本在上方)*', '')
    .trim()

  const sections = Object.fromEntries(
    Array.from(raw.matchAll(/<!--\s*language:(\w+)\s*-->/g)).map((match, i, arr) => {
      const start = match.index + match[0].length
      const end = arr[i + 1]?.index ?? raw.length
      return [match[1], raw.slice(start, end).trim()]
    }),
  )

  return sections
})

const localizedContent = computed(() => {
  return content.value[locale.value] ?? content.value.zh ?? data.value
})
</script>

<template>
  <div class="m-auto prose">
    <MDC
      v-if="localizedContent"
      :value="localizedContent"
    />
  </div>
</template>

<i18n lang="yaml">
zh:
  meta:
    title: 邀請函申請指南
    description: COSCUP 2026 x UbuCon Asia 參加者邀請函的申請說明。
en:
  meta:
    title: Invitation Letter Guide
    description: How to request an invitation letter for attending COSCUP 2026 x UbuCon Asia.
</i18n>
