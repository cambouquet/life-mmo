export function drawTable(ctx, phase, tx, ty) {
  const TX = tx, TY = ty
  const b = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(TX+ox, TY+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(TX+ox, TY+oy, 1, 1) }

  const slabGlow = 0.18 + Math.sin(phase * 0.9) * 0.10
  ctx.save()
  ctx.globalAlpha = slabGlow
  const ug = ctx.createRadialGradient(TX+16, TY+14, 0, TX+16, TY+14, 22)
  ug.addColorStop(0,   'rgba(80,40,255,1)')
  ug.addColorStop(0.5, 'rgba(40,10,220,0.5)')
  ug.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = ug
  ctx.fillRect(TX-6, TY+4, 44, 28)
  ctx.restore()

  b(0,  6, 32, 8, '#0a0812')
  b(0,  6, 32, 1, '#2a2040')
  b(0, 13, 32, 1, '#0e0c1c')
  b(1,  7, 30, 1, '#181228')
  b(6,  7,  8, 1, '#1e1838')
  b(18, 7,  6, 1, '#1a1430')

  b(0,  6, 1, 8, '#484060'); b(31, 6, 1, 8, '#484060')
  p(0,  6, '#8878a8'); p(31,  6, '#8878a8')
  p(0, 13, '#585078'); p(31, 13, '#585078')

  // Polished surface sheen — soft horizontal highlight like light reflecting off dark marble
  ctx.save()
  ctx.globalAlpha = 0.13
  const sg = ctx.createLinearGradient(TX, TY + 6, TX + 32, TY + 6)
  sg.addColorStop(0,   'rgba(0,0,0,0)')
  sg.addColorStop(0.5, 'rgba(160,140,255,1)')
  sg.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = sg
  ctx.fillRect(TX, TY + 7, 32, 2)
  ctx.restore()

  // Slim modern legs
  b(10, 14, 2, 3, '#141020'); b(20, 14, 2, 3, '#141020')
  b(10, 14, 1, 3, '#201a38'); b(20, 14, 1, 3, '#201a38') // light face
  b( 9, 16, 4, 1, '#1a1630'); b(19, 16, 4, 1, '#1a1630') // feet

  // Soft glow beneath the card spread
  ctx.save()
  ctx.globalAlpha = 0.18 + Math.sin(phase * 0.9) * 0.08
  const hg = ctx.createRadialGradient(TX+16, TY+9, 0, TX+16, TY+9, 16)
  hg.addColorStop(0, 'rgba(160,80,255,1)')
  hg.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = hg
  ctx.fillRect(TX+2, TY+5, 28, 10)
  ctx.restore()

  // Card shadows on the table surface
  ctx.save()
  ctx.globalAlpha = 0.35
  b(5, 12, 5, 1, '#000000')
  b(13, 12, 6, 1, '#000000')
  b(24, 12, 5, 1, '#000000')
  ctx.restore()

  // Left card — back side facing up
  b(4, 7, 5, 5, '#110920')         // border
  b(5, 8, 3, 3, '#3a1e68')         // card back body
  p(6, 9, '#6838a8')               // center gem

  // Center card — face up (cream face with symbol), slightly taller
  b(12, 6, 6, 6, '#110920')        // border
  b(13, 7, 4, 4, '#d0c0a0')        // cream face
  p(15, 8, '#9060c0')              // symbol — top
  p(14, 9, '#9060c0'); p(15, 9, '#9060c0'); p(16, 9, '#9060c0')  // symbol — row
  p(15,10, '#9060c0')              // symbol — bottom

  // Right card — back side facing up
  b(23, 7, 5, 5, '#110920')        // border
  b(24, 8, 3, 3, '#3a1e68')        // card back body
  p(25, 9, '#6838a8')              // center gem
}
