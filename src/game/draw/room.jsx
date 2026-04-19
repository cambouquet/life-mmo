// Soft elliptical aura — drawn beneath a character sprite.
// rgb: comma-separated r,g,b string  e.g. '140,32,220'
// alpha: 0-1 centre opacity   rx/ry: ellipse radii in logical pixels
export function drawAura(ctx, cx, cy, rgb, alpha, rx, ry) {
  ctx.save()
  ctx.translate(Math.floor(cx), Math.floor(cy))
  ctx.scale(1, ry / rx)
  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  grd.addColorStop(0,   `rgba(${rgb},${alpha})`)
  grd.addColorStop(0.5, `rgba(${rgb},${(alpha * 0.4).toFixed(3)})`)
  grd.addColorStop(1,   `rgba(${rgb},0)`)
  ctx.fillStyle = grd
  ctx.fillRect(-rx, -rx, rx * 2, rx * 2)
  ctx.restore()
}

export function drawShadow(ctx, x, y, jumpFactor = 0) {
  ctx.save()
  ctx.globalAlpha = 0.35 * (1 - jumpFactor * 0.7)
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.ellipse(
    Math.floor(x) + 8, Math.floor(y) + 15,
    Math.max(1, 5 * (1 - jumpFactor * 0.5)),
    Math.max(0.5, 2 * (1 - jumpFactor * 0.5)),
    0, 0, Math.PI * 2
  )
  ctx.fill()
  ctx.restore()
}

const TILE = 16

// Draws the full room tile-by-tile from the map array
export function drawRoom(ctx, map, phase = 0) {
  const rows = map.length
  const cols = map[0]?.length ?? 0

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t  = map[r][c]
      const px = c * TILE
      const py = r * TILE

      if (t === 1) {
        // Wall tile — no explicit tiles drawn, handled by drawBoundsOfLight
      } else if (t === 4) {
        // Mirror backing — drawMirror() in the game loop paints the full 32×32 visual on top
        ctx.fillStyle = '#07060e'
        ctx.fillRect(px, py, TILE, TILE)
      } else if (t === 3) {
        // Table tile (already handled by drawTable in game loop, but needs background here)
        ctx.fillStyle = c % 2 === r % 2 ? '#0e0b1a' : '#0b0917'
        ctx.fillRect(px, py, TILE, TILE)
      } else {
        // Floor tile (0 = floor, 2 = door gap, 3 = furniture base)
        // Hidden/void background is handled by the clearRect/fillRect, 
        // we only draw interactable objects or let the floor remain the dark void.
      }
    }
  }
}

