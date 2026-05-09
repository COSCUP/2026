import { h, render } from 'vue'
import { useRoute } from 'vue-router'
import CpSecretFeature from './CpDragonBoatFestival.vue'

export function useSecretFeature() {
  if (!import.meta.client) {
    return
  }

  const route = useRoute()
  const { mode } = route.query
  const now = new Date()

  onMounted(() => {
    if (mode === 'askew') {
      document.body.style.transform = `rotate(${Math.random() * 2 - 1}deg)`
    }

    const container = document.createElement('div')
    document.body.appendChild(container)

    if (now.getMonth() === 5 && now.getDate() === 25) {
      render(h(CpSecretFeature), container)
    }
  })
}
