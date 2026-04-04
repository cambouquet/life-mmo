import { PAL } from '../palette.jsx'

export function drawTorch(ctx, c, row, phase, on = true) {
  const x = c * 16 + 8
  const y = row * 16 + 8

  const r_ = (ox, oy, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x + ox, y + oy, w, h) }
  const p_ = (ox, oy, col)        => { ctx.fillStyle = col; ctx.fillRect(x + ox, y + oy, 1, 1) }

  if (on) {
    const flicker = Math.sin(phase) * 0.3 + 0.7
    const grd = ctx.createRadialGradient(x, y, 1, x, y, 48)
    grd.addColorStop(0,   `rgba(255,180,48,${0.18 * flicker})`)
    grd.addColorStop(0.4, `rgba(255,120,20,${0.08 * flicker})`)
    grd.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.fillRect(x - 48, y - 48, 96, 96)

    r_(-1, -2, 3, 5, PAL.metal)
    r_(-1, -5, 3, 4, PAL.torch)
    p_(0,  -6, '#fff5c0')
    p_(-1, -5, '#ffcc44'); p_(1, -5, '#ffcc44')
    if (flicker > 0.8) p_(0, -7, '#ffffff88')
  } else {
    // Unlit sconce — just the metal bracket, no flame
    r_(-1, -2, 3, 5, PAL.metal)
    r_(-1, -5, 3, 3, '#2a2a2a')   // charred stub
    p_(0,  -5, '#444444')
  }
}
