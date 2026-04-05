import { PAL } from '../palette.jsx'

// Table occupies tiles (9, 2) and (10, 2) — left pixel edge at x=144, y=32
const TX = 144, TY = 32

export function drawTable(ctx, phase) {
  const b = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(TX+ox, TY+oy, w, h) }
  const p = (ox, oy, c)        => { ctx.fillStyle = c; ctx.fillRect(TX+ox, TY+oy, 1, 1) }

  // === Velvet cloth ===
  b(0,  0, 32, 14, '#180d38')
  b(0,  0, 32,  1, '#2e1f5a')   // top highlight
  b(1,  1,  1, 12, '#3a2268')   // left embroidery
  b(30, 1,  1, 12, '#3a2268')   // right embroidery
  b(3,  1, 26,  1, '#22154e')   // inner top line
  b(3, 11, 26,  1, '#22154e')   // inner bottom line
  b(3,  4, 26,  1, '#1e1248')   // mid cloth crease

  // Rune — left cross
  p(5, 4, '#3e2a72'); p(4, 5, '#3e2a72'); p(5, 5, '#5540a0'); p(6, 5, '#3e2a72'); p(5, 6, '#3e2a72')
  // Rune — right cross
  p(26,4, '#3e2a72'); p(25,5, '#3e2a72'); p(26,5, '#5540a0'); p(27,5, '#3e2a72'); p(26,6, '#3e2a72')

  // === Wood front face ===
  b(0, 13, 32, 1, '#8a5c32')    // top wood highlight
  b(0, 14, 32, 1, PAL.wood)
  b(0, 15, 32, 1, PAL.woodDark)
  p(0, 13, '#a07040'); p(31, 13, '#a07040')  // corner chamfer

  // === Crystal orb ===
  const cx = TX + 16, cy = TY + 6
  const pulse = Math.sin(phase * 1.1) * 0.18 + 0.82

  // Glow
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12)
  grd.addColorStop(0,    `rgba(190,120,255,${0.68 * pulse})`)
  grd.addColorStop(0.45, `rgba(110,55,220,${0.28 * pulse})`)
  grd.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = grd
  ctx.fillRect(cx - 12, cy - 12, 24, 24)

  // Sphere body (layered from top to bottom)
  const ob = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(cx+ox, cy+oy, w, h) }
  const op = (ox, oy, c)        => { ctx.fillStyle = c; ctx.fillRect(cx+ox, cy+oy, 1, 1) }
  ob(-2,-5, 4,1,'#583090')
  ob(-3,-4, 6,1,'#6840a8')
  ob(-4,-3, 8,1,'#7850b8')
  ob(-4,-2, 8,5,'#8860c8')
  ob(-4, 3, 8,1,'#7040b0')
  ob(-3, 4, 6,1,'#5c3098')
  ob(-2, 5, 4,1,'#482480')
  // Right-side depth shadow
  ob( 2,-2, 2,5,'#503090')
  // Highlights — main top-left
  op(-2,-3,'#f0e0ff'); ob(-3,-2, 2,1,'#d8c0ff'); op(-2,-2,'#e8d0ff')
  // Secondary small highlight
  op(-1,-4,'#fff0ff')
  // Inner colour tinge
  ob(-1, 0, 2,2,'#9870d8')

  // === Pedestal ===
  ob(-1, 6, 2,1,'#d8a828')
  ob(-2, 7, 4,1,'#b88820')
  ob(-3, 8, 6,1,'#c89c28')
  ob(-3, 9, 6,1,'#907008')
  op(-3, 8,'#e0b838'); op(2, 8,'#e0b838')  // rim glints
}
