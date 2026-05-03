import { TILE, MID_START } from '../constants.jsx'
import { buildCollisionMap } from '../collisionMap.js'

const TRIGGER_R2 = (TILE * 3) * (TILE * 3)

function near(player, wx, wy) {
  const px = player.x + TILE / 2
  const py = player.y + TILE / 2
  return (px - wx) ** 2 + (py - wy) ** 2 < TRIGGER_R2
}

// Player center is past door 2's wall x = inside mid room or beyond
function pastDoor2(player, world) {
  return player.x + TILE / 2 > world.DOOR2_WX
}

// Player is back in left room (west of mid-room start)
function backInLeftRoom(player) {
  return player.x + TILE / 2 < MID_START * TILE
}

export function isNearDoor(player, wx, wy) {
  return near(player, wx, wy)
}

// Updates both doors together so buildMap is called with both states.
// Returns { door1, door2, map } — map is only rebuilt when a door state changes.
// door2 opens on approach, stays open once player crosses through, closes if player goes back.
export function updateDoors(door1, door2, player, world, door1Unlocked, dt, currentMap) {
  let { open: open1, progress: prog1 } = door1
  let { open: open2, progress: prog2, crossed: crossed2 } = door2
  let mapChanged = false

  if (door1Unlocked && !open1) {
    if (near(player, world.DOOR_WX, world.DOOR_WY)) { open1 = true; mapChanged = true }
  }

  if (!crossed2) {
    // Not yet crossed — open on approach, close when walking away
    const near2 = near(player, world.DOOR2_WX, world.DOOR2_WY)
    if (!open2 && near2)  { open2 = true;  mapChanged = true }
    if ( open2 && !near2) { open2 = false; mapChanged = true }
    // Lock open once player steps through
    if (pastDoor2(player, world)) { crossed2 = true }
  } else {
    // Crossed — stay open unless player goes all the way back to left room
    if (backInLeftRoom(player)) {
      crossed2 = false
      if (open2) { open2 = false; mapChanged = true }
    }
  }

  if (open1 && prog1 < 1) prog1 = Math.min(1, prog1 + dt * 0.7)
  else if (!open1 && prog1 > 0) prog1 = Math.max(0, prog1 - dt * 0.7)

  if (open2 && prog2 < 1) prog2 = Math.min(1, prog2 + dt * 0.7)
  else if (!open2 && prog2 > 0) prog2 = Math.max(0, prog2 - dt * 0.7)

  const map = mapChanged ? buildCollisionMap(world.layers, open1, open2) : currentMap

  return {
    door1: { open: open1, progress: prog1 },
    door2: { open: open2, progress: prog2, crossed: crossed2 },
    map,
  }
}
