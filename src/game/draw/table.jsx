import { PAL } from '../palette.jsx'

// Table occupies tiles (9, 2) and (10, 2) — left pixel edge at x=144, y=32
const TX = 144, TY = 32

export function drawTable(ctx, phase) {
  // Cloth surface
  ctx.fillStyle = '#1a0d38'; ctx.fillRect(TX,      TY,      32, 13)
  ctx.fillStyle = '#2a1a50'; ctx.fillRect(TX,      TY,      32,  1)
  ctx.fillStyle = '#2a1560'; ctx.fillRect(TX +  1, TY +  2, 30,  1)
  ctx.fillStyle = '#2a1560'; ctx.fillRect(TX +  1, TY + 11, 30,  1)
  ctx.fillStyle = '#4a2878'; ctx.fillRect(TX +  1, TY +  1,  1, 11)
  ctx.fillStyle = '#4a2878'; ctx.fillRect(TX + 30, TY +  1,  1, 11)

  // Star rune dots
  const dot = (ox, oy) => { ctx.fillStyle = '#3a2870'; ctx.fillRect(TX + ox, TY + oy, 1, 1) }
  dot(5,6); dot(6,5); dot(4,5); dot(5,7)
  dot(26,6); dot(27,5); dot(25,5); dot(26,7)

  // Wood front edge
  ctx.fillStyle = PAL.wood;     ctx.fillRect(TX, TY + 13, 32, 1)
  ctx.fillStyle = PAL.woodDark; ctx.fillRect(TX, TY + 14, 32, 2)

  // Orb glow (pulsing)
  const cx = TX + 16, cy = TY + 6
  const pulse = Math.sin(phase * 1.1) * 0.2 + 0.8
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 9)
  grd.addColorStop(0,    `rgba(160,100,255,${0.55 * pulse})`)
  grd.addColorStop(0.55, `rgba(100, 50,200,${0.22 * pulse})`)
  grd.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = grd; ctx.fillRect(cx - 9, cy - 9, 18, 18)

  // Orb body
  const b = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(cx + ox, cy + oy, w, h) }
  const p = (ox, oy, c)        => { ctx.fillStyle = c; ctx.fillRect(cx + ox, cy + oy, 1, 1) }
  b(-2,-4, 4,1,'#7040a8'); b(-3,-3, 6,1,'#7848b8')
  b(-3,-2, 6,4,'#9060d0'); b(-3, 2, 6,1,'#7848b8'); b(-2, 3, 4,1,'#7040a8')
  p(-1,-2,'#e0c8ff'); b(-2,-1, 2,1,'#c8a8ff'); b(1,1, 2,1,'#6030a0')

  // Gold pedestal
  b(-1,4,2,2,'#c8901a'); b(-2,5,4,1,'#a07012'); b(-2,6,4,1,'#c8901a')
}
