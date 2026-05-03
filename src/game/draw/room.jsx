import spriteColors from '../config/spriteColors.json'

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

function floorColor(row) { return spriteColors.floor[row] ?? spriteColors.floor[0] }
function wallColor(row)  { return spriteColors.wall[row]  ?? spriteColors.wall[0] }

// Draws the full world tile-by-tile from map layer data.
// layers:  { ground, walls, objects } — 2D grids of { ss, row, variant } | null
// collMap: 2D collision array (0=floor, 1=wall, 5=void, 6=door-open)
// layerEdits: map of edits from the editor { "c,r": { ground, wall, obj, entity } }
export function drawRoom(ctx, layers, collMap, layerEdits = {}) {
  iterateTiles(ctx, layers, collMap, (ctx, c, r, px, py, coll, layers) => {
    // Skip void (walls/bounds-of-light handles those tiles)
    if (coll === 5 || coll === 1) return

    const tileKey = `${c},${r}`
    const edit = layerEdits[tileKey]
    const groundPixel = edit?.ground ?? layers.ground[r]?.[c]
    const color = groundPixel
      ? floorColor(groundPixel.row)
      : '#0e0b1a'

    ctx.fillStyle = color
    ctx.fillRect(px, py, TILE, TILE)
  })
}
