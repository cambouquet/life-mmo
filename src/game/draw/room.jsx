import { PAL } from '../palette.jsx'

const r_ = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h) }

export function drawFloor(ctx, c, row) {
  const x = c * 16, y = row * 16
  const isA = (c + row) % 2 === 0
  // Grout seams
  ctx.fillStyle = PAL.floorGrout
  ctx.fillRect(x, y, 16, 1)
  ctx.fillRect(x, y, 1, 16)
  // Polished concrete face
  r_(ctx, x+1, y+1, 15, 15, isA ? PAL.floorA : PAL.floorB)
  // Faint arcane vein — diagonal crack with subtle glow on A tiles
  if (isA) {
    ctx.fillStyle = '#1e1240'
    ctx.fillRect(x+3,  y+3,  1, 1)
    ctx.fillRect(x+5,  y+5,  2, 1)
    ctx.fillRect(x+8,  y+8,  2, 1)
    ctx.fillRect(x+11, y+11, 1, 1)
  }
  // Specular sheen (top-left highlight)
  ctx.fillStyle = isA ? '#1a1428' : '#141020'
  ctx.fillRect(x+1, y+1, 12, 1)
  ctx.fillRect(x+1, y+2, 1, 10)
}

export function drawWall(ctx, c, row) {
  const x = c * 16, y = row * 16
  // Deep shadow base
  r_(ctx, x, y, 16, 16, PAL.wall)
  // Concrete panel face (no brick — smooth urban)
  r_(ctx, x, y+4, 16, 12, PAL.wallFace)
  // Panel seam lines (industrial concrete joints)
  ctx.fillStyle = PAL.wallMort
  ctx.fillRect(x,   y+4,  16, 1)   // top seam
  ctx.fillRect(x+8, y+5,   1, 11)  // vertical centre joint
  ctx.fillRect(x,   y+10, 16, 1)   // mid horizontal joint
  // Subtle panel depth shadow (top of lower panel)
  ctx.fillStyle = PAL.wallBrick
  ctx.fillRect(x+1, y+5,  7, 4)
  ctx.fillRect(x+9, y+11, 7, 4)
  // Arcane rune glow strip on the top cap underside
  r_(ctx, x, y+3, 16, 1, PAL.wallGlow)
  // Top cap
  r_(ctx, x, y, 16, 4, PAL.wallTop)
  ctx.fillStyle = '#2a2048'
  ctx.fillRect(x, y,   16, 1)   // top edge
  ctx.fillStyle = '#0e0c1c'
  ctx.fillRect(x, y+3, 16, 1)   // shadow at base of cap
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
