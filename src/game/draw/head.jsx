import sheetUrl from '../../assets/sprites/03000_magicienne.png'

const FRAME_W = 32
const FRAME_H = 32
const ROW = { down: 0, right: 1, up: 2, left: 3 }
// Source crop: 24×24 starting at x=4 of each frame (top of hat through collar)
const CROP = { x: 4, y: 0, w: 24, h: 24 }
// Canvas size (logical px, CSS doubles to 48×48)
const CV = 24

const sheet = new Image()
sheet.src = sheetUrl

export function drawHead(ctx, facing, expr, colors) {
  ctx.clearRect(0, 0, CV, CV)

  if (colors) {
    drawVectorHead(ctx, colors)
    return
  }

  if (!sheet.complete || sheet.naturalWidth === 0) return

  const row = ROW[facing] ?? ROW.down
  const col = expr === 'blink' ? 1 : 0
  
  // ... (rest of old code remains as fallback)
  ctx.save()
  ctx.imageSmoothingEnabled = false
  ctx.beginPath()
  ctx.arc(12, 10, 12, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(
    sheet,
    col * FRAME_W + CROP.x, row * FRAME_H + CROP.y, CROP.w, CROP.h,
    0, 0, CROP.w, CROP.h
  )
  ctx.restore()
}

function drawVectorHead(ctx, colors) {
  const { hair, skin, eyes } = colors
  ctx.save()
  
  // Hair back
  ctx.fillStyle = hair
  ctx.beginPath()
  ctx.arc(12, 9, 8, 0, Math.PI * 2)
  ctx.fill()
  
  // Face
  ctx.fillStyle = skin
  ctx.beginPath()
  ctx.arc(12, 11, 7, 0, Math.PI * 2)
  ctx.fill()
  
  // Eyes
  ctx.fillStyle = eyes
  ctx.fillRect(8, 10, 2, 2)
  ctx.fillRect(14, 10, 2, 2)
  
  // Bangs
  ctx.fillStyle = hair
  ctx.beginPath()
  ctx.arc(12, 7, 8, 0.8 * Math.PI, 0.2 * Math.PI, true)
  ctx.lineTo(12, 9)
  ctx.closePath()
  ctx.fill()
  
  ctx.restore()
}

