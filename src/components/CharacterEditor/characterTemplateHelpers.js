export function applyShading(hex, originalBrightness) {
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

export function renderCharacterCanvas(pixelData, colors) {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  const previewFrame = pixelData.down[0]
  const { hair, skin, outfit, eyes, secondary, stick } = colors

  previewFrame.forEach(p => {
    let fill = p.color
    if (p.type === 'hair') fill = applyShading(hair, p.b)
    else if (p.type === 'skin') fill = applyShading(skin, p.b)
    else if (p.type === 'outfit') fill = applyShading(outfit, p.b)
    else if (p.type === 'eyes') fill = applyShading(eyes, p.b)
    else if (p.type === 'secondary') fill = applyShading(secondary, p.b)
    else if (p.type === 'stick') fill = applyShading(stick, p.b)
    else if (p.type === 'accessory') fill = applyShading('#ffd700', p.b)

    ctx.fillStyle = fill
    ctx.fillRect(p.x, p.y, 1, 1)
  })

  return canvas.toDataURL()
}
