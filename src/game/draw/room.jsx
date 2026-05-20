import spriteColors from '../config/spriteColors.json'
import { TILE, floorColor } from './roomUtils.js'

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

export function drawRoom(ctx, layers, collMap, layerEdits = {}, spriteColorOverrides = {}) {
  iterateTiles(ctx, layers, collMap, (ctx, c, r, px, py, coll, layers) => {
    if (coll === 5 || coll === 1) return

    const tileKey = `${c},${r}`
    const edit = layerEdits[tileKey]
    const groundPixel = edit?.ground ?? layers.ground[r]?.[c]

    let color = groundPixel
      ? floorColor(groundPixel.variant ?? groundPixel.row)
      : '#0e0b1a'

    if (groundPixel) {
      const overrideKey = `${groundPixel.ss}_v${groundPixel.variant ?? groundPixel.row}`
      if (spriteColorOverrides[overrideKey]) {
        color = spriteColorOverrides[overrideKey]
      }
    }

    ctx.fillStyle = color
    ctx.fillRect(px, py, TILE, TILE)
  })
}
