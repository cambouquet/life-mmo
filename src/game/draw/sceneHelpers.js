import { TILE } from '../constants.jsx'
import { DEFAULT_HIGHLIGHT_COLORS, drawTileRect } from './sceneHighlights.js'

export function reflectionData(player, mirrorCX, mirrorCY, charColors) {
  const dist  = Math.hypot(player.x + 8 - mirrorCX, player.y + 8 - mirrorCY)
  const alpha = Math.max(0, Math.min(1, (64 - dist) / 44))
  if (alpha <= 0.02) return null
  return { facing: player.facing, frame: player.frame, colors: charColors, moving: player.moving, alpha, x: player.x, y: player.y }
}

export function drawSelectedTiles(ctx, selectedTiles, highlightColors) {
  if (!selectedTiles?.length) return
  const colors = { ...DEFAULT_HIGHLIGHT_COLORS, ...highlightColors }
  selectedTiles.forEach(tile => drawTileRect(ctx, tile, colors.selectedFill, colors.selectedStroke, 1))
}

export function drawPastePreview(ctx, pastePreviewData, hoveredTile) {
  if (!pastePreviewData) return
  const sourceTile = { c: pastePreviewData.sourceC, r: pastePreviewData.sourceR }
  drawTileRect(ctx, sourceTile, null, 'rgba(200,100,255,0.9)', 2)
  if (hoveredTile && !(pastePreviewData.sourceC === hoveredTile.c && pastePreviewData.sourceR === hoveredTile.r)) {
    drawTileRect(ctx, hoveredTile, 'rgba(100,255,150,0.3)', 'rgba(100,255,150,0.9)', 2)
  }
}

export function drawHoveredTile(ctx, hoveredTile, selectedTiles, highlightColors) {
  if (!hoveredTile || selectedTiles?.some(t => t.c === hoveredTile.c && t.r === hoveredTile.r)) return
  const colors = { ...DEFAULT_HIGHLIGHT_COLORS, ...highlightColors }
  drawTileRect(ctx, hoveredTile, colors.hoveredFill, colors.hoveredStroke, 0.5)
}
