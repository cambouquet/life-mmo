export function testCollisionAt(x, y, world, logs) {
  if (!world?.collMap) {
    logs.push({ message: 'Collision map not available', type: 'error', timestamp: new Date().toLocaleTimeString() })
    return
  }

  const tileX = Math.floor(x / 16)
  const tileY = Math.floor(y / 16)

  if (tileY < 0 || tileY >= world.collMap.length) {
    logs.push({ message: `Y out of bounds: ${tileY}`, type: 'info', timestamp: new Date().toLocaleTimeString() })
    return
  }

  const row = world.collMap[tileY]
  if (!row || tileX < 0 || tileX >= row.length) {
    logs.push({ message: `X out of bounds: ${tileX}`, type: 'info', timestamp: new Date().toLocaleTimeString() })
    return
  }

  const colliding = row[tileX] === 1
  logs.push({ message: `Tile (${tileX}, ${tileY}): ${colliding ? 'COLLISION' : 'WALKABLE'}`, type: colliding ? 'warning' : 'success', timestamp: new Date().toLocaleTimeString() })
  return colliding
}

export function scanCollisionsAround(player, world, radius, logs) {
  if (!player || !world?.collMap) {
    logs.push({ message: 'Missing player or collision map', type: 'error', timestamp: new Date().toLocaleTimeString() })
    return
  }

  const tileX = Math.floor(player.x / 16)
  const tileY = Math.floor(player.y / 16)

  logs.push({ message: `Scanning around (${tileX}, ${tileY}) radius ${radius}`, type: 'info', timestamp: new Date().toLocaleTimeString() })

  let collisions = 0
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const y = tileY + dy
      const x = tileX + dx

      if (y >= 0 && y < world.collMap.length) {
        const row = world.collMap[y]
        if (x >= 0 && x < row.length && row[x] === 1) {
          collisions++
        }
      }
    }
  }

  logs.push({ message: `Found ${collisions} collision tiles nearby`, type: collisions > 0 ? 'warning' : 'success', timestamp: new Date().toLocaleTimeString() })
}
