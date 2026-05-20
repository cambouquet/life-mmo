import { renderScene } from '../draw/scene.js'
import { isNearDoor } from '../systems/door.js'

export function renderGameFrame(ctx, world, state, refs, player, torchPhase, charColors, zoomRef) {
  const near2 = world.door2.open || isNearDoor(player, world.DOOR2_WX, world.DOOR2_WY)
  const selectedTiles = state.selectedTile?.tiles || (state.selectedTile ? [state.selectedTile] : [])
  const pastePreviewData = state.altHeldDown && state.selectedTile ? {
    sourceC: selectedTiles[0].c,
    sourceR: selectedTiles[0].r,
    sourceData: refs.layerEditsRef.current[`${selectedTiles[0].c},${selectedTiles[0].r}`]
  } : null

  renderScene(ctx, world, {
    map: state.map,
    door1Progress: world.door1.progress,
    door2Progress: world.door2.progress,
    near2,
    hoveredTile: state.hoveredTile,
    selectedTile: state.selectedTile,
    selectedTiles,
    layerEdits: refs.layerEditsRef.current,
    highlightColors: refs.highlightColorsRef.current,
    spriteColorOverrides: refs.spriteColorOverridesRef.current,
    hoverPreview: refs.hoverPreviewRef.current,
    pastePreviewData
  }, player, torchPhase, charColors, {
    paused: refs.pausedRef.current,
    nameSet: !!refs.nameSetRef?.current,
    colorsSet: !!refs.colorsSetRef?.current,
  }, zoomRef.current, refs.debugActiveRef.current ? { x: state.cameraOffsetX, y: state.cameraOffsetY } : { x: 0, y: 0 })
}
