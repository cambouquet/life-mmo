export function applyHeadShading(hex, originalBrightness) {
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

export function getColorForPixel(type, colors, brightness) {
  if (type === 'hair') return applyHeadShading(colors.hair, brightness)
  if (type === 'outfit') return applyHeadShading(colors.outfit, brightness)
  if (type === 'eyes') return applyHeadShading(colors.eyes, brightness)
  if (type === 'secondary') return applyHeadShading(colors.secondary, brightness)
  if (type === 'stick') return applyHeadShading(colors.stick, brightness)
  if (type === 'accessory') return applyHeadShading('#ffd700', brightness)
  if (type === 'skin') {
    const skinFactor = (brightness || 200) / 200
    const sr = parseInt(colors.skin.slice(1, 3), 16)
    const sg = parseInt(colors.skin.slice(3, 5), 16)
    const sb = parseInt(colors.skin.slice(5, 7), 16)
    return `rgb(${Math.min(255, sr * skinFactor)}, ${Math.min(255, sg * skinFactor)}, ${Math.min(255, sb * skinFactor)})`
  }
  return undefined
}
