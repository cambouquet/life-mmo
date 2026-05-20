import { useRef, useCallback, useEffect } from 'react'

export function useCanvasDrag(pickFn) {
  const dragging = useRef(false)

  const onDown = e => {
    dragging.current = true
    pickFn(e)
  }

  const onMove = e => {
    if (dragging.current) pickFn(e)
  }

  const onUp = () => {
    dragging.current = false
  }

  useEffect(() => {
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: false })
    return () => {
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  })

  return { onDown, onMove, onUp }
}
