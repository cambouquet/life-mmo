// Lyra — urban seer: dark longcoat, glowing sigil tattoos, crystal pendant
const C = {
  skin:      '#f0c890',
  skinDk:    '#c08858',
  hair:      '#0e0818',
  hairHi:    '#2a1040',
  coat:      '#0e1028',
  coatLt:    '#1a1c3e',
  coatDk:    '#07080f',
  coatFold:  '#141630',
  collar:    '#1e1040',
  tattoo:    '#a040f0',
  tattooLt:  '#d090ff',
  crystal:   '#c090f0',
  crystalHi: '#f0e0ff',
  chain:     '#b09860',
  eye:       '#200828',
}

export function drawNpc(ctx, x, y, phase) {
  x = Math.floor(x); y = Math.floor(y)
  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  const aura = 0.10 + Math.sin(phase * 0.8) * 0.07
  ctx.save()
  ctx.globalAlpha = aura
  ctx.fillStyle = '#7020c0'
  ctx.beginPath(); ctx.ellipse(x + 8, y + 15, 10, 4, 0, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  r( 4,  6, 8, 9, C.coat)
  r( 4,  6, 1, 9, C.coatLt)
  r( 9,  8, 1, 6, C.coatFold)
  r( 5,  9, 1, 5, C.coatFold)
  r( 4,  5,10, 2, C.collar)
  p( 4,  5, C.coatLt); p(13,  5, C.coatLt)

  r( 2,  7, 3, 6, C.coat)
  r(11,  7, 3, 6, C.coat)
  r( 2, 12, 2, 1, C.coatDk)
  r(11, 12, 2, 1, C.coatDk)
  p( 2, 11, C.tattoo); p( 3, 11, C.tattooLt)
  p( 2, 12, C.tattoo)

  const tw = 0.55 + Math.sin(phase * 1.6) * 0.45
  ctx.save(); ctx.globalAlpha = tw
  ctx.fillStyle = C.tattoo
  ctx.fillRect(x+5, y+7, 1, 1); ctx.fillRect(x+6, y+8, 1, 1); ctx.fillRect(x+5, y+9, 1, 1)
  ctx.fillRect(x+10,y+7, 1, 1); ctx.fillRect(x+9, y+8, 1, 1); ctx.fillRect(x+10,y+9, 1, 1)
  ctx.fillStyle = C.tattooLt
  ctx.fillRect(x+7, y+8, 2, 1)
  ctx.restore()

  r( 4, 15, 8, 1, C.coat)
  r( 3, 14,10, 1, C.coatDk)

  const cp = 0.7 + Math.sin(phase * 2.1) * 0.3
  ctx.save(); ctx.globalAlpha = cp * 0.6
  ctx.fillStyle = '#9040e0'
  ctx.beginPath(); ctx.arc(x + 8, y + 11, 4, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  p( 7, 10, C.chain); p( 8, 10, C.chain)
  p( 8, 11, C.crystal); p( 7, 12, C.crystal)
  p( 8, 12, C.crystalHi); p( 9, 12, C.crystal)

  r( 4,  0, 8, 2, C.hair)
  r( 3,  0, 2, 5, C.hair)
  r(11,  0, 3, 4, C.hair)
  p( 5,  0, C.hairHi); p( 9,  0, C.hairHi)
  p( 3,  3, C.hairHi)

  r( 4,  2, 8, 4, C.skin)
  p( 5,  3, C.skin); p(10,  3, C.skin)
  p( 8,  4, C.skinDk)
  ctx.fillStyle = C.eye
  ctx.fillRect(x+6, y+3, 1, 1); ctx.fillRect(x+9, y+3, 1, 1)
  ctx.save(); ctx.globalAlpha = 0.7
  ctx.fillStyle = C.tattoo
  ctx.fillRect(x+6, y+3, 1, 1); ctx.fillRect(x+9, y+3, 1, 1)
  ctx.restore()
  p( 7,  5, '#c07868'); p( 8,  5, '#c07868')
}
