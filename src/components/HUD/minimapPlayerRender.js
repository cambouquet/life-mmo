import { adjustBrightness } from './minimapUtils'

export function drawPlayerMarker(ctx, centerX, centerY, charColors) {
  const outfitColor = charColors?.outfit || '#ffffff'
  const brightColor = adjustBrightness(outfitColor, 2.5)

  ctx.fillStyle = brightColor.replace('0.7)', '0.3)')
  ctx.beginPath()
  ctx.arc(centerX, centerY, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = brightColor
  ctx.beginPath()
  ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = brightColor
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX, centerY - 3)
  ctx.lineTo(centerX, centerY - 7)
  ctx.stroke()
}
