import npcSvg from '../../assets/sprites/npc/idle.svg?raw'

function svgDataUri(svgText) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText)
}

const npcImg = new Image()
npcImg.src = svgDataUri(npcSvg)

export function drawNpc(ctx, x, y, phase) {
  x = Math.floor(x); y = Math.floor(y)

  if (npcImg.complete) {
    ctx.save()
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(npcImg, x - 8, y - 16, 32, 32)
    ctx.restore()
  }


  // Crystal glow pulse (pendant center at x+8, y+4 in 32×32 sprite space)
  const cp = 0.5 + Math.sin(phase * 2.1) * 0.5
  ctx.save()
  ctx.globalAlpha = cp * 0.55
  ctx.fillStyle = '#b060ff'
  ctx.beginPath()
  ctx.arc(x + 8, y + 4, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Animated tattoo glow on robe arms (scaled positions)
  const tw = 0.38 + Math.sin(phase * 1.6) * 0.32
  ctx.save()
  ctx.globalAlpha = tw
  ctx.fillStyle = '#c040ff'
  ctx.fillRect(x, y + 6, 2, 2)
  ctx.fillRect(x + 14, y + 6, 2, 2)
  ctx.fillStyle = '#f090ff'
  ctx.fillRect(x, y + 8, 2, 2)
  ctx.fillRect(x + 14, y + 8, 2, 2)
  ctx.restore()
}
