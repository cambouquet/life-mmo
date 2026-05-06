import { useRef, useEffect } from 'react'
import { TILE } from '../../game/constants.jsx'

const MINIMAP_WIDTH = 120
const MINIMAP_HEIGHT = 84
const VIEW_RADIUS = 5

export default function Minimap({ playerPos, worldData }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !playerPos || !worldData?.collMap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear background - match HUD header color
    ctx.fillStyle = 'rgba(8, 6, 18, 0.8)'
    ctx.fillRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT)

    const playerTileX = playerPos.x / TILE
    const playerTileY = playerPos.y / TILE

    const tileSize = Math.floor(Math.min(
      MINIMAP_WIDTH / (VIEW_RADIUS * 2),
      MINIMAP_HEIGHT / (VIEW_RADIUS * 2)
    ))

    const centerX = Math.round(MINIMAP_WIDTH / 2)
    const centerY = Math.round(MINIMAP_HEIGHT / 2)

    const collMap = worldData.collMap
    const rows = collMap.length
    const cols = collMap[0]?.length || 0

    // First pass: Draw floor tiles with rounded corners
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tileDistX = Math.abs(c - playerTileX)
        const tileDistY = Math.abs(r - playerTileY)

        if (tileDistX > VIEW_RADIUS || tileDistY > VIEW_RADIUS) continue

        const tile = collMap[r][c]
        const offsetX = Math.round((c - playerTileX) * tileSize)
        const offsetY = Math.round((r - playerTileY) * tileSize)
        const x = Math.round(centerX + offsetX)
        const y = Math.round(centerY + offsetY)

        if (tile === 0) {
          // Floor - light blue with rounded corners
          ctx.fillStyle = 'rgba(70, 110, 150, 0.7)'
          roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 1)
          ctx.fill()
        }
      }
    }

    // Second pass: Draw objects and features
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tileDistX = Math.abs(c - playerTileX)
        const tileDistY = Math.abs(r - playerTileY)

        if (tileDistX > VIEW_RADIUS || tileDistY > VIEW_RADIUS) continue

        const tile = collMap[r][c]
        const offsetX = Math.round((c - playerTileX) * tileSize)
        const offsetY = Math.round((r - playerTileY) * tileSize)
        const x = Math.round(centerX + offsetX)
        const y = Math.round(centerY + offsetY)

        if (tile === 1) {
          // Wall - dark with border
          ctx.fillStyle = 'rgba(25, 25, 40, 0.9)'
          ctx.fillRect(x, y, tileSize, tileSize)
          ctx.strokeStyle = 'rgba(50, 50, 70, 0.6)'
          ctx.lineWidth = 0.5
          ctx.strokeRect(x, y, tileSize, tileSize)
        } else if (tile === 4) {
          // Mirror - bright cyan with glow effect
          const mirrorSize = tileSize * 0.7
          const mx = x + (tileSize - mirrorSize) / 2
          const my = y + (tileSize - mirrorSize) / 2
          ctx.fillStyle = 'rgba(100, 220, 255, 0.9)'
          roundRect(ctx, mx, my, mirrorSize, mirrorSize, 2)
          ctx.fill()
          ctx.strokeStyle = 'rgba(150, 240, 255, 0.6)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        } else if (tile === 3) {
          // Table - orange with outline
          const tableSize = tileSize * 0.8
          const tx = x + (tileSize - tableSize) / 2
          const ty = y + (tileSize - tableSize) / 2
          ctx.fillStyle = 'rgba(220, 140, 80, 0.85)'
          roundRect(ctx, tx, ty, tableSize, tableSize, 1.5)
          ctx.fill()
          ctx.strokeStyle = 'rgba(240, 160, 100, 0.5)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        } else if (tile === 6) {
          // Door - bright blue opening
          ctx.fillStyle = 'rgba(120, 180, 255, 0.75)'
          roundRect(ctx, x + 1, y + 1, tileSize - 2, tileSize - 2, 1)
          ctx.fill()
          ctx.strokeStyle = 'rgba(150, 200, 255, 0.7)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        } else if (tile === 5) {
          // Void - very dark
          ctx.fillStyle = 'rgba(10, 10, 20, 0.6)'
          ctx.fillRect(x, y, tileSize, tileSize)
        }
      }
    }

    // Draw player at center
    const playerRadius = 2
    ctx.fillStyle = 'rgba(255, 200, 50, 1)'
    ctx.beginPath()
    ctx.arc(centerX, centerY, playerRadius, 0, Math.PI * 2)
    ctx.fill()

    // Player outline
    ctx.strokeStyle = 'rgba(255, 220, 100, 0.7)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Direction indicator (pointing north)
    ctx.strokeStyle = 'rgba(255, 220, 100, 0.9)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - playerRadius - 1)
    ctx.lineTo(centerX, centerY - playerRadius - 5)
    ctx.stroke()

  }, [playerPos, worldData])

  return (
    <div className="minimap-container">
      <canvas
        ref={canvasRef}
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="minimap-canvas"
      />
    </div>
  )
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
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
