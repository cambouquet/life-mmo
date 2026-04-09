import sheetUrl from '../../assets/sprites/03002_elfeF.png'

// Sheet: 256×128 — 8 cols × 4 rows at 32×32 px per frame
// Row 0 = facing down; col 0 = idle frame
const FRAME_W = 32
const FRAME_H = 32

const sheet = new Image()
sheet.src = sheetUrl

export function drawNpc(ctx, x, y) {
  x = Math.floor(x); y = Math.floor(y)
  if (!sheet.complete || sheet.naturalWidth === 0) return

  // Static radial circle at feet — fades center to edge, no blinking (NPC)
  const grd = ctx.createRadialGradient(x + 8, y + 11, 0, x + 8, y + 11, 11)
  grd.addColorStop(0,   'rgba(96,232,255,0.38)')
  grd.addColorStop(0.5, 'rgba(96,232,255,0.13)')
  grd.addColorStop(1,   'rgba(96,232,255,0)')
  ctx.save()
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(x + 8, y + 11, 11, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(sheet, 0, 0, FRAME_W, FRAME_H, x - 8, y - 16, FRAME_W, FRAME_H)
  ctx.restore()
}
