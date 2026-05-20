export function drawEditorBackdrop(ctx) {
  const { width: W, height: H } = ctx.canvas
  ctx.fillStyle = '#16112a'
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W * 0.1, 80)
  ctx.lineTo(W * 0.9, 80)
  ctx.stroke()
}
