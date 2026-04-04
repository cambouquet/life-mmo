import { PAL, TORCHES } from './constants.js'

// ── Draw helpers ──────────────────────────────────────────────────────────────
function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

function pixel(ctx, x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

// ── Floor tile ────────────────────────────────────────────────────────────────
export function drawFloor(ctx, c, r) {
  const x = c * 16, y = r * 16
  const color = (c + r) % 2 === 0 ? PAL.floorA : PAL.floorB
  rect(ctx, x, y, 16, 16, color)
  ctx.fillStyle = '#00000018'
  ctx.fillRect(x, y, 16, 1)
  ctx.fillRect(x, y, 1, 16)
}

// ── Wall tile ─────────────────────────────────────────────────────────────────
export function drawWall(ctx, c, r) {
  const x = c * 16, y = r * 16
  rect(ctx, x, y, 16, 16, PAL.wall)
  rect(ctx, x, y, 16, 3, PAL.wallTop)
  ctx.fillStyle = '#ffffff06'
  ctx.fillRect(x + 3,  y + 5,  4, 3)
  ctx.fillRect(x + 9,  y + 9,  5, 3)
  ctx.fillRect(x + 2,  y + 11, 3, 2)
}

// ── Door gap ──────────────────────────────────────────────────────────────────
export function drawDoor(ctx, c, r) {
  const x = c * 16, y = r * 16
  rect(ctx, x, y, 16, 16, '#080610')
  rect(ctx, x, y, 1, 16, PAL.wood)
  rect(ctx, x + 15, y, 1, 16, PAL.wood)
  rect(ctx, x, y, 16, 2, PAL.wood)
}

// ── Rug ───────────────────────────────────────────────────────────────────────
export function drawRug(ctx) {
  const rx = 5 * 16, ry = 3 * 16
  const rw = 10 * 16, rh = 8 * 16
  rect(ctx, rx, ry, rw, rh, PAL.rug)
  ctx.strokeStyle = PAL.rugBord
  ctx.lineWidth = 1
  ctx.strokeRect(rx + 1, ry + 1, rw - 2, rh - 2)
  ctx.strokeRect(rx + 3, ry + 3, rw - 6, rh - 6)
  ctx.strokeStyle = PAL.rugInner
  const cx = rx + rw / 2, cy = ry + rh / 2
  const s  = 28
  ctx.beginPath()
  ctx.moveTo(cx,     cy - s)
  ctx.lineTo(cx + s, cy)
  ctx.lineTo(cx,     cy + s)
  ctx.lineTo(cx - s, cy)
  ctx.closePath()
  ctx.stroke()
  for (const [ox, oy] of [[5,5],[rw-6,5],[5,rh-6],[rw-6,rh-6]]) {
    rect(ctx, rx + ox, ry + oy, 2, 2, PAL.rugBord)
  }
}

// ── Torch ─────────────────────────────────────────────────────────────────────
export function drawTorch(ctx, c, r, phase) {
  const x = c * 16 + 8
  const y = r * 16 + 8
  const flicker = Math.sin(phase) * 0.3 + 0.7

  const grd = ctx.createRadialGradient(x, y, 1, x, y, 48)
  grd.addColorStop(0,   `rgba(255,180,48,${0.18 * flicker})`)
  grd.addColorStop(0.4, `rgba(255,120,20,${0.08 * flicker})`)
  grd.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = grd
  ctx.fillRect(x - 48, y - 48, 96, 96)

  rect(ctx, x - 1, y - 2, 3, 5, PAL.metal)
  rect(ctx, x - 1, y - 5, 3, 4, PAL.torch)
  pixel(ctx, x, y - 6, '#fff5c0')
  pixel(ctx, x - 1, y - 5, '#ffcc44')
  pixel(ctx, x + 1, y - 5, '#ffcc44')
  if (flicker > 0.8) pixel(ctx, x, y - 7, '#ffffff88')
}

// ── Shadow ellipse ────────────────────────────────────────────────────────────
export function drawShadow(ctx, x, y) {
  ctx.save()
  ctx.globalAlpha = 0.35
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.ellipse(Math.floor(x) + 8, Math.floor(y) + 15, 5, 2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}
