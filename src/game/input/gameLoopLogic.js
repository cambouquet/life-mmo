import { isKeyDown } from '../input.jsx'
import { updatePlayer } from '../systems/player.js'
import { updateDoors } from '../systems/door.js'
import { resolveGuidance } from '../systems/guidance.js'
import { resolveInteract } from '../systems/interact.js'

export function updateGameLogic(state, world, refs, dt) {
  if (!refs.pausedRef.current) {
    state.prevShift = updatePlayer(state.player, state.map, dt, state.prevShift)
    state.elapsed += dt

    ;({ door1: state.door1, door2: state.door2, map: state.map } = updateDoors(state.door1, state.door2, state.player, world, !!refs.doorUnlockedRef?.current, dt, state.map))

    const g = resolveGuidance(state.player, state.elapsed, state.mirrorOpened, state.hasMovedToCorridor)
    state.guidance = g.text
    state.hasMovedToCorridor = g.movedToCorridor

    const spaceNow = isKeyDown('Space')
    if (spaceNow && !state.prevSpace) {
      const target = resolveInteract(state.player, world)
      if (target) {
        if (target === 'mirror1' || target === 'mirror2') state.mirrorOpened = true
        state.guidance = null
        refs.onInteractRef.current?.(target)
      }
    }
    state.prevSpace = spaceNow

    refs.onStateRef.current?.({
      facing: state.player.facing,
      moving: state.player.moving,
      log: state.log,
      guidance: state.guidance,
      doorOpen: state.door1.open,
      door2Open: state.door2.open,
      playerPos: { x: state.player.x, y: state.player.y }
    })
  } else {
    const spaceNow = isKeyDown('Space')
    if (spaceNow && !state.prevSpace) refs.onInteractRef.current?.()
    state.prevSpace = spaceNow
  }
}
