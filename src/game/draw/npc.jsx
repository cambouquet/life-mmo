const P = {
  robe:   '#3a1858',
  robeLt: '#5a2878',
  hood:   '#1e0c38',
  hoodLt: '#3a1860',
  rim:    '#7040a8',
  skin:   '#c8a882',
  eye:    '#c0a0ff',
  eyeGlo: '#e0d0ff',
}

export function drawNpc(ctx, x, y, phase) {
  x = Math.floor(x); y = Math.floor(y)
  const bob = Math.sin(phase * 0.8) > 0 ? 1 : 0

  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  // Aura glow
  ctx.save()
  ctx.globalAlpha = 0.1 + Math.sin(phase * 0.7) * 0.05
  ctx.fillStyle   = '#8040d0'
  ctx.beginPath(); ctx.arc(x + 8, y + 9 + bob, 9, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // Hood
  r(4, 0+bob, 8, 5, P.hood)
  r(3, 2+bob, 10, 3, P.hood)
  r(4, 0+bob, 8, 2, P.hoodLt)
  // Hood rim
  r(3, 5+bob, 10, 1, P.rim)
  // Face strip
  r(4, 3+bob, 8, 2, P.skin)
  // Glowing eyes
  ctx.save()
  ctx.globalAlpha = 0.55 + Math.sin(phase * 1.3) * 0.3
  p(6, 4+bob, P.eyeGlo); p(9, 4+bob, P.eyeGlo)
  ctx.restore()
  p(6, 4+bob, P.eye); p(9, 4+bob, P.eye)

  // Robe body
  r(2, 6+bob, 12, 7, P.robe)
  r(3, 5+bob, 10, 2, P.robeLt)  // shoulder
  r(2, 6+bob, 1, 7, P.robeLt)   // left edge

  // Hem
  r(2, 12+bob, 5, 2, P.robe)
  r(9, 12+bob, 5, 2, P.robe)
  p(2, 14+bob, P.robeLt)
  p(13, 14+bob, P.robeLt)
}

export function drawSpeechBubble(ctx, text, cx, top) {
  ctx.font         = '5px "Courier New"'
  const tw         = ctx.measureText(text).width
  const bw         = Math.ceil(tw) + 8
  const bh         = 9
  const bx         = Math.floor(cx - bw / 2)
  const by         = top - bh - 5

  ctx.fillStyle    = 'rgba(12,6,26,0.92)'
  ctx.fillRect(bx, by, bw, bh)
  ctx.strokeStyle  = '#7040a8'
  ctx.lineWidth    = 0.5
  ctx.strokeRect(bx, by, bw, bh)

  // Pointer triangle (3 px tail)
  ctx.fillStyle    = 'rgba(12,6,26,0.92)'
  ctx.fillRect(Math.floor(cx) - 1, by + bh, 3, 3)

  ctx.fillStyle    = '#d8b8ff'
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, cx, by + Math.floor(bh / 2))
}
