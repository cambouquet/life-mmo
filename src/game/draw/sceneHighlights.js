import { TILE } from '../constants.jsx'

export const DEFAULT_HIGHLIGHT_COLORS = {
  selectedFill: 'rgba(100,220,255,0.25)',
  selectedStroke: 'rgba(100,220,255,0.7)',
  hoveredFill: 'rgba(255,150,100,0.15)',
  hoveredStroke: 'rgba(255,150,100,0.5)',
}

export function drawTileRect(ctx, tile, fill, stroke, lineWidth = 1) {
  const x = tile.c * TILE
  const y = tile.r * TILE
  if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, TILE, TILE) }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.strokeRect(x, y, TILE, TILE) }
}
