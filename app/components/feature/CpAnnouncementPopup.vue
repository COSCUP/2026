<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const isHomepage = computed(() => route.path === '/' || route.path === '/en')

const DISMISS_KEY = 'announcement-dismissed-2026-08-09'
const isOpen = ref(false)

onMounted(() => {
  const dismissed = localStorage.getItem(DISMISS_KEY)
  if (!dismissed) {
    isOpen.value = true
  }
})

function close() {
  isOpen.value = false
  localStorage.setItem(DISMISS_KEY, 'true')
}

function open() {
  isOpen.value = true
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        :aria-label="t('title')"
        aria-modal="true"
        class="p-4 bg-black/50 flex items-center inset-0 justify-center fixed z-modal"
        role="dialog"
        @click.self="close"
      >
        <div class="rounded-xl bg-white max-h-[80vh] max-w-lg w-full shadow-xl overflow-y-auto">
          <div class="p-6">
            <h2 class="text-lg text-cp-primary font-700">
              {{ t('title') }}
            </h2>

            <div class="text-sm text-cp-primary leading-7 mt-4 space-y-4">
              <p>{{ t('status') }}</p>
              <p>{{ t('detail') }}</p>
              <p>{{ t('luggage') }}</p>
            </div>

            <button
              class="text-sm text-white font-600 mt-6 py-2.5 rounded-lg bg-cp-primary w-full transition hover:opacity-80"
              @click="close"
            >
              {{ t('close') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <button
        v-if="isHomepage && !isOpen"
        :aria-label="t('title')"
        class="text-white p-3 rounded-full bg-cp-primary shadow-lg transition bottom-4 right-4 fixed z-40 hover:opacity-80"
        @click="open"
      >
        <Icon
          name="tabler:speakerphone"
          size="24"
        />
      </button>
    </Transition>
  </Teleport>
</template>

<i18n lang="yaml">
zh:
  title: "今日活動公告"
  status: "今日活動將照常進行。"
  detail: "受颱風影響，目前有強風及豪雨。志工已在現場巡視場地，並針對強風進行加強防護。請大家前往會場及活動期間務必注意自身安全。"
  luggage: "另外，如果有雨具或行李需要暫放，可以帶到 TR 517。"
  close: "我知道了"
en:
  title: "Today's Event Update"
  status: "Today's event will proceed as scheduled."
  detail: "Due to the typhoon, we are currently experiencing strong winds and heavy rain. Our volunteers are already on site checking the venue and taking additional precautions against the strong winds. Please take extra care when traveling to the venue and during the event."
  luggage: "If you have umbrellas, rain gear, or luggage that you would like to leave somewhere, you can bring them to TR 517."
  close: "Got it"
</i18n>
