import { GLOW, PROX_GLOW } from './boundsConstants.js'

export function drawWithRightGapClip(ctx, room, gap, drawFn) {
  const { y1, y2 } = gap
  ctx.save()
  ctx.beginPath()
  ctx.rect(room.x, room.y, room.w, room.h)
  ctx.rect(room.x + room.w - GLOW - PROX_GLOW, y1, GLOW + PROX_GLOW, y2 - y1)
  ctx.clip('evenodd')
  drawFn()
  ctx.restore()
}

export function drawWithLeftGapClip(ctx, room, gap, drawFn) {
  const { y1, y2 } = gap
  ctx.save()
  ctx.beginPath()
  ctx.rect(room.x, room.y, room.w, room.h)
  ctx.rect(room.x, y1, GLOW + PROX_GLOW, y2 - y1)
  ctx.clip('evenodd')
  drawFn()
  ctx.restore()
}
