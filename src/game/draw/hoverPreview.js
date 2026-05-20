import spriteColors from '../config/spriteColors.json'
import { TILE } from '../constants.jsx'

export function drawHoverPreview(ctx, hoverPreview, hoveredTile, spriteColorOverrides) {
  if (!hoverPreview || !hoveredTile) return

  const x = hoveredTile.c * TILE
  const y = hoveredTile.r * TILE
  let color = '#0a0612'

  if (hoverPreview.ss === 0x00) {
    const overrideKey = `${hoverPreview.ss}_v${hoverPreview.variant}`
    color = spriteColorOverrides?.[overrideKey] || spriteColors.floor[hoverPreview.variant] || spriteColors.floor[0]
  } else if (hoverPreview.ss === 0x01) {
    const overrideKey = `${hoverPreview.ss}_${hoverPreview.row}`
    color = spriteColorOverrides?.[overrideKey] || spriteColors.wall[hoverPreview.row] || spriteColors.wall[0]
  }

  ctx.fillStyle = color
  ctx.fillRect(x, y, TILE, TILE)
}
