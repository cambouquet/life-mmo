import { applyShading } from './warrior.jsx'
import pixelData from '../../components/CharacterEditor/pixel_data.json'

/**
 * Renders a full-screen semi-transparent overlay for the editor.
 */
export function drawEditorOverlay(ctx, colors, birthData) {
  const { width: W, height: H } = ctx.canvas
  
  // 1. Dark backdrop
  ctx.save()
  ctx.fillStyle = '#16112a' // Solid dark background for full screen
  ctx.fillRect(0, 0, W, H)
  
  // Separator
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W * 0.1, 80)
  ctx.lineTo(W * 0.9, 80)
  ctx.stroke()

  // 4. Draw Character Preview
  const charSize = 256
  const cx = W / 2
  const cy = H / 2 - 20
  
  // Larger glowing orb behind char
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 150)
  grad.addColorStop(0, 'rgba(120, 60, 255, 0.3)')
  grad.addColorStop(1, 'rgba(120, 60, 255, 0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, 150, 0, Math.PI * 2)
  ctx.fill()

  // Draw the actual character pixels (32x32 upscaled more for full screen)
  const frame = pixelData.down[0]
  const scale = 8
  
  ctx.save()
  ctx.translate(cx - (16 * scale), cy - (16 * scale))
  ctx.scale(scale, scale)
  
  frame.forEach(p => {
    let fill = p.color
    if (p.type === 'hair') fill = applyShading(colors.hair, p.b)
    else if (p.type === 'skin') fill = applyShading(colors.skin, p.b)
    else if (p.type === 'outfit') fill = applyShading(colors.outfit, p.b)
    else if (p.type === 'eyes') fill = applyShading(colors.eyes, p.b)
    else if (p.type === 'secondary') fill = applyShading(colors.secondary, p.b)
    else if (p.type === 'stick') fill = applyShading(colors.stick, p.b)
    
    ctx.fillStyle = fill
    ctx.fillRect(p.x, p.y, 1, 1)
  })
  ctx.restore()

  // 5. Draw birth data text
  ctx.fillStyle = '#a855f7'
  ctx.font = '20px "Courier New", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${birthData.date} | ${birthData.time}`, W / 2, cy + 180)
  if (birthData.city) {
    ctx.fillText(`${birthData.city.name}, ${birthData.city.country}`, W / 2, cy + 210)
  }

  // 6. Draw "Color" labels (mocking picker circles)
  const labels = Object.keys(colors)
  const spacing = 70
  const startX = cx - ((labels.length - 1) * spacing) / 2
  labels.forEach((key, i) => {
    const lx = startX + i * spacing
    const ly = H - 100
    
    // Circle
    ctx.fillStyle = colors[key]
    ctx.beginPath()
    ctx.arc(lx, ly, 25, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Key text
    ctx.fillStyle = '#c084fc'
    ctx.font = 'bold 12px "Courier New"'
    ctx.fillText(key.toUpperCase(), lx, ly + 50)
  })

  ctx.restore()
}
