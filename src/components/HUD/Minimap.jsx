import { useRef, useEffect, useState } from 'react'
import { TOTAL_W, TOTAL_H, TILE } from '../../game/constants.jsx'

const MINIMAP_WIDTH = 120
const MINIMAP_HEIGHT = 84
const TILE_SIZE = MINIMAP_WIDTH / TOTAL_W

export default function Minimap({ playerPos, exploredTiles }) {
  const canvasRef = useRef(null)
  const [mapScale] = useState(() => ({
    w: MINIMAP_WIDTH,
    h: MINIMAP_HEIGHT,
    tileSize: TILE_SIZE,
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear background
    ctx.fillStyle = 'rgba(20, 20, 30, 0.9)'
    ctx.fillRect(0, 0, mapScale.w, mapScale.h)

    // Draw border
    ctx.strokeStyle = 'rgba(100, 120, 150, 0.6)'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, mapScale.w, mapScale.h)

    // Draw explored tiles (war fog)
    if (exploredTiles && exploredTiles.size > 0) {
      ctx.fillStyle = 'rgba(60, 80, 120, 0.5)'
      exploredTiles.forEach(tileKey => {
        const [r, c] = tileKey.split(',').map(Number)
        const x = c * mapScale.tileSize
        const y = r * mapScale.tileSize
        ctx.fillRect(x, y, mapScale.tileSize, mapScale.tileSize)
      })
    }

    // Draw player (center indicator)
    if (playerPos) {
      const playerTileX = playerPos.x / TILE
      const playerTileY = playerPos.y / TILE
      const px = playerTileX * mapScale.tileSize
      const py = playerTileY * mapScale.tileSize

      // Player circle
      ctx.fillStyle = 'rgba(255, 150, 50, 0.9)'
      ctx.beginPath()
      ctx.arc(px + mapScale.tileSize / 2, py + mapScale.tileSize / 2, 3, 0, Math.PI * 2)
      ctx.fill()

      // Direction indicator
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.7)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(px + mapScale.tileSize / 2, py + mapScale.tileSize / 2)
      ctx.lineTo(px + mapScale.tileSize / 2, py + mapScale.tileSize / 2 - 5)
      ctx.stroke()
    }
  }, [playerPos, exploredTiles, mapScale])

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
