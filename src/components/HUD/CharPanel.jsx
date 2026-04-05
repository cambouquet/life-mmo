import { useEffect, useRef, useState, useCallback } from 'react'
import { drawHead } from '../../game/draw/head.jsx'

export default function CharPanel({ facing, moving }) {
  const canvasRef   = useRef(null)
  const blinkTimer  = useRef(0)
  const blinking    = useRef(false)
  const lastTs      = useRef(null)
  const rafRef      = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.imageSmoothingEnabled = false

    function tick(ts) {
      const dt = lastTs.current !== null ? Math.min((ts - lastTs.current) / 1000, 0.05) : 0
      lastTs.current = ts

      if (!moving) {
        blinkTimer.current += dt
        if (blinkTimer.current > 3.5 && !blinking.current) {
          blinking.current = true
          setTimeout(() => { blinking.current = false; blinkTimer.current = 0 }, 140)
        }
      } else {
        blinkTimer.current = 0
        blinking.current   = false
      }

      const expr = blinking.current ? 'blink' : (moving ? 'walk' : 'idle')
      drawHead(ctx, facing, expr)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [facing, moving])

  return (
    <div className="char-panel">
      <canvas ref={canvasRef} width={12} height={10} />
      <div>
        <div className="char-panel__name">Kami</div>
        <div className="char-panel__class">Novice · Lv.1</div>
      </div>
    </div>
  )
}
