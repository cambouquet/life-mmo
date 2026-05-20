export function createOnWheel(state, refs, zoomRef) {
  return e => {
    e.preventDefault()
    if (e.shiftKey) {
      if (!refs.debugActiveRef.current) return
      const step = 0.25
      const minZoom = 1
      const maxZoom = 4
      zoomRef.current += e.deltaY < 0 ? step : -step
      zoomRef.current = Math.max(minZoom, Math.min(maxZoom, zoomRef.current))
      refs.onZoomChangeRef.current?.(zoomRef.current)
    } else {
      state.cameraOffsetX -= e.deltaX / zoomRef.current
      state.cameraOffsetY -= e.deltaY / zoomRef.current
    }
  }
}
