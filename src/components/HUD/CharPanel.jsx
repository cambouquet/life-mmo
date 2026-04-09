import { useEffect, useRef } from 'react'
import { drawHead } from '../../game/draw/head.jsx'

export default function CharPanel({ facing }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.imageSmoothingEnabled = false
    drawHead(ctx, facing, 'idle')
  }, [facing])

  return (
    <div className="char-panel">
      <canvas ref={canvasRef} width={24} height={24} />
      <div>
        <div className="char-panel__name">Kami</div>
        <div className="char-panel__class">Novice · Lv.1</div>
      </div>
    </div>
  )
}
