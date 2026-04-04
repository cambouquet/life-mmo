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

// ── Divination table (tiles 9–10, row 2) ─────────────────────────────────────
export function drawTable(ctx, phase) {
  const tx = 9 * 16   // 144
  const ty = 2 * 16   // 32

  // Cloth surface (dark mystical purple)
  ctx.fillStyle = '#1a0d38'; ctx.fillRect(tx,    ty,    32, 13)
  ctx.fillStyle = '#2a1a50'; ctx.fillRect(tx,    ty,    32,  1) // top edge highlight
  // Decorative trim lines on cloth
  ctx.fillStyle = '#2a1560'; ctx.fillRect(tx + 1, ty + 2,  30, 1)
  ctx.fillStyle = '#2a1560'; ctx.fillRect(tx + 1, ty + 11, 30, 1)
  // Left/right cloth borders
  ctx.fillStyle = '#4a2878'; ctx.fillRect(tx + 1,  ty + 1, 1, 11)
  ctx.fillStyle = '#4a2878'; ctx.fillRect(tx + 30, ty + 1, 1, 11)
  // Small star rune decorations
  const dot = (ox, oy, c) => { ctx.fillStyle = c; ctx.fillRect(tx + ox, ty + oy, 1, 1) }
  dot(5, 6, '#3a2870'); dot(6, 5, '#3a2870'); dot(4, 5, '#3a2870'); dot(5, 7, '#3a2870')
  dot(26, 6, '#3a2870'); dot(27, 5, '#3a2870'); dot(25, 5, '#3a2870'); dot(26, 7, '#3a2870')
  // Wood front edge
  ctx.fillStyle = '#5c3a1e'; ctx.fillRect(tx, ty + 13, 32, 1)
  ctx.fillStyle = '#3d2510'; ctx.fillRect(tx, ty + 14, 32, 2)

  // Crystal orb glow (pulsing)
  const cx = tx + 16, cy = ty + 6
  const pulse = Math.sin(phase * 1.1) * 0.2 + 0.8
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 9)
  grd.addColorStop(0,    `rgba(160, 100, 255, ${0.55 * pulse})`)
  grd.addColorStop(0.55, `rgba(100,  50, 200, ${0.22 * pulse})`)
  grd.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = grd
  ctx.fillRect(cx - 9, cy - 9, 18, 18)

  // Crystal orb body (~4 px radius)
  ctx.fillStyle = '#7040a8'; ctx.fillRect(cx - 2, cy - 4, 4, 1)
  ctx.fillStyle = '#7848b8'; ctx.fillRect(cx - 3, cy - 3, 6, 1)
  ctx.fillStyle = '#9060d0'; ctx.fillRect(cx - 3, cy - 2, 6, 4)
  ctx.fillStyle = '#7848b8'; ctx.fillRect(cx - 3, cy + 2, 6, 1)
  ctx.fillStyle = '#7040a8'; ctx.fillRect(cx - 2, cy + 3, 4, 1)
  // Highlight
  ctx.fillStyle = '#e0c8ff'; ctx.fillRect(cx - 1, cy - 2, 1, 1)
  ctx.fillStyle = '#c8a8ff'; ctx.fillRect(cx - 2, cy - 1, 2, 1)
  ctx.fillStyle = '#6030a0'; ctx.fillRect(cx + 1, cy + 1, 2, 1)
  // Gold pedestal
  ctx.fillStyle = '#c8901a'; ctx.fillRect(cx - 1, cy + 4, 2, 2)
  ctx.fillStyle = '#a07012'; ctx.fillRect(cx - 2, cy + 5, 4, 1)
  ctx.fillStyle = '#c8901a'; ctx.fillRect(cx - 2, cy + 6, 4, 1)
}

export function drawShadow(ctx, x, y, jumpFactor = 0) {
  ctx.save()
  ctx.globalAlpha = 0.35 * (1 - jumpFactor * 0.7)
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  const rx = Math.max(1, 5 * (1 - jumpFactor * 0.5))
  const ry = Math.max(0.5, 2 * (1 - jumpFactor * 0.5))
  ctx.ellipse(Math.floor(x) + 8, Math.floor(y) + 15, rx, ry, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}
