import { drawWarriorSprite } from './warrior.jsx'

export function drawReflectionTint(ctx, drawX, drawY, clipX, clipY, clipW, clipH) {
  ctx.save()
  ctx.globalAlpha = 0.20
  const tint = ctx.createLinearGradient(drawX, drawY, drawX + 10, drawY + clipH)
  tint.addColorStop(0, 'rgba(80,80,200,1)')
  tint.addColorStop(1, 'rgba(8,6,32,1)')
  ctx.fillStyle = tint
  ctx.fillRect(clipX, clipY, clipW, clipH)
  ctx.restore()
}

export function drawReflection(ctx, drawX, drawY, W, H, reflection, phase) {
  if (!reflection || reflection.alpha <= 0.02) return

  ctx.save()
  const clipX = drawX + 1
  const clipY = drawY + 1
  const clipW = W - 2
  const clipH = H - 2

  ctx.beginPath()
  ctx.rect(clipX, clipY, clipW, clipH)
  ctx.clip()

  ctx.globalAlpha = reflection.alpha * 0.72

  let reflFacing = reflection.facing
  if (reflection.facing === 'up') reflFacing = 'down'
  else if (reflection.facing === 'down') reflFacing = 'up'
  else if (reflection.facing === 'left') reflFacing = 'right'
  else if (reflection.facing === 'right') reflFacing = 'left'

  const mirrorWorldWallLine = drawY + 32
  const glassBottom = drawY + H
  const playerFeetLine = reflection.y + 8
  const distFromMirror = playerFeetLine - mirrorWorldWallLine
  const reflY = glassBottom - distFromMirror - 8
  const reflX = reflection.x + 16

  if (isFinite(reflX) && isFinite(reflY)) {
    ctx.save()
    ctx.translate(reflX, 0)
    ctx.scale(-1, 1)
    ctx.translate(-reflX, 0)
    drawWarriorSprite(ctx, reflX, reflY, reflFacing, reflection.frame, phase, reflection.colors, reflection.moving, true)
    ctx.restore()
  }

  ctx.restore()
  drawReflectionTint(ctx, drawX, drawY, clipX, clipY, clipW, clipH)
}
