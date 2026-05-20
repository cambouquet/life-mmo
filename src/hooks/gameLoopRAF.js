import { updateGameLogic } from '../game/input/gameLoopLogic'
import { renderGameFrame } from '../game/input/gameLoopRender'

export function startGameLoopRAF(ctx, world, state, refs, playerRef, playerStateRef, charColorsRef, zoomRef) {
  let rafId = requestAnimationFrame(function loop(ts) {
    const dt = Math.min((ts - state.last) / 1000, 0.05)
    state.last = ts
    state.torchPhase += dt * 4.5
    if (playerRef) playerRef.current = state.player

    updateGameLogic(state, world, refs, dt)
    renderGameFrame(ctx, world, state, refs, state.player, state.torchPhase, charColorsRef.current, zoomRef)

    rafId = requestAnimationFrame(loop)
  })
  return rafId
}
