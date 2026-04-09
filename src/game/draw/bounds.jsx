const GLOW          = 6    // base glow width (px)
const PROX_RADIUS   = 80   // distance at which proximity effect starts (px)
const PROX_GLOW     = 40   // extra glow width at full proximity

export function drawBoundsOfLight(ctx, w, h, phase, px, py) {
  // Normalised proximity [0..1] for each wall
  const distTop    = py
  const distBottom = h - py
  const distLeft   = px
  const distRight  = w - px

  function prox(dist) {
    return Math.max(0, 1 - dist / PROX_RADIUS)
  }

  const pTop    = prox(distTop)
  const pBottom = prox(distBottom)
  const pLeft   = prox(distLeft)
  const pRight  = prox(distRight)

  function band(x, y, bw, bh, g0x, g0y, g1x, g1y, p) {
    const glowW  = GLOW + PROX_GLOW * p
    const bright = 0.18 + 0.82 * p
    const g = ctx.createLinearGradient(g0x, g0y, g1x, g1y)
    g.addColorStop(0,   `rgba(180, 230, 255, ${(bright * 0.9).toFixed(3)})`)
    g.addColorStop(Math.min(0.99, GLOW / glowW * 0.6), `rgba(100, 170, 255, ${(bright * 0.35).toFixed(3)})`)
    g.addColorStop(1,   'rgba(60, 120, 255, 0)')
    ctx.fillStyle = g
    // Adjust rect to match extended glow width
    if (g1y > g0y) ctx.fillRect(x, y, bw, glowW)          // top
    else if (g1y < g0y) ctx.fillRect(x, h - glowW, bw, glowW) // bottom
    else if (g1x > g0x) ctx.fillRect(x, y, glowW, bh)     // left
    else ctx.fillRect(w - glowW, y, glowW, bh)             // right
  }

  ctx.save()

  // Base + proximity bands
  band(0, 0,        w, GLOW,  0, 0,   0, GLOW,   pTop)
  band(0, h - GLOW, w, GLOW,  0, h,   0, h-GLOW, pBottom)
  band(0, 0,        GLOW, h,  0, 0,   GLOW, 0,   pLeft)
  band(w - GLOW, 0, GLOW, h,  w, 0,   w-GLOW, 0, pRight)

  // Radial burst at the closest point on each wall when near
  function burst(cx, cy, p) {
    if (p < 0.05) return
    const r = 18 + 40 * p
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    g.addColorStop(0,   `rgba(220, 245, 255, ${(p * 0.7).toFixed(3)})`)
    g.addColorStop(0.4, `rgba(120, 190, 255, ${(p * 0.3).toFixed(3)})`)
    g.addColorStop(1,   'rgba(60, 120, 255, 0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
  }

  burst(px, 0,   pTop)
  burst(px, h,   pBottom)
  burst(0,  py,  pLeft)
  burst(w,  py,  pRight)

  ctx.restore()
}
