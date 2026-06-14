<script setup lang="ts">
import CpTextField from '~/components/shared/CpTextField.vue'

const searchQuery = defineModel<string>({ default: '' })
const { t } = useI18n()
</script>

<template>
  <CpTextField
    v-model="searchQuery"
    :clear-label="t('clear')"
    :placeholder="t('placeholder')"
  />
</template>

<i18n lang="yaml">
  en:
    placeholder: 'Search sessions…'
    clear: 'Clear search'
  zh:
    placeholder: '搜尋議程……'
    clear: '清除搜尋'
</i18n>
