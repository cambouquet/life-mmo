export function updateDragSelection(state, dragStart, current) {
  const minC = Math.min(dragStart.c, current.c)
  const maxC = Math.max(dragStart.c, current.c)
  const minR = Math.min(dragStart.r, current.r)
  const maxR = Math.max(dragStart.r, current.r)

  state.selectedTiles = []
  for (let c = minC; c <= maxC; c++) {
    for (let r = minR; r <= maxR; r++) {
      state.selectedTiles.push({ c, r })
    }
  }
  state.selectedTile = state.selectedTiles.length > 0 ? { tiles: state.selectedTiles } : null
}

export function handleAltClick(state, tile, refs) {
  if (!e.altKey || !state.selectedTile) return false

  const sourceKey = `${state.selectedTiles[0].c},${state.selectedTiles[0].r}`
  const editedData = refs.layerEditsRef.current[sourceKey]
  if (!editedData || Object.keys(editedData).length === 0) return false

  if (refs.onEditSpriteRef.current) {
    refs.onEditSpriteRef.current(prev => ({
      ...prev,
      [`${tile.c},${tile.r}`]: { ...editedData }
    }))
  }
  return true
}

export function handleCtrlClick(state, tile) {
  const key = `${tile.c},${tile.r}`
  const existingIndex = state.selectedTiles.findIndex(t => `${t.c},${t.r}` === key)
  if (existingIndex >= 0) {
    state.selectedTiles.splice(existingIndex, 1)
  } else {
    state.selectedTiles.push(tile)
  }
  state.selectedTile = state.selectedTiles.length > 0 ? { tiles: state.selectedTiles } : null
}

export function handleSpritePlace(state, tile, refs) {
  if (!refs.activeSpriteRef.current?.sprite) return false

  const { FieldMap } = require('../gameLoopState.js')
  const field = FieldMap[refs.activeSpriteRef.current.category]
  if (refs.onEditSpriteRef.current) {
    refs.onEditSpriteRef.current(prev => ({
      ...prev,
      [`${tile.c},${tile.r}`]: { ...prev[`${tile.c},${tile.r}`], [field]: refs.activeSpriteRef.current.sprite }
    }))
  }
  return true
}
