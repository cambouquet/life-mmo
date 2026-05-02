export function drawBadge(ctx, bx, by, torchPhase, label = '[SPC]') {
  const pulse = Math.sin(torchPhase * 2.5) * 0.18 + 0.82
  ctx.save()
  ctx.globalAlpha  = pulse
  ctx.fillStyle    = 'rgba(10,6,22,0.78)'
  ctx.fillRect(bx - 14, by - 4, 32, 8)
  ctx.strokeStyle  = '#4a2878'
  ctx.lineWidth    = 0.5
  ctx.strokeRect(bx - 14, by - 4, 32, 8)
  ctx.font         = '6px "Courier New"'
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle    = '#c8a8f0'
  ctx.fillText(label, bx, by)
  ctx.restore()
}
