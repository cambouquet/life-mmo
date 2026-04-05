// Divination console: black-glass slab, chrome trim, holographic orb
// Tiles (9,2)+(10,2) — pixel origin x=144, y=32

const TX = 144, TY = 32

export function drawTable(ctx, phase) {
  const b = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(TX+ox, TY+oy, w, h) }
  const p = (ox, oy, c)        => { ctx.fillStyle = c; ctx.fillRect(TX+ox, TY+oy, 1, 1) }

  // Underside glow
  const slabGlow = 0.18 + Math.sin(phase * 0.9) * 0.10
  ctx.save()
  ctx.globalAlpha = slabGlow
  const ug = ctx.createRadialGradient(TX+16, TY+14, 0, TX+16, TY+14, 22)
  ug.addColorStop(0,   'rgba(130,40,255,1)')
  ug.addColorStop(0.5, 'rgba(80,10,180,0.5)')
  ug.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = ug
  ctx.fillRect(TX-6, TY+4, 44, 28)
  ctx.restore()

  // Glass slab body
  b(0,  6, 32, 8, '#0a0812')
  b(0,  6, 32, 1, '#2a2040')     // top edge
  b(0, 13, 32, 1, '#0e0c1c')     // bottom edge
  b(1,  7, 30, 1, '#181228')     // inner sheen
  b(6,  7,  8, 1, '#1e1838')     // reflection streak A
  b(18, 7,  6, 1, '#1a1430')     // reflection streak B

  // Chrome side rails
  b(0,  6,  1, 8, '#484060')
  b(31, 6,  1, 8, '#484060')
  p(0,  6, '#8878a8');  p(31,  6, '#8878a8')
  p(0, 13, '#585078');  p(31, 13, '#585078')

  // Stand legs
  b(10, 14, 2, 2, '#1e1830')
  b(20, 14, 2, 2, '#1e1830')
  b( 9, 15, 4, 1, '#2a2440')
  b(19, 15, 4, 1, '#2a2440')

  // Holographic orb
  const cx = TX + 16, cy = TY + 9
  const pulse = 0.80 + Math.sin(phase * 1.3) * 0.20

  // Bloom glow
  ctx.save()
  ctx.globalAlpha = 0.22 * pulse
  const hg = ctx.createRadialGradient(cx, cy, 2, cx, cy, 14)
  hg.addColorStop(0,   'rgba(200,100,255,1)')
  hg.addColorStop(0.5, 'rgba(100,30,220,0.6)')
  hg.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = hg
  ctx.fillRect(cx-14, cy-14, 28, 28)
  ctx.restore()

  // Pixel sphere
  const ob = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(cx+ox, cy+oy, w, h) }
  const op = (ox, oy, c)        => { ctx.fillStyle = c; ctx.fillRect(cx+ox, cy+oy, 1, 1) }
  ob(-2,-4, 4,1,'#200840')
  ob(-3,-3, 6,1,'#30106a')
  ob(-4,-2, 8,1,'#401880')
  ob(-4,-1, 8,5,'#502090')
  ob(-4, 4, 8,1,'#3a1878')
  ob(-3, 5, 6,1,'#2a0e5a')
  ob(-2, 6, 4,1,'#1a0840')
  ob(-2, 0, 4,3,'#7838c0')
  ob(-1,-1, 2,1,'#9050d8')
  op(-2,-2,'#f0d8ff'); ob(-3,-1, 2,1,'#d8b8ff'); op(-2,-1,'#e8c8ff')
  op(-1,-3,'#ffffff')
  // Animated scan-line
  const sl = Math.floor((Math.sin(phase * 2.1) * 0.5 + 0.5) * 6) - 3
  ob(-3, sl, 6,1,'rgba(200,160,255,0.35)')

  // Projector ring on slab
  ob(-5, 7, 10,1,'#2a1850')
  ob(-4, 8,  8,1,'#1e1040')
  ctx.fillStyle = '#6040a0'
  ctx.fillRect(cx-5, cy+7, 1, 1)
  ctx.fillRect(cx+4, cy+7, 1, 1)
}
