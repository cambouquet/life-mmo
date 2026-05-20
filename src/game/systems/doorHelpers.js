import { TILE, MID_START } from '../constants.jsx'

const TRIGGER_R2 = (TILE * 3) * (TILE * 3)

export function near(player, wx, wy) {
  const px = player.x + TILE / 2
  const py = player.y + TILE / 2
  return (px - wx) ** 2 + (py - wy) ** 2 < TRIGGER_R2
}

export function pastDoor2(player, world) {
  return player.x + TILE / 2 > world.DOOR2_WX
}

export function backInLeftRoom(player) {
  return player.x + TILE / 2 < MID_START * TILE
}

export function updateDoorProgress(open, progress, dt) {
  if (open && progress < 1) return Math.min(1, progress + dt * 0.7)
  if (!open && progress > 0) return Math.max(0, progress - dt * 0.7)
  return progress
}
