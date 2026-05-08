// Game Interactions Playground
// Admin tool for exploring and testing game mechanics

export class InteractionPlayground {
  constructor(options = {}) {
    this.logs = []
    this.onLog = options.onLog || (() => {})
    this.gameState = options.gameState || {}
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString()
    const entry = { message, type, timestamp }
    this.logs.push(entry)
    this.onLog(entry, this.logs)
  }

  // ─────────────────────────────────────────────────────────────────
  // Player Mechanics
  // ─────────────────────────────────────────────────────────────────

  inspectPlayer(player, world) {
    if (!player) {
      this.log('Player not initialized', 'error')
      return
    }

    const tileX = Math.floor(player.x / 16)
    const tileY = Math.floor(player.y / 16)

    this.log(`Player Position: (${player.x.toFixed(1)}, ${player.y.toFixed(1)})`, 'info')
    this.log(`Tile Coordinates: (${tileX}, ${tileY})`, 'info')
    this.log(`Facing: ${player.facing}`, 'info')
    this.log(`Velocity: (${player.vx.toFixed(2)}, ${player.vy.toFixed(2)})`, 'info')
  }

  teleportPlayer(player, x, y) {
    if (!player) {
      this.log('Cannot teleport: player not initialized', 'error')
      return false
    }

    player.x = x
    player.y = y
    player.vx = 0
    player.vy = 0

    this.log(`Teleported to (${x}, ${y})`, 'success')
    return true
  }

  setPlayerFacing(player, direction) {
    const validDirs = ['up', 'down', 'left', 'right']
    if (!validDirs.includes(direction)) {
      this.log(`Invalid direction. Valid: ${validDirs.join(', ')}`, 'error')
      return false
    }

    player.facing = direction
    this.log(`Player now facing: ${direction}`, 'success')
    return true
  }

  // ─────────────────────────────────────────────────────────────────
  // Proximity Checks
  // ─────────────────────────────────────────────────────────────────

  checkProximity(player, world) {
    if (!player || !world) {
      this.log('Missing player or world data', 'error')
      return
    }

    const px = player.x + 8
    const py = player.y + 8

    const proximities = []

    // Check mirrors
    const dist1 = Math.hypot(world.MIRROR_CX - px, world.MIRROR_CY - py)
    const dist2 = Math.hypot(world.MIRROR2_CX - px, world.MIRROR2_CY - py)
    const distNpc = Math.hypot(world.NPC_CX - px, world.NPC_CY - py)

    if (dist1 < 50) proximities.push({ target: 'Mirror 1', distance: dist1.toFixed(1), proximity: 'CLOSE' })
    if (dist2 < 50) proximities.push({ target: 'Mirror 2', distance: dist2.toFixed(1), proximity: 'CLOSE' })
    if (distNpc < 50) proximities.push({ target: 'NPC', distance: distNpc.toFixed(1), proximity: 'CLOSE' })

    if (proximities.length === 0) {
      this.log('No nearby interactive objects', 'info')
    } else {
      proximities.forEach(p => {
        this.log(`${p.target}: ${p.distance}px (${p.proximity})`, 'highlight')
      })
    }

    return proximities
  }

  // ─────────────────────────────────────────────────────────────────
  // World Inspection
  // ─────────────────────────────────────────────────────────────────

  inspectWorld(world) {
    if (!world) {
      this.log('World not initialized', 'error')
      return
    }

    this.log('=== World Structure ===', 'header')
    this.log(`Rooms: ${world.ROOMS?.length || 0}`, 'info')
    this.log(`Mirror 1: (${world.MIRROR_CX}, ${world.MIRROR_CY})`, 'info')
    this.log(`Mirror 2: (${world.MIRROR2_CX}, ${world.MIRROR2_CY})`, 'info')
    this.log(`NPC: (${world.NPC_CX}, ${world.NPC_CY})`, 'info')
    this.log(`Collision map: ${world.collMap?.length || 0} rows`, 'info')
  }

