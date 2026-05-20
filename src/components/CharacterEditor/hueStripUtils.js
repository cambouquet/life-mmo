export function renderHueStripCanvas(ctx, width, height) {
  const grad = ctx.createLinearGradient(0, 0, width, 0)
  for (let i = 0; i <= 12; i++) {
    grad.addColorStop(i / 12, `hsl(${i * 30}, 100%, 50%)`)
  }
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)
}

export function pickHueColor(e, width, canvasRef) {
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const px = Math.max(0, Math.min(width, (clientX - rect.left) * (width / rect.width)))
  return (px / width) * 360
}
