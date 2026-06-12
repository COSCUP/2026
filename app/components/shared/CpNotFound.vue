<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="px-4 py-12 flex flex-col min-h-[60vh] select-none items-center justify-center">
    <div class="flex flex-col max-w-4xl w-full items-center justify-center lg:flex-row">
      <div class="max-w-[200px] w-full -mb-10 lg:mb-0 lg:max-w-[300px] sm:max-w-[260px]">
        <img
          alt="codepecker-confused"
          class="rounded-2xl h-auto w-full object-cover"
          src="~/assets/codepecker-confused.webp"
        >
      </div>

      <div class="text-center flex flex-col items-center lg:text-left lg:items-start">
        <h1 class="text-5xl text-gray-700 leading-none tracking-tight font-bold sm:text-9xl">
          404
        </h1>

        <p class="text-base text-gray-400 tracking-widest font-semibold mt-4 uppercase">
          PAGE NOT FOUND
        </p>

        <div class="my-5 bg-primary-300 h-[2px] w-12" />

        <p class="text-sm text-gray-500 leading-relaxed max-w-md">
          But if you don't change your direction, and if you keep looking, you may end up where you are heading.
        </p>

        <div class="mt-6">
          <NuxtLink
            class="text-sm text-primary-300 tracking-wide font-semibold px-8 py-2.5 border-2 border-primary-300 rounded-full inline-flex duration-200 items-center justify-center hover:text-white focus:outline-none hover:border-primary-400 hover:bg-primary-400"
            to="/"
          >
            {{ t('takeMeHome') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
  en:
    takeMeHome: 'Take me home'
  zh:
    takeMeHome: '返回首頁'
</i18n>
