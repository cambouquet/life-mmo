import { mouseTile } from '../draw/debug.js'
import { FieldMap } from '../gameLoopState.js'
import { updateDragSelection } from './dragSelection.js'

export function createPointerHandlers(canvas, state, refs, zoomRef) {
  const onMouseMove = e => {
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

  const onMouseDown = e => {
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

  const onMouseUp = e => {
    if (e.button === 1) state.isPanning = false
    state.isDragging = false
    state.dragStart = null
    state.dragMoved = false
  }

  const onClick = e => {
    if (!refs.debugActiveRef.current || state.dragMoved) return
    const { player } = refs
    const tile = mouseTile(e, canvas, player.x + 8, player.y + 8, zoomRef.current)

    if (refs.activeSpriteRef.current?.sprite) {
      const field = FieldMap[refs.activeSpriteRef.current.category]
      if (refs.onEditSpriteRef.current) {
        refs.onEditSpriteRef.current(prev => ({
          ...prev,
          [`${tile.c},${tile.r}`]: { ...prev[`${tile.c},${tile.r}`], [field]: refs.activeSpriteRef.current.sprite }
        }))
      }
      return
    }

    if (e.altKey && state.selectedTile) {
      const sourceKey = `${state.selectedTiles[0].c},${state.selectedTiles[0].r}`
      const editedData = refs.layerEditsRef.current[sourceKey]
      if (!editedData || Object.keys(editedData).length === 0) return
      if (refs.onEditSpriteRef.current) {
        refs.onEditSpriteRef.current(prev => ({
          ...prev,
          [`${tile.c},${tile.r}`]: { ...editedData }
        }))
      }
      return
    } else if (e.ctrlKey) {
      const key = `${tile.c},${tile.r}`
      const existingIndex = state.selectedTiles.findIndex(t => `${t.c},${t.r}` === key)
      if (existingIndex >= 0) {
        state.selectedTiles.splice(existingIndex, 1)
      } else {
        state.selectedTiles.push(tile)
      }
      state.selectedTile = state.selectedTiles.length > 0 ? { tiles: state.selectedTiles } : null
    } else {
      state.selectedTile = tile
      state.selectedTiles = [tile]
    }
    refs.onHoveredTileRef.current?.(state.selectedTile)
  }

  const onWheel = e => {
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

  return { onMouseMove, onMouseDown, onMouseUp, onClick, onWheel }
}
