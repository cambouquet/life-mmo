export function extractSceneVars(state, world, player) {
  const { map, door1Progress, door2Progress, near2, hoveredTile, selectedTiles, layerEdits, highlightColors, spriteColorOverrides, hoverPreview, pastePreviewData } = state
  const { wallX, gapY1, gapY2, wall2X, gap2Y1, gap2Y2, MIRROR_CX, MIRROR_CY, MIRROR2_CX, MIRROR2_CY, NPC_CX, NPC_CY, NPC_X, NPC_Y, ROOMS, TORCHES, TORCHES2 } = world
  const pcx = player.x + 8
  const pcy = player.y + 8
  return { map, door1Progress, door2Progress, near2, hoveredTile, selectedTiles, layerEdits, highlightColors, spriteColorOverrides, hoverPreview, pastePreviewData, wallX, gapY1, gapY2, wall2X, gap2Y1, gap2Y2, MIRROR_CX, MIRROR_CY, MIRROR2_CX, MIRROR2_CY, NPC_CX, NPC_CY, NPC_X, NPC_Y, ROOMS, TORCHES, TORCHES2, pcx, pcy }
}

export function setupSceneContext(ctx, zoom, pcx, pcy, cameraOffset) {
  const cw = ctx.canvas.width
  const ch = ctx.canvas.height
  ctx.fillStyle = '#06040e'
  ctx.fillRect(0, 0, cw, ch)
  ctx.save()
  ctx.translate(cw / 2, ch / 2)
  ctx.scale(zoom, zoom)
  ctx.translate(-pcx + cameraOffset.x, -pcy + cameraOffset.y)
}
