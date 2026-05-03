import { TILE, DOOR_H, GAP_W } from '../constants.jsx'

export function drawDoorCorridor(ctx, progress, wallX, gapY1, gapY2, flip = false) {
  if (progress <= 0) return

  // Seam glow along top and bottom edges of the opening,
  // skipping the torch columns (wallX itself on both sides).
  const seamY = [gapY1, gapY2 - 1]
  const seamH = 1

  // For door1 (flip=false): seam runs from wallX+TILE to wallX+TILE+(GAP_W+1)*TILE
  // For door2 (flip=true):  seam runs from wallX-(GAP_W+1)*TILE to wallX
  const seamX = flip ? wallX - (GAP_W + 1) * TILE : wallX + TILE
  const seamW = (GAP_W + 1) * TILE

  ctx.save()
  ctx.globalAlpha = progress * 0.5
  ctx.fillStyle = '#7ab8ff'
  for (const sy of seamY) {
    ctx.fillRect(seamX, sy, seamW, seamH)
  }
  ctx.restore()
}
