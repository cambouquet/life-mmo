import { mouseTile } from '../draw/debug.js'

export function createOnMouseDown(state, refs, canvas, zoomRef) {
  return e => {
    if (e.button === 1) {
      state.isPanning = true
      state.lastMouseX = e.clientX
      state.lastMouseY = e.clientY
      return
    }
    if (!refs.debugActiveRef.current || e.altKey) return
    state.dragMoved = false
    const { player } = refs
    const tile = mouseTile(e, canvas, player.x + 8 + state.cameraOffsetX, player.y + 8 + state.cameraOffsetY, zoomRef.current)
    state.dragStart = tile
    state.isDragging = true
  }
}
