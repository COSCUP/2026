<template>
  <div class="flex flex-col">
    <!-- DaySelector -->
    <div class="px-6 pb-4 pt-3 flex w-[var(--viewport-width,100vw)] justify-center order-last sm:order-none">
      <div class="rounded-full bg-gray-200 h-12 w-1/2 animate-pulse" />
    </div>

    <!-- FilterBar -->
    <div class="p-4 flex flex-col gap-3 w-[var(--viewport-width,100vw)] items-stretch sm:flex-row sm:items-center sm:left-0 sm:justify-between sm:sticky sm:z-sticky">
      <div class="flex shrink-0 gap-3 items-center justify-center sm:justify-start">
        <div class="rounded-md bg-gray-200 h-12 w-18 animate-pulse sm:h-9" />
        <div class="rounded-md bg-gray-200 h-12 w-18 animate-pulse sm:h-9" />
      </div>

      <div class="rounded-md bg-gray-200 h-12 w-full animate-pulse sm:flex-none sm:h-9 sm:w-80" />
    </div>

    <!-- Session -->
    <div class="rounded-xl bg-gray-200 h-screen w-[var(--viewport-width,100vw)] animate-pulse" />
  </div>
</template>
