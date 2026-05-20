import sheetUrl from '../../assets/sprites/03000_magicienne.png'

const FRAME_W = 32
const FRAME_H = 32
const ROW = { down: 0, right: 1, up: 2, left: 3 }
const WALK_COLS = [0, 2]

const sheet = new Image()
sheet.src = sheetUrl

export function drawSpriteSheet(ctx, x, y, facing, frame) {
  if (!sheet.complete || sheet.naturalWidth === 0) return
  const row = ROW[facing] ?? ROW.down
  const col = WALK_COLS[frame & 1]
  const bob = (frame & 1) ? 1 : 0

  ctx.save()
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(sheet, col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H, Math.floor(x) - 8, Math.floor(y) + bob - 16, FRAME_W, FRAME_H)
  ctx.restore()
}
