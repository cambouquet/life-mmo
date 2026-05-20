import { drawBand } from './boundsBand.js'
import { drawBurst } from './boundsBurst.js'
import { calculateProximity } from './boundsProximity.js'
import { drawWithRightGapClip, drawWithLeftGapClip } from './boundsClip.js'

function drawRoomBounds(ctx, rx, ry, rw, rh, pcx, pcy, phase) {
  const { pTop, pBottom, pLeft, pRight } = calculateProximity(pcx, pcy, rx, ry, rw, rh)
  drawBand(ctx, rx, ry,        rw, GLOW,  rx, ry,      rx, ry+GLOW,  pTop, rx, ry, rw, rh)
  drawBand(ctx, rx, ry+rh-GLOW, rw, GLOW,  rx, ry+rh,   rx, ry+rh-GLOW, pBottom, rx, ry, rw, rh)
  drawBand(ctx, rx, ry,        GLOW, rh,  rx, ry,      rx+GLOW, ry, pLeft, rx, ry, rw, rh)
  drawBand(ctx, rx+rw-GLOW, ry, GLOW, rh, rx+rw, ry,  rx+rw-GLOW, ry, pRight, rx, ry, rw, rh)
  drawBurst(ctx, pcx, ry,      pTop)
  drawBurst(ctx, pcx, ry + rh, pBottom)
  drawBurst(ctx, rx,      pcy, pLeft)
  drawBurst(ctx, rx + rw, pcy, pRight)
}

export function drawBoundsOfLight(ctx, rooms, phase, pcx, pcy, rightWallGap, leftWallGap2) {
  ctx.save()
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i]
    if (i === 0 && rightWallGap) {
      drawWithRightGapClip(ctx, room, rightWallGap, () => drawRoomBounds(ctx, room.x, room.y, room.w, room.h, pcx, pcy, phase))
    } else if (i === 1 && leftWallGap2) {
      drawWithLeftGapClip(ctx, room, leftWallGap2, () => drawRoomBounds(ctx, room.x, room.y, room.w, room.h, pcx, pcy, phase))
    } else {
      drawRoomBounds(ctx, room.x, room.y, room.w, room.h, pcx, pcy, phase)
    }
  }
  ctx.restore()
}
