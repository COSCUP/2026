<script setup lang="ts">
const { locale } = useI18n()

const { data } = useFetch('/api/hackmd/ry2VoMnqWl', {
  key: 'hackmd:invitation-letter-guide',
})

const content = computed(() => {
  if (!data.value) {
    return ''
  }

  const sections = Object.fromEntries(
    Array.from(data.value.matchAll(/<!--\s*language:(\w+)\s*-->/g)).map((match, i, arr) => {
      const start = match.index + match[0].length
      const end = arr[i + 1]?.index ?? data.value!.length
      return [match[1], data.value!.slice(start, end).trim()]
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
