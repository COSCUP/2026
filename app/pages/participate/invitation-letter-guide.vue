<script setup lang="ts">
const { locale } = useI18n()

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
