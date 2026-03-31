import { ref } from 'vue'

export default function useToggle(defaultStatus: boolean = false) {
  const isOpen = ref(defaultStatus)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}
