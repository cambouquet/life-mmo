// Lyra — a seer in dark robes, facing down toward the player
const C = {
  skin:      '#f0c890',
  skinDk:    '#c08858',
  hair:      '#2a0e18',
  hairHi:    '#401828',
  robe:      '#3a1858',
  robeLt:    '#5a2878',
  robeDk:    '#220c38',
  robeMid:   '#4a2068',
  belt:      '#7040a8',
  beltHi:    '#9860c8',
  crystal:   '#c090f0',
  crystalHi: '#f0e0ff',
  staff:     '#5c3a1e',
  staffDk:   '#3e2410',
  eye:       '#2a0a0a',
}

export function drawNpc(ctx, x, y, phase) {
  x = Math.floor(x); y = Math.floor(y)

  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  // Staff (behind, right side)
  r(13, 1, 1, 14, C.staff)
  p(13, 4, C.staffDk); p(13, 8, C.staffDk); p(13, 12, C.staffDk)

  // Crystal orb — pulsing glow
  const glowA = 0.28 + Math.sin(phase * 1.4) * 0.22
  ctx.save()
  ctx.globalAlpha = glowA
  ctx.fillStyle = '#8850d8'
  ctx.beginPath(); ctx.arc(x + 13.5, y + 1, 5, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  p(12, 0, C.crystal); p(13, 0, C.crystal); p(14, 0, C.crystal)
  p(12, 1, C.crystal); p(13, 1, '#f0e8ff'); p(14, 1, C.crystal)
  p(13, 2, C.crystal)
  p(12, 0, C.crystalHi)

  // Hair peeking from hood sides
  p(4, 2, C.hair); p(4, 3, C.hairHi)
  p(11, 2, C.hair); p(11, 3, C.hairHi)
  r(6, 0, 4, 1, C.hair)

  // Hood (6px wide)
  r(5, 0, 6, 3, C.robeDk)
  r(4, 1, 8, 2, C.robeDk)
  r(5, 0, 6, 1, '#160830')
  // Hood side shadows framing face
  p(5, 3, C.robeDk); p(5, 4, C.robeDk)
  p(10, 3, C.robeDk); p(10, 4, C.robeDk)
  // Hood glint
  p(5, 1, C.robeMid); p(10, 1, C.robeMid)

  // Face (4px wide, centred)
  r(6, 2, 4, 4, C.skin)
  p(5, 3, C.skin); p(10, 3, C.skin)  // cheek width
  p(7, 5, C.skinDk)  // nose
  // Eyebrows
  ctx.fillStyle = '#5a3020'
  ctx.fillRect(x+6, y+2, 2, 1); ctx.fillRect(x+8, y+2, 2, 1)
  // Eyes
  p(6, 3, C.eye); p(9, 3, C.eye)
  p(7, 4, '#9a7860')

  // Shoulders (slightly wider than body)
  r(4, 5, 8, 2, C.robeLt)
  p(4, 5, C.robeMid); p(11, 5, C.robeMid)  // shoulder shadow

  // Slim body — 6px wide
  r(5, 6, 6, 6, C.robe)
  r(5, 6, 1, 6, C.robeLt)   // left lit edge
  p(8, 7, C.robeDk); r(8, 8, 1, 3, C.robeDk)  // off-centre fold

  // Belt
  r(5, 9, 6, 1, C.belt)
  p(7, 9, C.beltHi)

  // Arms — thin (2px)
  r(3, 6, 2, 5, C.robe)
  r(3, 10, 2, 1, C.robeDk)   // cuff
  r(11, 6, 2, 5, C.robe)
  p(12, 10, C.staffDk)        // hand gripping staff

  // Hem — robe flares elegantly downward
  r(5, 12, 6, 1, C.robe)      // body continues
  r(4, 13, 8, 1, C.robe)      // slight flare
  r(3, 14, 10, 1, C.robeDk)   // hem shadow line
  p(3, 13, C.robeLt); p(12, 13, C.robeLt)  // hem corner glints
}
