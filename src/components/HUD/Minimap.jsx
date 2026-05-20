import { useRef, useEffect } from 'react'
import { renderMinimap } from './minimapRender.js'

const MINIMAP_WIDTH = 120
const MINIMAP_HEIGHT = 84
const VIEW_RADIUS = 5

export default function Minimap({ playerPos, worldData, charColors }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !playerPos || !worldData?.collMap) return
    renderMinimap(canvas, playerPos, worldData, charColors, MINIMAP_WIDTH, MINIMAP_HEIGHT, VIEW_RADIUS)
  }, [playerPos, worldData, charColors])

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
