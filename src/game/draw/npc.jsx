// Lyra - a seer in dark robes, facing down toward the player
const C = {
  skin:    '#f0c890',
  hair:    '#2a0e18',
  robe:    '#3a1858',
  robeLt:  '#5a2878',
  robeDk:  '#220c38',
  belt:    '#7040a8',
  crystal: '#b080e8',
  staff:   '#5c3a1e',
  eye:     '#2a0a0a',
}

export function drawNpc(ctx, x, y, phase) {
  x = Math.floor(x); y = Math.floor(y)

  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  // Staff (behind body)
  r(13, 1, 1, 14, C.staff)
  // Crystal orb on staff tip - pulsing glow
  const glowA = 0.3 + Math.sin(phase * 1.4) * 0.2
  ctx.save()
  ctx.globalAlpha = glowA
  ctx.fillStyle   = '#9060e0'
  ctx.beginPath(); ctx.arc(x + 13.5, y + 1, 4, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  p(13, 0, C.crystal)
  p(13, 1, '#e0d0ff')

  // Hair (escaping from hood on the sides)
  r(3, 2, 2, 5, C.hair)
  r(11, 2, 2, 5, C.hair)
  r(5, 1, 6, 1, C.hair)

  // Hood
  r(4, 0, 8, 2, C.robeDk)
  r(3, 1, 10, 1, C.robeDk)
  r(5, 0, 6, 1, '#160830')
  // Hood shadow framing face
  r(4, 2, 2, 3, C.robeDk)
  r(10, 2, 2, 3, C.robeDk)

  // Face
  r(6, 2, 4, 4, C.skin)
  r(5, 3, 1, 2, C.skin)
  r(10, 3, 1, 2, C.skin)
  // Eyes
  p(6, 3, C.eye); p(9, 3, C.eye)
  ctx.fillStyle = '#5a3020'; ctx.fillRect(x+6, y+2, 2, 1); ctx.fillRect(x+8, y+2, 2, 1)
  p(8, 5, '#c09870')

  // Robe body
  r(3, 6, 10, 7, C.robe)
  r(4, 5, 8, 2, C.robeLt)
  r(3, 6, 1, 7, C.robeLt)
  // Belt
  r(4, 9, 8, 1, C.belt)
  r(8, 7, 1, 5, C.robeDk)
  // Sleeves
  r(1, 6, 3, 4, C.robe)
  r(12, 6, 2, 4, C.robe)
  r(1, 9, 3, 1, C.robeLt)
  r(12, 9, 2, 1, C.robeLt)
  // Lower robe hem
  r(3, 12, 4, 2, C.robe)
  r(9, 12, 4, 2, C.robe)
  r(7, 13, 2, 1, C.robeDk)
}
