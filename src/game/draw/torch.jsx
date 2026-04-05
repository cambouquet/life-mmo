import { PAL } from '../palette.jsx'

export function drawTorch(ctx, c, row, phase, on = true) {
  const x = c * 16 + 8
  const y = row * 16 + 8

  const r_ = (ox, oy, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x + ox, y + oy, w, h) }
  const p_ = (ox, oy, col)        => { ctx.fillStyle = col; ctx.fillRect(x + ox, y + oy, 1, 1) }

  if (on) {
    const f1 = Math.sin(phase) * 0.28 + 0.72
    const f2 = Math.sin(phase * 1.9 + 1.1) * 0.18 + 0.82

    // Wide arcane glow pool (neon purple)
    const grd = ctx.createRadialGradient(x, y - 4, 0, x, y - 4, 54)
    grd.addColorStop(0,    `rgba(160,60,255,${0.28 * f1})`)
    grd.addColorStop(0.3,  `rgba(100,20,220,${0.12 * f1})`)
    grd.addColorStop(0.65, `rgba(50,0,120,${0.05 * f1})`)
    grd.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.fillRect(x - 54, y - 58, 108, 108)

    // Wall backplate (dark metal)
    r_(-1, 0, 3, 6, '#28243c')
    p_( 0, 1, '#3c3858')        // highlight stripe
    // Sconce arm
    r_(-3, -2, 4, 1, PAL.metal)
    p_(-3, -1, '#484460')       // arm shadow
    // Cup / mount
    r_(-1, -3, 3, 2, PAL.metal)
    p_( 0, -2, '#7070a0')       // cup highlight
    // Crystal tube body (replaces candle)
    r_(-1, -7, 2, 4, '#1a0830')
    p_( 0, -7, '#3a2060')       // tube face
    p_(-1, -6, '#0e0418')       // shadow side

    // Arcane flame — blue-violet core, white tip
    if (f2 > 0.84) p_(0, -11, '#ffffff')
    p_(0,  -10, f1 > 0.7 ? '#e0c0ff' : '#c080ff')
    p_(-1,  -9, '#a040e0'); p_(0, -9, '#d090ff'); p_(1, -9, '#8820d0')
    p_(-1,  -8, '#7020b0'); p_(0, -8, '#b060f0'); p_(1, -8, '#6010a0')
    p_(-1,  -7, '#401080'); p_(0, -7, '#8040c0'); p_(1, -7, '#300870')

  } else {
    // Unlit mount
    r_(-1, 0,  3, 6, '#1c1828')
    r_(-3, -2, 4, 1, PAL.metal)
    r_(-1, -3, 3, 2, '#28243c')
    r_(-1, -7, 2, 4, '#100818')  // dead crystal tube
    p_(0,  -7, '#0c0614')        // dark
  }
}
