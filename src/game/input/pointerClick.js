import { mouseTile } from '../draw/debug.js'
import { FieldMap } from '../gameLoopState.js'

export function createOnClick(state, refs, canvas, zoomRef) {
  return e => {
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
}
