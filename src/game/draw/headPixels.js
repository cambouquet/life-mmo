import { getColorForPixel } from './headShading.js'

export function filterHeadPixels(standFrame) {
  return standFrame.filter(p => {
    if (p.type === 'stick') return false
    if (p.type === 'hair' || p.type === 'eyes') return true
    if (p.type === 'skin') return p.y <= 22
    if (p.type === 'outfit') return p.y <= 17
    return false
  })
}

export function calculateHeadBounds(headPixels) {
  const minX = Math.min(...headPixels.map(p => p.x))
  const maxX = Math.max(...headPixels.map(p => p.x))
  const minY = Math.min(...headPixels.map(p => p.y))
  const maxY = Math.max(...headPixels.map(p => p.y))
  const headW = maxX - minX + 1
  const headH = maxY - minY + 1
  return { minX, minY, headW, headH }
}

export function calculateHeadOffset(bounds) {
  const targetCenterX = 16
  const targetCenterY = 16
  const offsetX = targetCenterX - Math.floor(bounds.minX + bounds.headW / 2)
  const offsetY = targetCenterY - Math.floor(bounds.minY + bounds.headH / 2)
  return { offsetX, offsetY }
}

export function getHeadPixelColor(p, colors, isBlinking) {
  if (p.type === 'eyes' && isBlinking) return null
  return getColorForPixel(p.type, colors, p.b) ?? p.color
}
