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
  let fill = p.color

  if (p.type === 'hair') fill = applyHeadShading(colors.hair, p.b)
  else if (p.type === 'skin') {
    const skinFactor = (p.b || 200) / 200
    const sr = parseInt(colors.skin.slice(1, 3), 16)
    const sg = parseInt(colors.skin.slice(3, 5), 16)
    const sb = parseInt(colors.skin.slice(5, 7), 16)
    fill = `rgb(${Math.min(255, sr * skinFactor)}, ${Math.min(255, sg * skinFactor)}, ${Math.min(255, sb * skinFactor)})`
  } else if (p.type === 'outfit') fill = applyHeadShading(colors.outfit, p.b)
  else if (p.type === 'eyes') {
    if (isBlinking) return null
    fill = applyHeadShading(colors.eyes, p.b)
  } else if (p.type === 'secondary') fill = applyHeadShading(colors.secondary, p.b)
  else if (p.type === 'stick') fill = applyHeadShading(colors.stick, p.b)
  else if (p.type === 'accessory') fill = applyHeadShading('#ffd700', p.b)

  return fill
}

function applyHeadShading(hex, originalBrightness) {
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
