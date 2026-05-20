import { TILE_COLORS, TILE_DEFS } from './minimapTileConfig.js'

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export function adjustBrightness(color, factor) {
  const hex = color.replace('#', '')
  const r = Math.min(255, Math.floor(parseInt(hex.substring(0, 2), 16) * factor))
  const g = Math.min(255, Math.floor(parseInt(hex.substring(2, 4), 16) * factor))
  const b = Math.min(255, Math.floor(parseInt(hex.substring(4, 6), 16) * factor))
  return `rgba(${r}, ${g}, ${b}, 0.7)`
}

export function drawTile(ctx, tile, x, y, tileSize) {
  const def = TILE_DEFS[tile]
  if (!def) return
  ctx.fillStyle = TILE_COLORS[def.fill]
  roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 2)
  ctx.fill()
  if (def.border) {
    ctx.strokeStyle = TILE_COLORS[def.border]
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
}