  inspectRoom(player, world, roomIndex = 0) {
    if (!world?.ROOMS?.[roomIndex]) {
      this.log(`Room ${roomIndex} not found`, 'error')
      return
    }

    const room = world.ROOMS[roomIndex]
    this.log(`=== Room ${roomIndex} ===`, 'header')
    this.log(`Position: (${room.x}, ${room.y})`, 'info')
    this.log(`Size: ${room.w}x${room.h}`, 'info')

    // Check if player is in room
    if (player) {
      const inRoom = player.x >= room.x && player.x < room.x + room.w &&
                     player.y >= room.y && player.y < room.y + room.h
      this.log(`Player in room: ${inRoom ? 'YES' : 'NO'}`, inRoom ? 'success' : 'info')
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Collision Testing
  // ─────────────────────────────────────────────────────────────────

  testCollisionAt(x, y, world) {
    if (!world?.collMap) {
      this.log('Collision map not available', 'error')
      return
    }

    const tileX = Math.floor(x / 16)
    const tileY = Math.floor(y / 16)

    if (tileY < 0 || tileY >= world.collMap.length) {
      this.log(`Y out of bounds: ${tileY}`, 'info')
      return
    }

    const row = world.collMap[tileY]
    if (!row || tileX < 0 || tileX >= row.length) {
      this.log(`X out of bounds: ${tileX}`, 'info')
      return
    }

    const colliding = row[tileX] === 1
    this.log(`Tile (${tileX}, ${tileY}): ${colliding ? 'COLLISION' : 'WALKABLE'}`,
             colliding ? 'warning' : 'success')
    return colliding
  }

  scanCollisionsAround(player, world, radius = 3) {
    if (!player || !world?.collMap) {
      this.log('Missing player or collision map', 'error')
      return
    }

    const tileX = Math.floor(player.x / 16)
    const tileY = Math.floor(player.y / 16)

    this.log(`Scanning around (${tileX}, ${tileY}) radius ${radius}`, 'info')

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

    this.log(`Found ${collisions} collision tiles nearby`, collisions > 0 ? 'warning' : 'success')
  }

  // ─────────────────────────────────────────────────────────────────
  // Movement Testing
  // ─────────────────────────────────────────────────────────────────

  testMovementDirection(player, direction) {
    const validDirs = ['up', 'down', 'left', 'right']
    if (!validDirs.includes(direction)) {
      this.log(`Invalid direction: ${direction}`, 'error')
      return
    }

    if (!player) {
      this.log('Player not initialized', 'error')
      return
    }

    const startPos = { x: player.x, y: player.y }

    // Simulate movement input
    const speed = 1.5 // pixels per frame
    switch (direction) {
      case 'up':
        player.y -= speed
        break
      case 'down':
        player.y += speed
        break
      case 'left':
        player.x -= speed
        break
      case 'right':
        player.x += speed
        break
    }

    const distance = Math.hypot(player.x - startPos.x, player.y - startPos.y)
    this.log(`Movement test ${direction}: ${distance.toFixed(2)}px`,
             distance > 0 ? 'success' : 'warning')
  }

  // ─────────────────────────────────────────────────────────────────
  // State Verification
  // ─────────────────────────────────────────────────────────────────

  verifyGameState(player, world) {
    this.log('=== Game State Verification ===', 'header')

    const checks = [
      { name: 'Player initialized', ok: !!player },
      { name: 'World initialized', ok: !!world },
      { name: 'Player has position', ok: player?.x !== undefined && player?.y !== undefined },
      { name: 'Player has facing', ok: !!player?.facing },
      { name: 'World has rooms', ok: !!world?.ROOMS?.length },
      { name: 'World has collision map', ok: !!world?.collMap },
      { name: 'Mirrors configured', ok: world?.MIRROR_CX !== undefined && world?.MIRROR2_CX !== undefined },
      { name: 'NPC configured', ok: world?.NPC_CX !== undefined }
    ]

    let passed = 0
    checks.forEach(check => {
      this.log(`${check.ok ? '✓' : '✗'} ${check.name}`, check.ok ? 'success' : 'error')
      if (check.ok) passed++
    })

    this.log(`Status: ${passed}/${checks.length} checks passed`, passed === checks.length ? 'success' : 'warning')
  }

  // ─────────────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────────────

  clear() {
    this.logs = []
    this.log('Log cleared', 'info')
  }

  help() {
    this.log('=== Available Interactions ===', 'header')
    this.log('inspectPlayer(player, world) - View player details', 'info')
    this.log('teleportPlayer(player, x, y) - Move player to position', 'info')
    this.log('setPlayerFacing(player, dir) - Change facing direction', 'info')
    this.log('checkProximity(player, world) - Check nearby objects', 'info')
    this.log('inspectWorld(world) - View world structure', 'info')
    this.log('inspectRoom(player, world, idx) - View room details', 'info')
    this.log('testCollisionAt(x, y, world) - Check collision', 'info')
    this.log('scanCollisionsAround(player, world) - Find nearby walls', 'info')
    this.log('testMovementDirection(player, dir) - Test movement', 'info')
    this.log('verifyGameState(player, world) - Full state check', 'info')
  }
}
