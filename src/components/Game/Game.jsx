import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useGameLoop } from '../../hooks/useGameLoop.jsx'

const Game = forwardRef(function Game({ onStateChange, onInteract, paused, charColors }, ref) {
  const canvasRef  = useRef(null)
  const playerRef  = useRef(null)   // populated by useGameLoop

  useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef })

  useImperativeHandle(ref, () => ({
    canvas:    () => canvasRef.current,
    playerPos: () => playerRef.current ? { x: playerRef.current.x, y: playerRef.current.y } : { x: 0, y: 0 },
  }))

  return <canvas ref={canvasRef} className="game-canvas" width={window.innerWidth} height={window.innerHeight} />
})

export default Game
