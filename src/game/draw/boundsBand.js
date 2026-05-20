import { GLOW, PROX_GLOW } from './boundsConstants.js'

export function drawBand(ctx, bx, by, bw, bh, g0x, g0y, g1x, g1y, p, rx, ry, rw, rh) {
  const glowW = GLOW + PROX_GLOW * p
  const bright = 0.18 + 0.82 * p
  const g = ctx.createLinearGradient(g0x, g0y, g1x, g1y)
  g.addColorStop(0,   `rgba(180, 230, 255, ${(bright * 0.9).toFixed(3)})`)
  g.addColorStop(Math.min(0.99, GLOW / glowW * 0.6), `rgba(100, 170, 255, ${(bright * 0.35).toFixed(3)})`)
  g.addColorStop(1,   'rgba(60, 120, 255, 0)')
  ctx.fillStyle = g
  if (g1y > g0y)      ctx.fillRect(bx, by,              bw, glowW)
  else if (g1y < g0y) ctx.fillRect(bx, ry + rh - glowW, bw, glowW)
  else if (g1x > g0x) ctx.fillRect(bx, by,              glowW, bh)
  else                ctx.fillRect(rx + rw - glowW, by,  glowW, bh)
}
