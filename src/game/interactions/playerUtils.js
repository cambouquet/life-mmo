export function inspectPlayer(player, logs) {
  if (!player) {
    logs.push({ message: 'Player not initialized', type: 'error', timestamp: new Date().toLocaleTimeString() })
    return
  }

  const tileX = Math.floor(player.x / 16)
  const tileY = Math.floor(player.y / 16)

  logs.push({ message: `Player Position: (${player.x.toFixed(1)}, ${player.y.toFixed(1)})`, type: 'info', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Tile Coordinates: (${tileX}, ${tileY})`, type: 'info', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Facing: ${player.facing}`, type: 'info', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Velocity: (${player.vx.toFixed(2)}, ${player.vy.toFixed(2)})`, type: 'info', timestamp: new Date().toLocaleTimeString() })
}

export function teleportPlayer(player, x, y, logs) {
  if (!player) {
    logs.push({ message: 'Cannot teleport: player not initialized', type: 'error', timestamp: new Date().toLocaleTimeString() })
    return false
  }

  player.x = x
  player.y = y
  player.vx = 0
  player.vy = 0

  logs.push({ message: `Teleported to (${x}, ${y})`, type: 'success', timestamp: new Date().toLocaleTimeString() })
  return true
}

export function setPlayerFacing(player, direction, logs) {
  const validDirs = ['up', 'down', 'left', 'right']
  if (!validDirs.includes(direction)) {
    logs.push({ message: `Invalid direction. Valid: ${validDirs.join(', ')}`, type: 'error', timestamp: new Date().toLocaleTimeString() })
    return false
  }

  player.facing = direction
  logs.push({ message: `Player now facing: ${direction}`, type: 'success', timestamp: new Date().toLocaleTimeString() })
  return true
}

export function testMovementDirection(player, direction, logs) {
  const validDirs = ['up', 'down', 'left', 'right']
  if (!validDirs.includes(direction)) {
    logs.push({ message: `Invalid direction: ${direction}`, type: 'error', timestamp: new Date().toLocaleTimeString() })
    return
  }

  if (!player) {
    logs.push({ message: 'Player not initialized', type: 'error', timestamp: new Date().toLocaleTimeString() })
    return
  }

  const startPos = { x: player.x, y: player.y }
  const speed = 1.5

  switch (direction) {
    case 'up': player.y -= speed; break
    case 'down': player.y += speed; break
    case 'left': player.x -= speed; break
    case 'right': player.x += speed; break
  }

  const distance = Math.hypot(player.x - startPos.x, player.y - startPos.y)
  logs.push({ message: `Movement test ${direction}: ${distance.toFixed(2)}px`, type: distance > 0 ? 'success' : 'warning', timestamp: new Date().toLocaleTimeString() })
}
