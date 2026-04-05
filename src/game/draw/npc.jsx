// Lyra — compact NPC sprite: 10px wide × 15px tall within 16x16 tile.
// Hair y=0-4 | Face y=2-5 | Coat y=5-13 | Hem y=14

const C = {
  skin:       '#f0c890',
  skinDk:     '#c08858',
  hair:       '#180828',
  hairHi:     '#3a1860',
  coat:       '#1c1840',
  coatLt:     '#2e2a5e',
  coatDk:     '#0e0c20',
  coatFold:   '#221e4a',
  collar:     '#2a1050',
  tattoo:     '#a040f0',
  tattooLt:   '#d090ff',
  crystal:    '#c090f0',
  crystalHi:  '#f0e0ff',
  chain:      '#b09860',
  eye:        '#200828',
}

export function drawNpc(ctx, x, y, phase) {
  x = Math.floor(x); y = Math.floor(y)
  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  // Hair (dark, side-swept, 10px wide)
  r( 3, 0, 10, 2, C.hair)
  r( 2, 1,  2, 4, C.hair)    // left sweep
  r(12, 1,  2, 4, C.hair)    // right fall
  p( 4, 0, C.hairHi); p( 9, 0, C.hairHi)

  // Face (6px wide, delicate — same width as player)
  r( 5, 2, 6, 4, C.skin)
  p( 6, 3, C.eye); p( 9, 3, C.eye)
  p( 8, 4, C.skinDk)
  p( 7, 5, C.skinDk); p( 8, 5, C.skinDk)

  // High coat collar
  r( 5, 5, 6, 2, C.collar)
  p( 5, 5, C.coatLt); p(10, 5, C.coatLt)

  // Coat body (covers legs entirely)
  r( 4, 6, 8, 8, C.coat)
  r( 4, 6, 1, 8, C.coatLt)   // left lit edge
  r( 9, 8, 1, 5, C.coatFold) // right vertical fold
  r( 5, 9, 1, 4, C.coatFold) // left inner fold

  // Sleeves
  r( 2, 6, 3, 6, C.coat)
  r(11, 6, 3, 6, C.coat)
  r( 2,11, 2, 1, C.coatDk)   // left cuff
  r(11,11, 2, 1, C.coatDk)   // right cuff

  // Forearm tattoo (left sleeve)
  p( 2, 9, C.tattoo); p( 3, 9, C.tattooLt)

  // Chest tattoo sigils (animated)
  const tw = 0.5 + Math.sin(phase * 1.6) * 0.5
  ctx.save(); ctx.globalAlpha = tw
  ctx.fillStyle = C.tattoo
  ctx.fillRect(x+6, y+7, 1, 1); ctx.fillRect(x+7, y+8, 1, 1); ctx.fillRect(x+6, y+9, 1, 1)
  ctx.fillRect(x+9, y+7, 1, 1); ctx.fillRect(x+8, y+8, 1, 1); ctx.fillRect(x+9, y+9, 1, 1)
  ctx.fillStyle = C.tattooLt
  ctx.fillRect(x+7, y+8, 2, 1)
  ctx.restore()

  // Crystal pendant glow (soft)
  const cp = 0.6 + Math.sin(phase * 2.1) * 0.4
  ctx.save(); ctx.globalAlpha = cp * 0.45
  ctx.fillStyle = '#9040e0'
  ctx.beginPath(); ctx.arc(x+8, y+9, 3, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // Chain + crystal gem
  p( 7, 7, C.chain); p( 8, 7, C.chain); p( 8, 8, C.chain)
  p( 7,10, C.crystal); p( 8, 9, C.crystalHi); p( 9,10, C.crystal)
  p( 8,10, C.crystalHi)

  // Coat hem (slight flare at bottom)
  r( 3,13, 10, 1, C.coat)
  r( 3,13, 10, 1, C.coatDk)
}
