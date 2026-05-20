import React from 'react'

export function WallPreview({ row, color }) {
  const size = 24
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)

    const glowSize = 3
    const glowColor = 'rgba(180, 230, 255, 0.8)'

    if (row === 0) {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, size, size)
    } else if (row === 1) {
      const grad = ctx.createLinearGradient(0, 0, 0, glowSize)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, size, glowSize)
    } else if (row === 2) {
      const grad = ctx.createLinearGradient(0, 0, glowSize, 0)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, glowSize, size)
    } else if (row === 3) {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize * 1.5)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, glowSize * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [row, color])

  return <canvas ref={canvasRef} style={{ width: size, height: size, imageRendering: 'pixelated' }} />
}
