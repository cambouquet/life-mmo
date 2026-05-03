import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useGameLoop } from '../../hooks/useGameLoop.jsx'

const Game = forwardRef(function Game({ onStateChange, onInteract, paused, charColors, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, onHoveredTileChange, onWorldDataChange }, ref) {
  const canvasRef  = useRef(null)
  const playerRef  = useRef(null)   // populated by useGameLoop

  useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, onHoveredTileChange, onWorldDataChange })

  useImperativeHandle(ref, () => ({
    canvas:    () => canvasRef.current,
    playerPos: () => playerRef.current ? { x: playerRef.current.x, y: playerRef.current.y } : { x: 0, y: 0 },
  }))

  const dpr = window.devicePixelRatio || 1
  return <canvas 
    ref={canvasRef} 
    className="game-canvas" 
    width={window.innerWidth * dpr} 
    height={window.innerHeight * dpr} 
    style={{ width: '100vw', height: '100vh' }}
  />
})

export default Game
