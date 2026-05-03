import { TILE, DOOR_H, GAP_W } from '../constants.jsx'

// flip=false: wall is on the left, hinge on right, tiles swing rightward into gap (door 1)
// flip=true:  wall is on the right, hinge on left, tiles swing leftward into gap (door 2)
export function drawDoorCorridor(ctx, progress, wallX, gapY1, gapY2, flip = false) {
  if (progress <= 0) return

  const eased = 1 - Math.pow(1 - progress, 2)
  const angle = (Math.PI / 2) * eased
  const doorC = wallX / TILE
  const doorR = gapY1 / TILE

  // Corridor floor tiles
  ctx.save()
  ctx.globalAlpha = progress
  for (let col = 1; col <= GAP_W; col++) {
    for (let row = doorR; row < doorR + DOOR_H; row++) {
      const c = flip ? doorC - col : doorC + col
      ctx.fillStyle = (c + row) % 2 === 0 ? '#0e0b1a' : '#0b0917'
      ctx.fillRect(c * TILE, row * TILE, TILE, TILE)
    }
  }
  ctx.restore()

  function drawWallTile(ox, oy) {
    ctx.fillStyle = '#0c0a14'
    ctx.fillRect(ox, oy, TILE, TILE)
    ctx.fillStyle = '#0a0816'
    ctx.fillRect(ox, oy + 7, TILE, 1)
    ctx.fillStyle = '#161428'
    ctx.fillRect(ox + 1, oy + 1, 1, 6)
    ctx.fillStyle = '#1e1a38'
    ctx.fillRect(ox, oy, TILE, 2)
  }

  if (!flip) {
    ctx.save()
    ctx.translate(wallX + TILE, gapY1)
    ctx.rotate(-angle)
    drawWallTile(-TILE, 0)
    ctx.restore()

    ctx.save()
    ctx.translate(wallX + TILE, gapY2 - TILE)
    ctx.rotate(angle)
    drawWallTile(-TILE, 0)
    ctx.restore()
  } else {
    ctx.save()
    ctx.translate(wallX, gapY1)
    ctx.rotate(angle)
    drawWallTile(0, 0)
    ctx.restore()

    ctx.save()
    ctx.translate(wallX, gapY2 - TILE)
    ctx.rotate(-angle)
    drawWallTile(0, 0)
    ctx.restore()
  }
}
