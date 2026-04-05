const C = {
  skin:      '#f5c9a0',
  skinDk:    '#c8956a',
  skinLt:    '#f8ddb8',
  hair:      '#e8d090',
  hairHi:    '#fff8d0',
  hairDk:    '#b09858',
  robe:      '#3820b8',
  robeLt:    '#6048f0',
  robeDk:    '#100840',
  robeMid:   '#2a18a0',
  collar:    '#7828c8',
  collarLt:  '#a050f0',
  crystal:   '#d0a8ff',
  crystalHi: '#ffffff',
  tattoo:    '#c040ff',
  tattooLt:  '#f090ff',
  eye:       '#2a0a40',
  lash:      '#8030a0',
}

// 9px wide x 14px tall mage, centered in 16x16 tile at ox=x+3, oy=y+1
export function drawNpc(ctx, x, y, phase) {
  x = Math.floor(x); y = Math.floor(y)
  const ox = x + 3, oy = y + 1
  const f = (lx, ly, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(ox+lx, oy+ly, w, h) }
  const d = (lx, ly, c)       => { ctx.fillStyle = c; ctx.fillRect(ox+lx, oy+ly, 1, 1) }

  // HAIR — crown + long side sweeps framing face
  f(1, 0, 5, 1, C.hair)
  f(0, 1, 7, 1, C.hair)
  d(2, 0, C.hairHi); d(4, 0, C.hairHi)
  d(0, 1, C.hairHi); d(6, 1, C.hairHi)
  f(0, 2, 1, 5, C.hair)
  f(6, 2, 1, 5, C.hair)
  d(0, 5, C.hairDk); d(6, 5, C.hairDk)

  // FACE — 5px wide rows 2-5, rounded corners
  f(1, 2, 5, 4, C.skin)
  d(1, 2, C.hair); d(5, 2, C.hair)
  d(1, 5, C.skinDk); d(5, 5, C.skinDk)
  d(1, 3, C.skinDk); d(5, 3, C.skinDk)
  // eyes with lashes
  d(2, 3, C.eye); d(3, 3, C.eye)
  d(4, 3, C.lash)
  d(2, 2, C.lash); d(3, 2, C.lash)
  // nose + lips
  d(3, 4, C.skinDk)
  d(2, 5, C.skinDk); d(3, 5, C.skinLt); d(4, 5, C.skinDk)

  // NECK
  f(2, 6, 3, 1, C.skin)
  d(1, 6, C.skinDk); d(5, 6, C.skinDk)

  // HIGH COLLAR
  f(1, 7, 5, 1, C.collar)
  d(0, 7, C.collarLt); d(6, 7, C.collarLt); d(3, 7, C.collarLt)

  // ROBE rows 8-13
  f(0, 8, 7, 6, C.robe)
  f(0, 8, 1, 6, C.robeLt)
  f(6, 8, 1, 6, C.robeDk)
  f(1, 8, 5, 1, C.robeLt)
  f(2, 8, 3, 2, C.robeMid)
  d(3, 8, C.collar)

  // CRYSTAL PENDANT
  d(3, 9, C.crystalHi)
  d(3,10, C.crystal); d(3,11, C.crystal); d(2,10, C.crystal); d(4,10, C.crystal)
  const cp = 0.5 + Math.sin(phase * 2.1) * 0.5
  ctx.save()
  ctx.globalAlpha = cp * 0.60
  ctx.fillStyle = '#b060ff'
  ctx.beginPath(); ctx.arc(ox + 3, oy + 10, 3.5, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // ROBE FOLDS
  d(2, 9, C.robeMid); d(4, 9, C.robeMid)
  d(2,11, C.robeMid); d(4,11, C.robeMid)

  // ANIMATED TATTOOS
  const tw = 0.4 + Math.sin(phase * 1.6) * 0.35
  ctx.save(); ctx.globalAlpha = tw
  d(1,10, C.tattoo); d(5,10, C.tattoo)
  d(1,11, C.tattooLt); d(5,11, C.tattooLt)
  ctx.restore()

  // HEM
  f(0,13, 7, 1, C.robeDk)
  d(0,13, C.robeMid); d(6,13, C.robeMid)
}