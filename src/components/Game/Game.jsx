import { useRef, useEffect, useState } from 'react'
import { useGameLoop } from '../../hooks/useGameLoop.jsx'

const HUD_H  = 64
const HINT_H = 40

function viewportSize() {
  return {
    w: window.innerWidth,
    h: Math.max(200, window.innerHeight - HUD_H - HINT_H),
  }
}

export default function Game({ onStateChange, onInteract, paused }) {
  const canvasRef = useRef(null)
  const [size, setSize] = useState(viewportSize)

  useEffect(() => {
    const onResize = () => setSize(viewportSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useGameLoop(canvasRef, { onStateChange, onInteract, paused })
  return <canvas ref={canvasRef} className="game-canvas" width={size.w} height={size.h} />
}
