import { hslToHsv, hsvToHsl } from './colorSpace.js'

export function renderSLSquareCanvas(ctx, hue, size) {
  const gradH = ctx.createLinearGradient(0, 0, size, 0)
  gradH.addColorStop(0, `hsl(${hue}, 0%, 100%)`)
  gradH.addColorStop(1, `hsl(${hue}, 100%, 50%)`)
  ctx.fillStyle = gradH
  ctx.fillRect(0, 0, size, size)

  const gradV = ctx.createLinearGradient(0, 0, 0, size)
  gradV.addColorStop(0, 'rgba(0,0,0,0)')
  gradV.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.fillStyle = gradV
  ctx.fillRect(0, 0, size, size)
}

export function computeSLCursor(hue, s, l, size) {
  const [, sv, v] = hslToHsv(hue, s, l)
  const cx = (sv / 100) * size
  const cy = (1 - v / 100) * size
  return [cx, cy]
}

export function pickSLColor(e, hue, size, canvasRef) {
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const px = Math.max(0, Math.min(size, (clientX - rect.left) * (size / rect.width)))
  const py = Math.max(0, Math.min(size, (clientY - rect.top) * (size / rect.height)))
  const sv = (px / size) * 100
  const v = (1 - py / size) * 100
  const [, ns, nl] = hsvToHsl(hue, sv, v)
  return [ns, nl]
}
