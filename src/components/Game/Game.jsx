import { useRef } from 'react'
import { W, H }   from '../../game/constants.jsx'
import { useGameLoop } from '../../hooks/useGameLoop.jsx'

export default function Game({ onStateChange, onInteract, paused }) {
  const canvasRef = useRef(null)
  useGameLoop(canvasRef, { onStateChange, onInteract, paused })
  return <canvas ref={canvasRef} className="game-canvas" width={W} height={H} />
}
