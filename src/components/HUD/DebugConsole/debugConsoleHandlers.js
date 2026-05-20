export function createKeyDownHandler(scrollRef) {
  return (e) => {
    if (!scrollRef.current) return
    const step = 40
    if (e.key === 'ArrowUp') {
      scrollRef.current.scrollTop -= step
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      scrollRef.current.scrollTop += step
      e.preventDefault()
    }
  }
}

export function createResizeMouseDown(isResizingRef) {
  return (e) => {
    e.preventDefault()
    isResizingRef.current = true
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'
  }
}
