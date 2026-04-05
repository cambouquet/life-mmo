import { PAL } from '../palette.jsx'

export function drawTorch(ctx, c, row, phase, on = true) {
  const x = c * 16 + 8
  const y = row * 16 + 8

  const r_ = (ox, oy, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x + ox, y + oy, w, h) }
  const p_ = (ox, oy, col)        => { ctx.fillStyle = col; ctx.fillRect(x + ox, y + oy, 1, 1) }

  if (on) {
    const f1 = Math.sin(phase) * 0.28 + 0.72
    const f2 = Math.sin(phase * 1.9 + 1.1) * 0.18 + 0.82

    // Wide warm glow pool
    const grd = ctx.createRadialGradient(x, y - 4, 0, x, y - 4, 54)
    grd.addColorStop(0,    `rgba(255,160,40,${0.24 * f1})`)
    grd.addColorStop(0.3,  `rgba(255,100,15,${0.11 * f1})`)
    grd.addColorStop(0.65, `rgba(150,45,0,${0.04 * f1})`)
    grd.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.fillRect(x - 54, y - 58, 108, 108)

    // Wall backplate (iron)
    r_(-1, 0, 3, 6, '#484e5c')
    p_( 0, 1, '#686e7e')        // center highlight stripe
    // Sconce arm
    r_(-3, -2, 4, 1, PAL.metal)
    p_(-3, -1, '#6a7080')       // arm underside shadow
    // Cup holder
    r_(-1, -3, 3, 2, PAL.metal)
    p_( 0, -2, '#9aa8b4')       // cup highlight
    // Candle wax body
    r_(-1, -6, 2, 3, '#ede4c4')
    p_( 0, -6, '#f8f2dc')       // lighter face
    p_(-1, -5, '#c4b490')       // shadow side
    p_(-1, -4, '#d0c4a0')       // wax drip
    // Wick
    p_(0, -7, '#705840')

    // Flame — layered, warm centre cooler edges
    if (f2 > 0.84) p_(0, -11, '#ffffffbb')
    p_(0,  -10, f1 > 0.7 ? '#fff8a0' : '#ffea60')
    p_(-1,  -9, '#ffdd44'); p_(0, -9, '#fff098'); p_(1, -9, '#ffcc33')
    p_(-1,  -8, '#ffaa22'); p_(0, -8, '#ffdd55'); p_(1, -8, '#ff9900')
    p_(-1,  -7, '#ff6800'); p_(0, -7, '#ffab30'); p_(1, -7, '#ee4500')

  } else {
    // Unlit sconce
    r_(-1, 0,  3, 6, '#3a404e')
    r_(-3, -2, 4, 1, PAL.metal)
    r_(-1, -3, 3, 2, '#484e5c')
    r_(-1, -6, 2, 3, '#252018')  // charred wax
    p_(0,  -7, '#181410')        // dead wick
  }
}
