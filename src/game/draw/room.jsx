import { PAL } from '../palette.jsx'

const r_ = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h) }

export function drawFloor(ctx, c, row) {
  const x = c * 16, y = row * 16
  const isA = (c + row) % 2 === 0
  // Grout lines — top and left edges only (each tile provides its own border)
  ctx.fillStyle = PAL.floorGrout
  ctx.fillRect(x, y, 16, 1)
  ctx.fillRect(x, y, 1, 16)
  // Stone tile face
  r_(ctx, x+1, y+1, 15, 15, isA ? PAL.floorA : PAL.floorB)
  // Top-left edge highlight (light from upper-left)
  ctx.fillStyle = isA ? '#1e1838' : '#25204a'
  ctx.fillRect(x+1, y+1, 13, 1)
  ctx.fillRect(x+1, y+2, 1, 11)
}

export function drawWall(ctx, c, row) {
  const x = c * 16, y = row * 16
  // Deep shadow base
  r_(ctx, x, y, 16, 16, PAL.wall)
  // Stone front face
  r_(ctx, x, y+4, 16, 12, PAL.wallFace)
  // Brick rows
  r_(ctx, x+1, y+5,  14, 4, PAL.wallBrick)
  r_(ctx, x+1, y+10, 14, 5, PAL.wallBrick)
  // Mortar lines — lower vertical staggered for realistic brickwork
  ctx.fillStyle = PAL.wallMort
  ctx.fillRect(x,   y+4, 16, 1)   // top mortar
  ctx.fillRect(x,   y+9, 16, 1)   // mid horizontal mortar
  ctx.fillRect(x+8, y+5, 1,  4)   // upper vertical (center)
  ctx.fillRect(x+4, y+10,1,  5)   // lower vertical (staggered)
  // Subtle inner brick shadow (top edge of each brick row)
  ctx.fillStyle = PAL.wallMort
  ctx.fillRect(x+1, y+5,  14, 1)
  ctx.fillRect(x+1, y+10, 14, 1)
  // Lit top face
  r_(ctx, x, y, 16, 4, PAL.wallTop)
  ctx.fillStyle = '#6252b4'
  ctx.fillRect(x, y,   16, 1)   // bright highlight
  ctx.fillStyle = '#221850'
  ctx.fillRect(x, y+3, 16, 1)   // shadow at base of top face
}

export function drawDoor(ctx, c, row) {
  drawWall(ctx, c, row)
}

export function drawRug(ctx) {
  const rx = 80, ry = 48, rw = 160, rh = 128
  r_(ctx, rx, ry, rw, rh, PAL.rug)
  // Three nested borders
  ctx.strokeStyle = PAL.rugBord; ctx.lineWidth = 1
  ctx.strokeRect(rx + 1, ry + 1, rw - 2,  rh - 2)
  ctx.strokeRect(rx + 4, ry + 4, rw - 8,  rh - 8)
  ctx.strokeRect(rx + 7, ry + 7, rw - 14, rh - 14)
  // Central diamond
  ctx.strokeStyle = PAL.rugInner
  const cx = rx + rw / 2, cy = ry + rh / 2, s = 28
  ctx.beginPath()
  ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s, cy)
  ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s, cy)
  ctx.closePath(); ctx.stroke()
  // Corner accents at innermost border
  for (const [ox, oy] of [[8,8],[rw-10,8],[8,rh-10],[rw-10,rh-10]])
    r_(ctx, rx + ox, ry + oy, 3, 3, PAL.rugBord)
}

export function drawShadow(ctx, x, y, jumpFactor = 0) {
  ctx.save()
  ctx.globalAlpha = 0.35 * (1 - jumpFactor * 0.7)
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.ellipse(
    Math.floor(x) + 8, Math.floor(y) + 15,
    Math.max(1, 5 * (1 - jumpFactor * 0.5)),
    Math.max(0.5, 2 * (1 - jumpFactor * 0.5)),
    0, 0, Math.PI * 2
  )
  ctx.fill()
  ctx.restore()
}
