import { inspectPlayer, teleportPlayer, setPlayerFacing, testMovementDirection } from './playerUtils.js'
import { checkProximity } from './proximityUtils.js'
import { inspectWorld, inspectRoom } from './worldUtils.js'
import { testCollisionAt, scanCollisionsAround } from './collisionUtils.js'
import { verifyGameState } from './stateVerification.js'

export class InteractionPlayground {
  constructor(options = {}) {
    this.logs = []
    this.onLog = options.onLog || (() => {})
  }

  inspectPlayer(player, world) { inspectPlayer(player, this.logs); this.notify() }
  teleportPlayer(player, x, y) { return teleportPlayer(player, x, y, this.logs) }
  setPlayerFacing(player, direction) { return setPlayerFacing(player, direction, this.logs) }
  checkProximity(player, world) { return checkProximity(player, world, this.logs) }
  inspectWorld(world) { inspectWorld(world, this.logs); this.notify() }
  inspectRoom(player, world, roomIndex = 0) { inspectRoom(player, world, roomIndex, this.logs); this.notify() }
  testCollisionAt(x, y, world) { return testCollisionAt(x, y, world, this.logs) }
  scanCollisionsAround(player, world, radius = 3) { scanCollisionsAround(player, world, radius, this.logs); this.notify() }
  testMovementDirection(player, direction) { testMovementDirection(player, direction, this.logs); this.notify() }
  verifyGameState(player, world) { verifyGameState(player, world, this.logs); this.notify() }

  notify() { if (this.logs.length > 0) this.onLog(this.logs[this.logs.length - 1], this.logs) }

  clear() {
    this.logs = []
    this.logs.push({ message: 'Log cleared', type: 'info', timestamp: new Date().toLocaleTimeString() })
    this.notify()
  }

  help() {
    const messages = [
      '=== Available Interactions ===',
      'inspectPlayer(player, world) - View player details',
      'teleportPlayer(player, x, y) - Move player to position',
      'setPlayerFacing(player, dir) - Change facing direction',
      'checkProximity(player, world) - Check nearby objects',
      'inspectWorld(world) - View world structure',
      'inspectRoom(player, world, idx) - View room details',
      'testCollisionAt(x, y, world) - Check collision',
      'scanCollisionsAround(player, world) - Find nearby walls',
      'testMovementDirection(player, dir) - Test movement',
      'verifyGameState(player, world) - Full state check',
    ]
    messages.forEach((msg, i) => {
      this.logs.push({ message: msg, type: i === 0 ? 'header' : 'info', timestamp: new Date().toLocaleTimeString() })
    })
    this.notify()
  }
}
