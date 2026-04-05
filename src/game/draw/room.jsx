// Soft elliptical aura — drawn beneath a character sprite.
// rgb: comma-separated r,g,b string  e.g. '140,32,220'
// alpha: 0-1 centre opacity   rx/ry: ellipse radii in logical pixels
export function drawAura(ctx, cx, cy, rgb, alpha, rx, ry) {
  ctx.save()
  ctx.translate(Math.floor(cx), Math.floor(cy))
  ctx.scale(1, ry / rx)
  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  grd.addColorStop(0,   `rgba(${rgb},${alpha})`)
  grd.addColorStop(0.5, `rgba(${rgb},${(alpha * 0.4).toFixed(3)})`)
  grd.addColorStop(1,   `rgba(${rgb},0)`)
  ctx.fillStyle = grd
  ctx.fillRect(-rx, -rx, rx * 2, rx * 2)
  ctx.restore()
}

export function drawShadow(ctx, x, y, jumpFactor = 0) {
  ctx.save()
  ctx.globalAlpha = 0.35 * (1 - jumpFactor * 0.7)
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.ellipse(
    Math.floor(x) + 8, Math.floor(y) + 15,
    Math.max(1, 5 * (1 - jumpFactor * 0.5)),
    Math.max(0.5, 2 * (1 - jumpFactor * 0.5)),
    0, 0, Math.PI * 2
  )
  ctx.fill()
  ctx.restore()
}
