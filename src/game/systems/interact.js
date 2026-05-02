import { TILE } from '../constants.jsx'

const NPC_R2    = 28 * 28
const MIRROR_R2 = 32 * 32

function distSq(player, cx, cy) {
  const px = player.x + TILE / 2
  const py = player.y + TILE / 2
  return (px - cx) ** 2 + (py - cy) ** 2
}

export function nearNpc(player, NPC_CX, NPC_CY) {
  return distSq(player, NPC_CX, NPC_CY) < NPC_R2
}

export function nearMirror(player, MIRROR_CX, MIRROR_CY) {
  return distSq(player, MIRROR_CX, MIRROR_CY) < MIRROR_R2
}

// Returns the interaction target string, or null.
export function resolveInteract(player, world) {
  if (nearMirror(player, world.MIRROR_CX,  world.MIRROR_CY))  return 'mirror1'
  if (nearMirror(player, world.MIRROR2_CX, world.MIRROR2_CY)) return 'mirror2'
  if (nearNpc(player,    world.NPC_CX,     world.NPC_CY))     return 'npc'
  return null
}
