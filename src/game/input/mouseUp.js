export function createOnMouseUp(state) {
  return e => {
    if (e.button === 1) state.isPanning = false
    state.isDragging = false
    state.dragStart = null
    state.dragMoved = false
  }
}
