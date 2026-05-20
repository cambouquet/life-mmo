export function drawHalo(ctx, x, y, phase) {
  const t = (phase / 4.5) % 1
  const ringBrightness = (1 - t) * 0.9
  const inner = Math.max(0, t - 0.22)
  const outer = Math.min(1, t + 0.08)
  const cx = Math.floor(x) + 9
  const cy = Math.floor(y) + 8

  if (isNaN(cx) || isNaN(cy) || !isFinite(cx) || !isFinite(cy)) return

  const r = 255, g = 255, b = 255
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 13)
  grd.addColorStop(0, `rgba(${r},${g},${b},0)`)
  grd.addColorStop(inner, `rgba(${r},${g},${b},0)`)
  grd.addColorStop(t, `rgba(${r},${g},${b},${ringBrightness.toFixed(2)})`)
  grd.addColorStop(outer, `rgba(${r},${g},${b},0)`)
  grd.addColorStop(1, `rgba(${r},${g},${b},0)`)

  ctx.save()
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(cx, cy, 13, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}
