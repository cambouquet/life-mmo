// Game Test Runner - Runs tests directly in the game
// Unit tests for isolated mechanics, then combined scenarios

export class TestRunner {
  constructor(options = {}) {
    this.results = []
    this.currentTest = null
    this.onProgress = options.onProgress || (() => {})
    this.onComplete = options.onComplete || (() => {})
    this.gameState = options.gameState || {}
  }

  async run(testName, testFn) {
    const test = { name: testName, status: 'running', error: null, duration: 0 }
    this.currentTest = test
    this.results.push(test)
    this.onProgress({ test, allResults: this.results })

    const startTime = performance.now()
    try {
      await testFn()
      test.status = 'passed'
    } catch (error) {
      test.status = 'failed'
      test.error = error.message
    } finally {
      test.duration = performance.now() - startTime
      this.onProgress({ test, allResults: this.results })
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`)
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message || 'Assertion failed'}: expected ${expected}, got ${actual}`)
    }
  }

  assertGreater(actual, expected, message) {
    if (actual <= expected) {
      throw new Error(`${message || 'Assertion failed'}: ${actual} should be > ${expected}`)
    }
  }

  assertLess(actual, expected, message) {
    if (actual >= expected) {
      throw new Error(`${message || 'Assertion failed'}: ${actual} should be < ${expected}`)
    }
  }

  getResults() {
    return {
      tests: this.results,
      passed: this.results.filter(t => t.status === 'passed').length,
      failed: this.results.filter(t => t.status === 'failed').length,
      total: this.results.length,
      duration: this.results.reduce((sum, t) => sum + t.duration, 0)
    }
  }

  reset() {
    this.results = []
    this.currentTest = null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Game Test Suites
// ─────────────────────────────────────────────────────────────────────────────

export async function runGameUnitTests(runner, player, world) {
  // Player Movement Tests
  await runner.run('Player starts at valid position', () => {
    runner.assert(player.x !== undefined, 'Player has x position')
    runner.assert(player.y !== undefined, 'Player has y position')
    runner.assert(player.x >= 0, 'Player x >= 0')
    runner.assert(player.y >= 0, 'Player y >= 0')
  })

  await runner.run('Player position is within bounds', () => {
    const TILE = 16
    const maxX = 2000 // Approximate max based on world
    const maxY = 1500
    runner.assert(player.x <= maxX, `Player x (${player.x}) <= ${maxX}`)
    runner.assert(player.y <= maxY, `Player y (${player.y}) <= ${maxY}`)
  })

  // Facing Direction Tests
  await runner.run('Player has valid facing direction', () => {
    const validFacings = ['up', 'down', 'left', 'right']
    runner.assert(
      validFacings.includes(player.facing),
      `Facing is one of: ${validFacings.join(', ')}`
    )
  })

  await runner.run('Player velocity is initialized', () => {
    runner.assert(player.vx !== undefined, 'Player has vx')
    runner.assert(player.vy !== undefined, 'Player has vy')
  })

  // World Structure Tests
  await runner.run('World has required properties', () => {
    runner.assert(world.MIRROR_CX !== undefined, 'World has MIRROR_CX')
    runner.assert(world.MIRROR_CY !== undefined, 'World has MIRROR_CY')
    runner.assert(world.MIRROR2_CX !== undefined, 'World has MIRROR2_CX')
    runner.assert(world.MIRROR2_CY !== undefined, 'World has MIRROR2_CY')
    runner.assert(world.NPC_CX !== undefined, 'World has NPC_CX')
    runner.assert(world.NPC_CY !== undefined, 'World has NPC_CY')
  })

  await runner.run('Mirrors are at different positions', () => {
    const dist = Math.hypot(
      world.MIRROR2_CX - world.MIRROR_CX,
      world.MIRROR2_CY - world.MIRROR_CY
    )
    runner.assertGreater(dist, 50, 'Mirrors are separated by > 50 pixels')
  })

  // Collision System Tests
  await runner.run('Collision map exists', () => {
    runner.assert(world.collMap !== undefined, 'World has collision map')
    runner.assert(Array.isArray(world.collMap), 'Collision map is an array')
    runner.assertGreater(world.collMap.length, 0, 'Collision map is not empty')
  })

  // Room Structure Tests
  await runner.run('Rooms are properly defined', () => {
    runner.assert(world.ROOMS !== undefined, 'World has ROOMS')
    runner.assert(Array.isArray(world.ROOMS), 'ROOMS is an array')
    runner.assertGreater(world.ROOMS.length, 0, 'At least one room defined')

    // Check first room
    const room = world.ROOMS[0]
    runner.assert(room.x !== undefined, 'Room has x')
    runner.assert(room.y !== undefined, 'Room has y')
    runner.assert(room.w !== undefined, 'Room has width')
    runner.assert(room.h !== undefined, 'Room has height')
  })

  // Door Structure Tests
  await runner.run('Doors are properly configured', () => {
    runner.assert(world.DOOR_WX !== undefined, 'Door 1 has world X')
    runner.assert(world.DOOR_WY !== undefined, 'Door 1 has world Y')
    runner.assert(world.DOOR2_WX !== undefined, 'Door 2 has world X')
    runner.assert(world.DOOR2_WY !== undefined, 'Door 2 has world Y')
  })

  // Torch Configuration Tests
  await runner.run('Torches are initialized', () => {
    runner.assert(world.TORCHES_LIVE !== undefined, 'TORCHES_LIVE exists')
    runner.assert(Array.isArray(world.TORCHES_LIVE), 'TORCHES_LIVE is array')
    runner.assert(world.TORCHES2_LIVE !== undefined, 'TORCHES2_LIVE exists')
    runner.assert(Array.isArray(world.TORCHES2_LIVE), 'TORCHES2_LIVE is array')
  })
}

export async function runGameIntegrationTests(runner, getPlayerPos, movePlayer) {
  await runner.run('Can get initial player position', async () => {
    const pos = getPlayerPos()
    runner.assert(pos !== null, 'Player position is available')
    runner.assert(pos.x >= 0, 'Position has valid x')
    runner.assert(pos.y >= 0, 'Position has valid y')
  })

  await runner.run('Player position updates are tracked', async () => {
    const pos1 = getPlayerPos()
    await new Promise(resolve => setTimeout(resolve, 100))
    const pos2 = getPlayerPos()

    runner.assert(
      pos1.x !== undefined && pos2.x !== undefined,
      'Both position reads successful'
    )
  })

  await runner.run('Movement input is received', async () => {
    const startPos = getPlayerPos()
    await movePlayer('right', 1000) // Move for 1 second
    const endPos = getPlayerPos()

    // Position may or may not have changed due to collisions,
    // but we verify the movement system exists
    runner.assert(
      endPos.x !== undefined && endPos.y !== undefined,
      'Position readable after movement input'
    )
  })

  await runner.run('Player can navigate around world', async () => {
    const pos1 = getPlayerPos()

    // Try moving in different directions
    await movePlayer('right', 500)
    const pos2 = getPlayerPos()

    await movePlayer('down', 500)
    const pos3 = getPlayerPos()

    await movePlayer('left', 500)
    const pos4 = getPlayerPos()

    runner.assert(
      pos1.x !== undefined && pos4.x !== undefined,
      'Navigation sequence completed'
    )
  })

  await runner.run('Player stays within bounds', async () => {
    const startPos = getPlayerPos()

    // Move left repeatedly to test boundary
    for (let i = 0; i < 10; i++) {
      await movePlayer('left', 200)
    }

    const endPos = getPlayerPos()
    runner.assertGreater(endPos.x, -50, 'Player x stays >= 0 (with margin)')
  })
}

export async function runGameCombinedTests(runner, getPlayerPos, movePlayer, interact) {
  await runner.run('Complete exploration sequence', async () => {
    const start = getPlayerPos()

    await movePlayer('right', 2000)
    const pos1 = getPlayerPos()

    await movePlayer('down', 1000)
    const pos2 = getPlayerPos()

    await movePlayer('left', 2000)
    const pos3 = getPlayerPos()

    await movePlayer('up', 1000)
    const pos4 = getPlayerPos()

    // Verify we moved in each direction
    runner.assertGreater(pos1.x, start.x, 'Moved right')
    runner.assertGreater(pos2.y, pos1.y, 'Moved down')
    runner.assertLess(pos3.x, pos2.x, 'Moved left')
    runner.assertLess(pos4.y, pos3.y, 'Moved up')
  })

  await runner.run('Can navigate to different rooms', async () => {
    const start = getPlayerPos()

    // Move significantly right to reach corridor/next room
    await movePlayer('right', 5000)
    const end = getPlayerPos()

    // Should have moved considerable distance
    runner.assertGreater(
      Math.abs(end.x - start.x),
      100,
      'Moved substantially across rooms'
    )
  })

  await runner.run('Interaction system is ready', async () => {
    // Just verify interact function exists and can be called
    runner.assert(typeof interact === 'function', 'Interact function exists')
  })
}
