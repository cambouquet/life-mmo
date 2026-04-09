import sheetUrl from '../../assets/sprites/03000_magicienne.png'

// Crops a 12×10 face portrait from the magicienne spritesheet (32×32 frames)
// Face region within each frame: roughly x+10, y+0, w=12, h=10
const FRAME_W = 32
const FRAME_H = 32
const ROW = { down: 0, right: 1, up: 2, left: 3 }
// x/y offset into each frame to get the face area
const CROP = { x: 10, y: 0, w: 12, h: 10 }

const sheet = new Image()
sheet.src = sheetUrl

export function drawHead(ctx, facing, expr) {
  ctx.fillStyle = '#0a0616'
  ctx.fillRect(0, 0, 12, 10)

  if (!sheet.complete || sheet.naturalWidth === 0) return

  const row = ROW[facing] ?? ROW.down
  // For blink expression use the standing col (1), otherwise col 0
  const col = expr === 'blink' ? 1 : 0

  ctx.save()
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(
    sheet,
    col * FRAME_W + CROP.x, row * FRAME_H + CROP.y, CROP.w, CROP.h,
    0, 0, 12, 10
  )
  ctx.restore()
}

