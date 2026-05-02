import { movePlayer } from '../collision.jsx'
import { inputDir, isKeyDown } from '../input.jsx'
import { SPEED } from '../constants.jsx'

const JUMP_VEL = 70
const GRAVITY  = 280

export function updatePlayer(player, map, dt, prevShift) {
  const { dx, dy } = inputDir()
  player.moving = dx !== 0 || dy !== 0

  if (player.moving) {
    if      (dy < 0) player.facing = 'up'
    else if (dy > 0) player.facing = 'down'
    else if (dx < 0) player.facing = 'left'
    else             player.facing = 'right'

    movePlayer(player, map, dx, dy, dt, SPEED)

    player.frameTick += dt
    if (player.frameTick >= 0.12) {
      player.frameTick = 0
      player.frame = (player.frame + 1) % 8
    }
  } else {
    player.frame     = 0
    player.frameTick = 0
  }

  // Jump
  const shiftNow = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
  if (shiftNow && !prevShift && !player.jumping) {
    player.jumping = true
    player.jumpVel = JUMP_VEL
  }
  if (player.jumping) {
    player.jumpVel    -= GRAVITY * dt
    player.jumpHeight += player.jumpVel * dt
    if (player.jumpHeight <= 0) {
      player.jumpHeight = 0
      player.jumpVel    = 0
      player.jumping    = false
    }
  }

  return shiftNow  // caller stores as prevShift
}
