import { TILE } from '../constants.jsx'

export function reflectionData(player, mirrorCX, mirrorCY, charColors) {
  const dist  = Math.hypot(player.x + 8 - mirrorCX, player.y + 8 - mirrorCY)
  const alpha = Math.max(0, Math.min(1, (64 - dist) / 44))
  if (alpha <= 0.02) return null
  return {
    facing: player.facing, frame: player.frame,
    colors: charColors, moving: player.moving,
    alpha, x: player.x, y: player.y,
  }
}

export function drawSelectedTiles(ctx, selectedTiles, highlightColors) {
  if (!selectedTiles?.length) return
  selectedTiles.forEach(tile => {
    const x = tile.c * TILE
    const y = tile.r * TILE
    ctx.fillStyle = highlightColors?.selectedFill || 'rgba(100,220,255,0.25)'
    ctx.fillRect(x, y, TILE, TILE)
    ctx.strokeStyle = highlightColors?.selectedStroke || 'rgba(100,220,255,0.7)'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, TILE, TILE)
  })
}

export function drawPastePreview(ctx, pastePreviewData, hoveredTile) {
  if (!pastePreviewData) return

  const sx = pastePreviewData.sourceC * TILE
  const sy = pastePreviewData.sourceR * TILE
  ctx.strokeStyle = 'rgba(200,100,255,0.9)'
  ctx.lineWidth = 2
  ctx.strokeRect(sx, sy, TILE, TILE)

  if (hoveredTile && !(pastePreviewData.sourceC === hoveredTile.c && pastePreviewData.sourceR === hoveredTile.r)) {
    const x = hoveredTile.c * TILE
    const y = hoveredTile.r * TILE
    ctx.fillStyle = 'rgba(100,255,150,0.3)'
    ctx.fillRect(x, y, TILE, TILE)
    ctx.strokeStyle = 'rgba(100,255,150,0.9)'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, TILE, TILE)
  }
}

export function drawHoveredTile(ctx, hoveredTile, selectedTiles, highlightColors) {
  if (!hoveredTile) return
  if (selectedTiles?.some(t => t.c === hoveredTile.c && t.r === hoveredTile.r)) return

  const x = hoveredTile.c * TILE
  const y = hoveredTile.r * TILE
  ctx.fillStyle = highlightColors?.hoveredFill || 'rgba(255,150,100,0.15)'
  ctx.fillRect(x, y, TILE, TILE)
  ctx.strokeStyle = highlightColors?.hoveredStroke || 'rgba(255,150,100,0.5)'
  ctx.lineWidth = 0.5
  ctx.strokeRect(x, y, TILE, TILE)
}
