interface UseDragScrollOptions {
  horizontal?: boolean
  vertical?: boolean
}

export function useDragScroll({ horizontal = true, vertical = true }: UseDragScrollOptions = {}) {
  const containerRef = ref<HTMLElement>()
  const isDragging = ref(false)
  const suppressClick = ref(false)

  const dragState = reactive({
    pointerId: -1,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  })

  function handlePointerDown(event: PointerEvent) {
    if (event.button !== 0 || !containerRef.value) {
      return
    }

    dragState.pointerId = event.pointerId
    dragState.startX = event.clientX
    dragState.startY = event.clientY
    dragState.scrollLeft = containerRef.value.scrollLeft
    dragState.scrollTop = containerRef.value.scrollTop
    isDragging.value = true
    suppressClick.value = false

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging.value || !containerRef.value) {
      return
    }

    event.preventDefault()

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    const moved = (horizontal && Math.abs(deltaX) > 4) || (vertical && Math.abs(deltaY) > 4)
    if (moved) {
      suppressClick.value = true
    }

    if (horizontal) {
      containerRef.value.scrollLeft = dragState.scrollLeft - deltaX
    }
    if (vertical) {
      containerRef.value.scrollTop = dragState.scrollTop - deltaY
    }
  }

  function stopDragging(event?: PointerEvent) {
    if (event && event.pointerId !== dragState.pointerId) {
      return
    }

    dragState.pointerId = -1
    isDragging.value = false

    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', stopDragging)
    window.removeEventListener('pointercancel', stopDragging)
  }

  function handleClickCapture(event: MouseEvent) {
    if (!suppressClick.value) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    suppressClick.value = false
  }

  function handleDragStart(event: DragEvent) {
    event.preventDefault()
  }

  watchEffect((onCleanup) => {
    const el = containerRef.value
    if (!el) {
      return
    }

    el.addEventListener('pointerdown', handlePointerDown)
    el.addEventListener('click', handleClickCapture, { capture: true })
    el.addEventListener('dragstart', handleDragStart)

    onCleanup(() => {
      el.removeEventListener('pointerdown', handlePointerDown)
      el.removeEventListener('click', handleClickCapture, { capture: true })
      el.removeEventListener('dragstart', handleDragStart)
      // Clean up window listeners in case drag was in progress
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
    })
  })

  return {
    containerRef,
    isDragging,
  }
}
