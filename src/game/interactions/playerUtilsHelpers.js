const VALID_DIRECTIONS = ['up', 'down', 'left', 'right']

export function addLog(logs, message, type = 'info') {
  logs.push({ message, type, timestamp: new Date().toLocaleTimeString() })
}

export function validateDirection(direction, logs) {
  if (!VALID_DIRECTIONS.includes(direction)) {
    addLog(logs, `Invalid direction: ${direction}`, 'error')
    return false
  }
  return true
}

export function validatePlayer(player, logs, errorMsg = 'Player not initialized') {
  if (!player) {
    addLog(logs, errorMsg, 'error')
    return false
  }
  return true
}

export function getTileCoordinates(x, y) {
  return { tileX: Math.floor(x / 16), tileY: Math.floor(y / 16) }
}

export function movePlayerInDirection(player, direction, speed = 1.5) {
  switch (direction) {
    case 'up': player.y -= speed; break
    case 'down': player.y += speed; break
    case 'left': player.x -= speed; break
    case 'right': player.x += speed; break
  }
}
