export function drawBadge(ctx, bx, by, torchPhase, label = '[SPC]') {
  const pulse = Math.sin(torchPhase * 2.5) * 0.18 + 0.82
  ctx.save()
  ctx.globalAlpha = pulse
  ctx.fillStyle = 'rgba(10,6,22,0.78)'
  ctx.fillRect(bx - 14, by - 4, 32, 8)
  ctx.strokeStyle = '#4a2878'
  ctx.lineWidth = 0.5
  ctx.strokeRect(bx - 14, by - 4, 32, 8)
  ctx.font = '500 7px "Outfit", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#f4f0ff'
  ctx.fillText(label, bx, by + 0.5)
  ctx.restore()
}

export function calculateReflection(player, MIRROR_CX, MIRROR_CY, charColors) {
  const mirrorDist = Math.hypot(player.x + 8 - MIRROR_CX, player.y + 8 - MIRROR_CY)
  const reflAlpha = Math.max(0, Math.min(1, (64 - mirrorDist) / 44))
  return reflAlpha > 0.02
    ? {
        facing: player.facing,
        frame: player.frame,
        colors: charColors,
        moving: player.moving,
        alpha: reflAlpha,
        x: player.x,
        y: player.y,
      }
    : null
}

export function calculateTableAlpha(pcx, pcy, TABLE_CX, TABLE_CY) {
  const tableDist = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
  return Math.max(0, Math.min(1, (48 - tableDist) / 36))
}
