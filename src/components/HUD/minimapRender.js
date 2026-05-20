import { TILE } from '../../game/constants.jsx'
import { drawTile } from './minimapUtils.js'
import { drawPlayerMarker } from './minimapPlayerRender'

export function renderMinimap(canvas, playerPos, worldData, charColors, MINIMAP_WIDTH, MINIMAP_HEIGHT, VIEW_RADIUS) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = 'rgba(8, 6, 18, 0.8)'
  ctx.fillRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT)

  const playerTileX = playerPos.x / TILE
  const playerTileY = playerPos.y / TILE
  const tileSize = Math.min(MINIMAP_WIDTH / (VIEW_RADIUS * 2), MINIMAP_HEIGHT / (VIEW_RADIUS * 2))
  const centerX = MINIMAP_WIDTH / 2
  const centerY = MINIMAP_HEIGHT / 2
  const collMap = worldData.collMap
  const rows = collMap.length
  const cols = collMap[0]?.length || 0

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileDistX = Math.abs(c - playerTileX)
      const tileDistY = Math.abs(r - playerTileY)
      if (tileDistX > VIEW_RADIUS || tileDistY > VIEW_RADIUS) continue

      const tile = collMap[r][c]
      const offsetX = (c - playerTileX) * tileSize
      const offsetY = (r - playerTileY) * tileSize
      const x = centerX + offsetX - tileSize / 2
      const y = centerY + offsetY - tileSize / 2
      drawTile(ctx, tile, x, y, tileSize)
    }
  }

  drawPlayerMarker(ctx, centerX, centerY, charColors)
}
