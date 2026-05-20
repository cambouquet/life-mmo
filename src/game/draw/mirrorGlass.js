export function drawGlassBase(ctx, drawX, drawY, W, H) {
  ctx.fillStyle = '#0d0b1e'
  ctx.fillRect(drawX, drawY, W, H)

  ctx.save()
  ctx.globalAlpha = 0.82
  const mg = ctx.createLinearGradient(drawX, drawY, drawX + 10, drawY + H)
  mg.addColorStop(0, '#6868c0')
  mg.addColorStop(0.4, '#302880')
  mg.addColorStop(1, '#0e0c2a')
  ctx.fillStyle = mg
  ctx.fillRect(drawX, drawY, W, H)
  ctx.restore()
}

export function drawGlassEdges(ctx, drawX, drawY, W, H) {
  ctx.save()
  ctx.globalAlpha = 0.45
  ctx.fillStyle = '#c8c8e8'
  ctx.fillRect(drawX, drawY, W, 1)
  ctx.fillStyle = '#b0b0d8'
  ctx.fillRect(drawX, drawY, 1, H)
  ctx.restore()
}

export function drawHighlights(ctx, drawX, drawY) {
  const p = (ox, oy, c) => { ctx.fillStyle = c; ctx.fillRect(drawX + ox, drawY + oy, 1, 1) }
  p(2, 2, '#ffffff')
  p(3, 2, '#e0e0ff')
  p(2, 3, '#e0e0ff')
  p(4, 2, '#c0c0f0')
  p(2, 4, '#c0c0f0')
  p(3, 3, '#c8c8f8')
}

export function drawGlowHalo(ctx, drawX, drawY, W, H, phase) {
  const gx = Math.round(drawX + W / 2)
  const gy = Math.round(drawY + H / 2)
  if (!isNaN(gx) && !isNaN(gy)) {
    ctx.save()
    ctx.globalAlpha = 0.18 + Math.sin(phase) * 0.07
    const grd = ctx.createRadialGradient(gx, gy, 2, gx, gy, 22)
    grd.addColorStop(0, 'rgba(140,80,255,1)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.fillRect(drawX - 8, drawY - 8, W + 16, H + 16)
    ctx.restore()
  }
}
