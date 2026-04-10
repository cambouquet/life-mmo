import { useRef } from 'react'
import { useGameLoop } from '../../hooks/useGameLoop.jsx'

export default function Game({ onStateChange, onInteract, paused, charColors }) {
  const canvasRef = useRef(null)
  useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors })
  return <canvas ref={canvasRef} className="game-canvas" width={window.innerWidth} height={window.innerHeight} />
}
