export function drawBurst(ctx, cx, cy, p) {
  if (p < 0.05) return
  const r = 18 + 40 * p
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  g.addColorStop(0,   `rgba(220, 245, 255, ${(p * 0.7).toFixed(3)})`)
  g.addColorStop(0.4, `rgba(120, 190, 255, ${(p * 0.3).toFixed(3)})`)
  g.addColorStop(1,   'rgba(60, 120, 255, 0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
}
