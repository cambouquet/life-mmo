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

const TILE_COLORS = {
  floor: 'rgba(70, 110, 150, 0.7)',
  wall: 'rgba(25, 25, 40, 0.9)',
  wallStroke: 'rgba(50, 50, 70, 0.6)',
  mirror: 'rgba(100, 220, 255, 0.9)',
  mirrorStroke: 'rgba(150, 240, 255, 0.6)',
  table: 'rgba(220, 140, 80, 0.85)',
  tableStroke: 'rgba(240, 160, 100, 0.5)',
  door: 'rgba(120, 180, 255, 0.75)',
  doorStroke: 'rgba(150, 200, 255, 0.7)',
  void: 'rgba(10, 10, 20, 0.6)',
}

export function drawTile(ctx, tile, x, y, tileSize) {
  if (tile === 0) {
    ctx.fillStyle = TILE_COLORS.floor
    roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 2)
    ctx.fill()
  } else if (tile === 1) {
    ctx.fillStyle = TILE_COLORS.wall
    roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 2)
    ctx.fill()
    ctx.strokeStyle = TILE_COLORS.wallStroke
    ctx.lineWidth = 0.5
    ctx.stroke()
  } else if (tile === 4) {
    ctx.fillStyle = TILE_COLORS.mirror
    roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 2)
    ctx.fill()
    ctx.strokeStyle = TILE_COLORS.mirrorStroke
    ctx.lineWidth = 0.5
    ctx.stroke()
  } else if (tile === 3) {
    ctx.fillStyle = TILE_COLORS.table
    roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 2)
    ctx.fill()
    ctx.strokeStyle = TILE_COLORS.tableStroke
    ctx.lineWidth = 0.5
    ctx.stroke()
  } else if (tile === 6) {
    ctx.fillStyle = TILE_COLORS.door
    roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 2)
    ctx.fill()
    ctx.strokeStyle = TILE_COLORS.doorStroke
    ctx.lineWidth = 0.5
    ctx.stroke()
  } else if (tile === 5) {
    ctx.fillStyle = TILE_COLORS.void
    roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 2)
    ctx.fill()
  }
}
