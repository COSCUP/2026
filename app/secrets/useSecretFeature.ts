import { h, render } from 'vue'
import { useRoute } from 'vue-router'

export function useSecretFeature() {
  if (!import.meta.client) {
    return
  }

  const route = useRoute()
  const now = new Date()

  async function registerSecretFeature() {
    if (route.query.mode === 'askew') {
      document.body.style.transform = `rotate(${Math.random() * 2 - 1}deg)`
    }

    const container = document.createElement('div')
    document.body.appendChild(container)

    if (now.getMonth() === 5 && now.getDate() === 25) {
      const { default: CpSecretFeature } = await import('./CpDragonBoatFestival.vue')
      render(h(CpSecretFeature), container)
    }
  }

  onMounted(() => {
    const ric = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => setTimeout(cb, 1))

    ric(registerSecretFeature)
  })
}
