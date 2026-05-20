import { useEffect } from 'react'
import { initInput } from '../game/input'
import { createPointerHandlers } from '../game/input/pointerHandlers'
import { createGameLoopRefs } from './gameLoopRefs'
import { setupGameLoopState } from './gameLoopSetup'
import { startGameLoopRAF } from './gameLoopRAF'

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, highlightColors, spriteColorOverrides, hoverPreview, onHoveredTileChange, onWorldDataChange, onEditSprite, activeSprite, onZoomChange }) {
  const loopRefs = createGameLoopRefs(paused, onInteract, onStateChange, charColors, debugActive, layerEdits, highlightColors, spriteColorOverrides, hoverPreview, onHoveredTileChange, onWorldDataChange, activeSprite, onZoomChange)

  useEffect(() => {
    const cleanupInput = initInput()
    const { ctx, world, state } = setupGameLoopState(canvasRef, playerStateRef, loopRefs.onWorldDataRef)
    const canvas = canvasRef.current
    const refs = { ...loopRefs, doorUnlockedRef, nameSetRef, colorsSetRef }

    const { onMouseMove, onMouseDown, onMouseUp, onClick, onWheel } = createPointerHandlers(canvas, state, refs, loopRefs.zoomRef)
    const onKeyDown = e => { if (!loopRefs.debugActiveRef.current) return }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('keydown', onKeyDown)

    const rafId = startGameLoopRAF(ctx, world, state, refs, playerRef, playerStateRef, loopRefs.charColorsRef, loopRefs.zoomRef)

    return () => {
      cleanupInput()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('wheel', onWheel)
      document.removeEventListener('keydown', onKeyDown)
      cancelAnimationFrame(rafId)
      if (playerStateRef) playerStateRef.current = { x: state.player.x, y: state.player.y, facing: state.player.facing }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
