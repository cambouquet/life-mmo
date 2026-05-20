import { addLog, validatePlayer, validateDirection, getTileCoordinates, movePlayerInDirection } from './playerUtilsHelpers'

export function inspectPlayer(player, logs) {
  if (!validatePlayer(player, logs)) return
  const { tileX, tileY } = getTileCoordinates(player.x, player.y)
  addLog(logs, `Player Position: (${player.x.toFixed(1)}, ${player.y.toFixed(1)})`)
  addLog(logs, `Tile Coordinates: (${tileX}, ${tileY})`)
  addLog(logs, `Facing: ${player.facing}`)
  addLog(logs, `Velocity: (${player.vx.toFixed(2)}, ${player.vy.toFixed(2)})`)
}

export function teleportPlayer(player, x, y, logs) {
  if (!validatePlayer(player, logs, 'Cannot teleport: player not initialized')) return false
  player.x = x; player.y = y; player.vx = 0; player.vy = 0
  addLog(logs, `Teleported to (${x}, ${y})`, 'success')
  return true
}

export function setPlayerFacing(player, direction, logs) {
  if (!validateDirection(direction, logs)) return false
  player.facing = direction
  addLog(logs, `Player now facing: ${direction}`, 'success')
  return true
}

export function testMovementDirection(player, direction, logs) {
  if (!validateDirection(direction, logs)) return
  if (!validatePlayer(player, logs)) return
  const startPos = { x: player.x, y: player.y }
  movePlayerInDirection(player, direction, 1.5)
  const distance = Math.hypot(player.x - startPos.x, player.y - startPos.y)
  addLog(logs, `Movement test ${direction}: ${distance.toFixed(2)}px`, distance > 0 ? 'success' : 'warning')
}
