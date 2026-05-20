import { isKeyDown } from '../game/input'
import { buildWorld } from '../game/world'
import { initializeGameLoopState } from '../game/gameLoopState'

export function setupGameLoopState(canvasRef, playerStateRef, onWorldDataRef) {
  const ctx = canvasRef.current.getContext('2d')
  ctx.imageSmoothingEnabled = false

  const world = buildWorld(playerStateRef)
  let { map, player } = world
  onWorldDataRef.current?.({ layers: world.layers, collMap: map })

  const state = initializeGameLoopState()
  state.prevShift = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
  state.prevSpace = isKeyDown('Space')
  state.map = map
  state.player = player
  state.door1 = world.door1
  state.door2 = world.door2

  return { ctx, world, state }
}
