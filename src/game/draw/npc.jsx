const C = {
  skin:      '#f5c9a0',
  skinDk:    '#c8956a',
  hair:      '#e8d090',   // warm blonde
  hairHi:    '#fff8d0',   // bright highlight
  hairDk:    '#b09858',   // shadow
  robe:      '#3820b8',   // vivid indigo robe
  robeLt:    '#5840e0',   // lit edge
  robeDk:    '#100840',   // deep fold
  robeFold:  '#2a1890',
  collar:    '#8030d8',
  crystal:   '#c090f0',
  crystalHi: '#f0e0ff',
  tattoo:    '#c040ff',
  tattooLt:  '#f090ff',
  eye:       '#2a0a40',
}

// 7px wide × 14px, centered in 16×16 tile at ox=x+4, oy=y+1
export function drawNpc(ctx, x, y, phase) {
  x = Math.floor(x); y = Math.floor(y)
  const ox = x + 4, oy = y + 1
  const r = (lx, ly, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(ox+lx, oy+ly, w, h) }
  const p = (lx, ly, c)       => { ctx.fillStyle = c; ctx.fillRect(ox+lx, oy+ly, 1, 1) }

  // ── Hair ──────────────────────────────────────────────────────────────────
  r(1, 0, 5, 1, C.hair)
  r(0, 1, 7, 1, C.hair)
  r(0, 2, 1, 4, C.hair)         // left hair sweep
  r(6, 2, 1, 4, C.hair)         // right hair sweep
  p(2, 0, C.hairHi); p(4, 0, C.hairHi)
  p(0, 3, C.hairDk); p(6, 3, C.hairDk)

  // ── Face ──────────────────────────────────────────────────────────────────
  r(1, 2, 5, 3, C.skin)
  p(1, 3, C.skinDk); p(5, 3, C.skinDk)   // cheek shadows
  p(2, 2, C.eye);    p(4, 2, C.eye)       // eyes
  p(3, 3, C.skinDk)                       // nose
  p(2, 4, C.skinDk); p(3, 4, C.skinDk)   // subtle mouth

  // ── Neck ──────────────────────────────────────────────────────────────────
  r(2, 5, 3, 1, C.skin)

  // ── Collar ────────────────────────────────────────────────────────────────
  r(1, 6, 5, 1, C.collar)
  p(0, 6, C.robeLt); p(6, 6, C.robeLt)

  // ── Robe body (full height to row 13, tapers slightly) ────────────────────
  r(0, 7, 7, 6, C.robe)
  r(0, 7, 1, 6, C.robeLt)        // left rim light
  r(6, 7, 1, 6, C.robeDk)        // right shadow
  r(3, 7, 1, 5, C.robeFold)      // centre fold
  r(1, 7, 5, 1, C.robeLt)        // shoulder highlight

  // ── Crystal pendant ───────────────────────────────────────────────────────
  p(3, 8, C.crystalHi); p(3, 9, C.crystal); p(3,10, C.crystal)
  const cp = 0.5 + Math.sin(phase * 2.1) * 0.5
  ctx.save(); ctx.globalAlpha = cp * 0.55
  ctx.fillStyle = '#9040e0'
  ctx.beginPath(); ctx.arc(ox + 3, oy + 9, 2.5, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // ── Tattoo (animated) ─────────────────────────────────────────────────────
  const tw = 0.3 + Math.sin(phase * 1.6) * 0.3
  ctx.save(); ctx.globalAlpha = tw
  p(1, 9, C.tattoo); p(5, 9, C.tattoo)
  p(2, 8, C.tattooLt); p(4, 8, C.tattooLt)
  ctx.restore()

  // ── Robe hem / feet ───────────────────────────────────────────────────────
  r(0,13, 7, 1, C.robeDk)
  p(0,13, C.robeFold); p(6,13, C.robeFold)
}
