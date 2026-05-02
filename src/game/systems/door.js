import { TILE, buildMap } from '../constants.jsx'

const TRIGGER_R2 = (TILE * 3) * (TILE * 3)

function near(player, wx, wy) {
  const px = player.x + TILE / 2
  const py = player.y + TILE / 2
  return (px - wx) ** 2 + (py - wy) ** 2 < TRIGGER_R2
}

export function isNearDoor(player, wx, wy) {
  return near(player, wx, wy)
}

// Updates both doors together so buildMap is called with both states.
// Returns { door1, door2, map } — map is only rebuilt when a door state changes.
export function updateDoors(door1, door2, player, world, door1Unlocked, dt, currentMap) {
  let { open: open1, progress: prog1 } = door1
  let { open: open2, progress: prog2 } = door2
  let mapChanged = false

  if (door1Unlocked) {
    const near1 = near(player, world.DOOR_WX, world.DOOR_WY)
    if (!open1 && near1)  { open1 = true;  mapChanged = true }
    if ( open1 && !near1) { open1 = false; mapChanged = true }
  }

  const near2 = near(player, world.DOOR2_WX, world.DOOR2_WY)
  if (!open2 && near2)  { open2 = true;  mapChanged = true }
  if ( open2 && !near2) { open2 = false; mapChanged = true }

  if (open1 && prog1 < 1) prog1 = Math.min(1, prog1 + dt * 0.7)
  else if (!open1 && prog1 > 0) prog1 = Math.max(0, prog1 - dt * 0.7)

  if (open2 && prog2 < 1) prog2 = Math.min(1, prog2 + dt * 0.7)
  else if (!open2 && prog2 > 0) prog2 = Math.max(0, prog2 - dt * 0.7)

  const map = mapChanged ? buildMap(open1, open2).map : currentMap

  return {
    door1: { open: open1, progress: prog1 },
    door2: { open: open2, progress: prog2 },
    map,
  }
}
