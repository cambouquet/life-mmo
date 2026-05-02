const GLOW        = 6
const PROX_RADIUS = 80
const PROX_GLOW   = 40

// Draw glowing walls for a single room rect { x, y, w, h }
// Only draws proximity effects when the player is actually inside this room.
function drawRoomBounds(ctx, rx, ry, rw, rh, pcx, pcy, phase) {
  const insideRoom = pcx >= rx && pcx <= rx + rw && pcy >= ry && pcy <= ry + rh

  const distTop    = pcy - ry
  const distBottom = (ry + rh) - pcy
  const distLeft   = pcx - rx
  const distRight  = (rx + rw) - pcx

  function prox(dist) {
    if (!insideRoom) return 0
    return Math.max(0, 1 - dist / PROX_RADIUS)
  }

  const pTop    = prox(distTop)
  const pBottom = prox(distBottom)
  const pLeft   = prox(distLeft)
  const pRight  = prox(distRight)

  function band(bx, by, bw, bh, g0x, g0y, g1x, g1y, p) {
    const glowW  = GLOW + PROX_GLOW * p
    const bright = 0.18 + 0.82 * p
    const g = ctx.createLinearGradient(g0x, g0y, g1x, g1y)
    g.addColorStop(0,   `rgba(180, 230, 255, ${(bright * 0.9).toFixed(3)})`)
    g.addColorStop(Math.min(0.99, GLOW / glowW * 0.6), `rgba(100, 170, 255, ${(bright * 0.35).toFixed(3)})`)
    g.addColorStop(1,   'rgba(60, 120, 255, 0)')
    ctx.fillStyle = g
    if (g1y > g0y)      ctx.fillRect(bx, by,              bw, glowW)   // top band
    else if (g1y < g0y) ctx.fillRect(bx, ry + rh - glowW, bw, glowW)  // bottom band
    else if (g1x > g0x) ctx.fillRect(bx, by,              glowW, bh)   // left band
    else                ctx.fillRect(rx + rw - glowW, by,  glowW, bh)  // right band
  }

  // Four wall bands
  band(rx, ry,        rw, GLOW,  rx, ry,      rx, ry+GLOW,  pTop)
  band(rx, ry+rh-GLOW, rw, GLOW,  rx, ry+rh,   rx, ry+rh-GLOW, pBottom)
  band(rx, ry,        GLOW, rh,  rx, ry,      rx+GLOW, ry, pLeft)
  band(rx+rw-GLOW, ry, GLOW, rh, rx+rw, ry,  rx+rw-GLOW, ry, pRight)

  // Radial burst at closest wall point
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

  burst(pcx, ry,      pTop)
  burst(pcx, ry + rh, pBottom)
  burst(rx,      pcy, pLeft)
  burst(rx + rw, pcy, pRight)
}

// rooms: array of { x, y, w, h } in world pixels
export function drawBoundsOfLight(ctx, rooms, phase, pcx, pcy) {
  ctx.save()
  for (const room of rooms) {
    drawRoomBounds(ctx, room.x, room.y, room.w, room.h, pcx, pcy, phase)
  }
  ctx.restore()
}
