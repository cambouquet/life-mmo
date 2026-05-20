import { buildCollisionMap } from '../collisionMap.js'
import { near, pastDoor2, backInLeftRoom, updateDoorProgress } from './doorHelpers'

export function isNearDoor(player, wx, wy) {
  return near(player, wx, wy)
}

export function updateDoors(door1, door2, player, world, door1Unlocked, dt, currentMap) {
  let { open: open1, progress: prog1 } = door1
  let { open: open2, progress: prog2, crossed: crossed2 } = door2
  let mapChanged = false

  if (door1Unlocked && !open1 && near(player, world.DOOR_WX, world.DOOR_WY)) {
    open1 = true; mapChanged = true
  }

  if (!crossed2) {
    const near2 = near(player, world.DOOR2_WX, world.DOOR2_WY)
    if (!open2 && near2) { open2 = true; mapChanged = true }
    if (open2 && !near2) { open2 = false; mapChanged = true }
    if (pastDoor2(player, world)) { crossed2 = true }
  } else {
    if (backInLeftRoom(player)) {
      crossed2 = false
      if (open2) { open2 = false; mapChanged = true }
    }
  }

  prog1 = updateDoorProgress(open1, prog1, dt)
  prog2 = updateDoorProgress(open2, prog2, dt)
  const map = mapChanged ? buildCollisionMap(world.layers, open1, open2) : currentMap

  return { door1: { open: open1, progress: prog1 }, door2: { open: open2, progress: prog2, crossed: crossed2 }, map }
}
