export function drawTableAuraGlow(ctx, tx, ty, auraAlpha) {
  if (auraAlpha < 0.01) return
  ctx.save()
  ctx.globalAlpha = auraAlpha * 0.45
  const ug = ctx.createRadialGradient(tx + 16, ty + 14, 0, tx + 16, ty + 14, 24)
  ug.addColorStop(0,   'rgba(110,60,255,1)')
  ug.addColorStop(0.5, 'rgba(60,20,180,0.6)')
  ug.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = ug
  ctx.fillRect(tx - 14, ty - 10, 60, 48)
  ctx.restore()
}

export function drawTableSheen(ctx, tx, ty) {
  ctx.save()
  ctx.globalAlpha = 0.13
  const sg = ctx.createLinearGradient(tx, ty + 6, tx + 32, ty + 6)
  sg.addColorStop(0,   'rgba(0,0,0,0)')
  sg.addColorStop(0.5, 'rgba(160,140,255,1)')
  sg.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = sg
  ctx.fillRect(tx, ty + 7, 32, 2)
  ctx.restore()
}

export function drawTableCardGlow(ctx, tx, ty, phase) {
  ctx.save()
  ctx.globalAlpha = 0.18 + Math.sin(phase * 0.9) * 0.08
  const hg = ctx.createRadialGradient(tx + 16, ty + 9, 0, tx + 16, ty + 9, 16)
  hg.addColorStop(0, 'rgba(160,80,255,1)')
  hg.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = hg
  ctx.fillRect(tx + 2, ty + 5, 28, 10)
  ctx.restore()
}
