import pixelData from '../../components/CharacterEditor/pixel_data.json'

let offscreenPlayerCanvas = null
let offscreenPlayerCtx = null
let lastRenderState = ""

export const applyShading = (hex, originalBrightness) => {
  if (!hex) return '#000000'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const factor = (originalBrightness || 160) / 160
  const nr = Math.min(255, Math.floor(r * factor))
  const ng = Math.min(255, Math.floor(g * factor))
  const nb = Math.min(255, Math.floor(b * factor))
  return `rgb(${nr}, ${ng}, ${nb})`
}

export function drawVectorWarrior(ctx, x, y, facing, frame, colors, moving) {
  const { hair, skin, outfit, eyes, secondary, stick } = colors

  if (!offscreenPlayerCanvas) {
    offscreenPlayerCanvas = document.createElement('canvas')
    offscreenPlayerCanvas.width = 32
    offscreenPlayerCanvas.height = 32
    offscreenPlayerCtx = offscreenPlayerCanvas.getContext('2d', { alpha: true })
    offscreenPlayerCtx.imageSmoothingEnabled = false
  }

  const currentFrameIndex = moving ? (frame % 8) : 0
  const stateKey = `${facing}-${currentFrameIndex}-${hair}-${skin}-${outfit}-${eyes}-${secondary}-${stick}`

  if (stateKey !== lastRenderState) {
    offscreenPlayerCtx.clearRect(0, 0, 32, 32)
    const dirFrames = pixelData[facing] || pixelData.down
    let currentFrame = dirFrames[currentFrameIndex]
    if (!currentFrame || currentFrame.length < 5) currentFrame = dirFrames[0]

    const len = currentFrame.length
    for (let i = 0; i < len; i++) {
      const p = currentFrame[i]
      let fill = p.color
      if (p.type === 'hair') fill = applyShading(hair, p.b)
      else if (p.type === 'skin') fill = applyShading(skin, p.b)
      else if (p.type === 'outfit') fill = applyShading(outfit, p.b)
      else if (p.type === 'eyes') fill = applyShading(eyes, p.b)
      else if (p.type === 'secondary') fill = applyShading(secondary, p.b)
      else if (p.type === 'stick') fill = applyShading(stick, p.b)
      else if (p.type === 'accessory') fill = applyShading('#ffd700', p.b)
      offscreenPlayerCtx.fillStyle = fill
      offscreenPlayerCtx.fillRect(p.x, p.y, 1, 1)
    }
    lastRenderState = stateKey
  }

  ctx.save()
  ctx.imageSmoothingEnabled = false
  const drawX = Math.round(x) - 8
  const drawY = Math.round(y) - 16
  ctx.translate(drawX, drawY)
  ctx.drawImage(offscreenPlayerCanvas, 0, 0, 32, 32)
  ctx.restore()
}
