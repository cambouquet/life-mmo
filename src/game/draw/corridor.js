import { TILE, DOOR_H, GAP_W } from '../constants.jsx'

export function drawDoorCorridor(ctx, progress, wallX, gapY1, gapY2) {
  if (progress <= 0) return

  const eased  = 1 - Math.pow(1 - progress, 2)
  const angle  = (Math.PI / 2) * eased
  const doorC  = wallX / TILE
  const doorR  = gapY1 / TILE

  // Corridor floor tiles — fade in as door opens
  ctx.save()
  ctx.globalAlpha = progress
  for (let col = 1; col <= GAP_W; col++) {
    for (let row = doorR; row < doorR + DOOR_H; row++) {
      ctx.fillStyle = (col + row) % 2 === 0 ? '#0e0b1a' : '#0b0917'
      ctx.fillRect((doorC + col) * TILE, row * TILE, TILE, TILE)
    }
  }
  ctx.restore()

  function drawWallGlowTile() {
    const g = ctx.createLinearGradient(0, 0, -TILE, 0)
    g.addColorStop(0,    'rgba(180,230,255,0.162)')
    g.addColorStop(0.15, 'rgba(100,170,255,0.063)')
    g.addColorStop(1,    'rgba(60,120,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(-TILE, 0, TILE, TILE)
  }

  // Top tile — hinge at top-right of opening, swings counter-clockwise
  ctx.save()
  ctx.translate(wallX + TILE, gapY1)
  ctx.rotate(-angle)
  drawWallGlowTile()
  ctx.restore()

  // Bottom tile — hinge at bottom-right of opening, swings clockwise
  ctx.save()
  ctx.translate(wallX + TILE, gapY2)
  ctx.rotate(angle)
  ctx.translate(0, -TILE)
  drawWallGlowTile()
  ctx.restore()
}
