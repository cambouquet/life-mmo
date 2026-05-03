// Iterates through all tiles, calling callback for each tile's draw decision
export function iterateTiles(ctx, layers, collMap, onTile) {
  const rows = layers.height
  const cols = layers.width

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = c * TILE
      const py = r * TILE
      const coll = collMap[r]?.[c] ?? 5

      onTile(ctx, c, r, px, py, coll, layers)
    }
  }
}

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

// Spritesheet color palettes indexed by (ss, row)
// These must match the colors used in generate-spritesheets.mjs
const FLOOR_COLORS = ['#0e0b1a', '#0b0917', '#06040e', '#0e0b1a']
const WALL_COLORS  = ['#0c0a14', '#1e1a38', '#100e1c', '#0e0c1c']

function floorColor(row) { return FLOOR_COLORS[row] ?? '#0e0b1a' }
function wallColor(row)  { return WALL_COLORS[row]  ?? '#0c0a14' }

// Draws the full world tile-by-tile from map layer data.
// layers:  { ground, walls, objects } — 2D grids of { ss, row, variant } | null
// collMap: 2D collision array (0=floor, 1=wall, 5=void, 6=door-open)
export function drawRoom(ctx, layers, collMap) {
  iterateTiles(ctx, layers, collMap, (ctx, c, r, px, py, coll, layers) => {
    // Skip void (walls/bounds-of-light handles those tiles)
    if (coll === 5 || coll === 1) return

    const groundPixel = layers.ground[r]?.[c]
    const color = groundPixel
      ? floorColor(groundPixel.row)
      : '#0e0b1a'

    ctx.fillStyle = color
    ctx.fillRect(px, py, TILE, TILE)
  })
}
