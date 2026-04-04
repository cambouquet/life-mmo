import { useEffect, useRef } from 'react'
import { drawLogo } from '../../game/drawLogo.js'

export default function Logo() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.imageSmoothingEnabled = false
    drawLogo(ctx)
  }, [])

  return (
    <div className="logo-panel">
      <canvas ref={canvasRef} width={48} height={26} />
    </div>
  )
}
