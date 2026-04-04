import { PAL } from '../palette.jsx'

const r_ = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h) }

export function drawFloor(ctx, c, row) {
  const x = c * 16, y = row * 16
  r_(ctx, x, y, 16, 16, (c + row) % 2 === 0 ? PAL.floorA : PAL.floorB)
  ctx.fillStyle = '#00000018'
  ctx.fillRect(x, y, 16, 1)
  ctx.fillRect(x, y, 1, 16)
}

export function drawWall(ctx, c, row) {
  const x = c * 16, y = row * 16
  r_(ctx, x, y, 16, 16, PAL.wall)
  r_(ctx, x, y, 16, 3,  PAL.wallTop)
  ctx.fillStyle = '#ffffff06'
  ctx.fillRect(x + 3,  y + 5,  4, 3)
  ctx.fillRect(x + 9,  y + 9,  5, 3)
  ctx.fillRect(x + 2,  y + 11, 3, 2)
}

export function drawDoor(ctx, c, row) {
  const x = c * 16, y = row * 16
  r_(ctx, x,      y,  1,  16, PAL.wood)
  r_(ctx, x + 15, y,  1,  16, PAL.wood)
  r_(ctx, x,      y,  16,  2, PAL.wood)
  r_(ctx, x,      y,  16, 16, '#080610')
  r_(ctx, x,      y,  1,  16, PAL.wood)
  r_(ctx, x + 15, y,  1,  16, PAL.wood)
  r_(ctx, x,      y,  16,  2, PAL.wood)
}

export function drawRug(ctx) {
  const rx = 80, ry = 48, rw = 160, rh = 128
  r_(ctx, rx, ry, rw, rh, PAL.rug)
  ctx.strokeStyle = PAL.rugBord; ctx.lineWidth = 1
  ctx.strokeRect(rx + 1, ry + 1, rw - 2, rh - 2)
  ctx.strokeRect(rx + 3, ry + 3, rw - 6, rh - 6)
  ctx.strokeStyle = PAL.rugInner
  const cx = rx + rw / 2, cy = ry + rh / 2, s = 28
  ctx.beginPath()
  ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s, cy)
  ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s, cy)
  ctx.closePath(); ctx.stroke()
  for (const [ox, oy] of [[5,5],[rw-6,5],[5,rh-6],[rw-6,rh-6]])
    r_(ctx, rx + ox, ry + oy, 2, 2, PAL.rugBord)
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
