import pixelData from '../../components/CharacterEditor/pixel_data.json'
import { filterHeadPixels, calculateHeadBounds, calculateHeadOffset, getHeadPixelColor } from './headPixels.js'

const CV = 32

export function drawHead(ctx, facing, expr, colors, options = {}) {
  const { isBlinking = false } = options
  ctx.clearRect(0, 0, CV, CV)

  if (colors) {
    drawVectorHead(ctx, colors, facing, isBlinking)
  }
}

function drawVectorHead(ctx, colors, facing, isBlinking) {
  const dirFrames = pixelData[facing] || pixelData.down
  const standFrame = dirFrames[0] || dirFrames

  const headPixels = filterHeadPixels(standFrame)
  if (headPixels.length === 0) return

  const bounds = calculateHeadBounds(headPixels)
  const { offsetX, offsetY } = calculateHeadOffset(bounds)

  ctx.save()
  ctx.imageSmoothingEnabled = false

  headPixels.forEach(p => {
    const fill = getHeadPixelColor(p, colors, isBlinking)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fillRect(p.x + offsetX, p.y + offsetY, 1, 1)
    }
  })

  ctx.restore()
}

