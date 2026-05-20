import { mouseTile } from '../draw/debug.js'
import { updateDragSelection } from './dragSelection.js'

export function createOnMouseMove(state, refs, canvas, zoomRef) {
  return e => {
    state.altHeldDown = e.altKey
    if (state.isPanning) {
      const deltaX = e.clientX - state.lastMouseX
      const deltaY = e.clientY - state.lastMouseY
      state.cameraOffsetX -= deltaX / zoomRef.current
      state.cameraOffsetY -= deltaY / zoomRef.current
    }
    state.lastMouseX = e.clientX
    state.lastMouseY = e.clientY
    const { player } = refs
    state.hoveredTile = mouseTile(e, canvas, player.x + 8 + state.cameraOffsetX, player.y + 8 + state.cameraOffsetY, zoomRef.current)
    if (state.isDragging && state.dragStart && refs.debugActiveRef.current) {
      state.dragMoved = true
      updateDragSelection(state, state.dragStart, state.hoveredTile)
      refs.onHoveredTileRef.current?.(state.selectedTile)
    } else {
      refs.onHoveredTileRef.current?.(state.selectedTile || state.hoveredTile)
    }
  }
}
