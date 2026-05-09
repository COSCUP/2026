import { useRoute } from 'vue-router'

export function useSecretFeature() {
  const route = useRoute()
  const { mode } = route.query

  onMounted(() => {
    if (mode === 'askew') {
      document.body.style.transform = `rotate(${Math.random() * 2 - 1}deg)`
    }
  })
}
