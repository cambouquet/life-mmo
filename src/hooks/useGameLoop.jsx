import { useEffect, useRef } from 'react'
import { useRefSync } from './useRefSync.js'
import { initInput, isKeyDown } from '../game/input.jsx'
import { buildWorld } from '../game/world.js'
import { initializeGameLoopState } from '../game/gameLoopState.js'
import { DRAW_SCALE } from '../game/constants.jsx'
import { createPointerHandlers } from '../game/input/pointerHandlers.js'
import { updateGameLogic } from '../game/input/gameLoopLogic.js'
import { renderGameFrame } from '../game/input/gameLoopRender.js'

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, highlightColors, spriteColorOverrides, hoverPreview, onHoveredTileChange, onWorldDataChange, onEditSprite, activeSprite, onZoomChange }) {
  const pausedRef = useRefSync(paused)
  const onInteractRef = useRefSync(onInteract)
  const onStateRef = useRefSync(onStateChange)
  const charColorsRef = useRefSync(charColors)
  const debugActiveRef = useRefSync(debugActive)
  const layerEditsRef = useRefSync(layerEdits)
  const highlightColorsRef = useRefSync(highlightColors)
  const spriteColorOverridesRef = useRefSync(spriteColorOverrides)
  const hoverPreviewRef = useRefSync(hoverPreview)
  const onHoveredTileRef = useRefSync(onHoveredTileChange)
  const onWorldDataRef = useRefSync(onWorldDataChange)
  const onEditSpriteRef = useRef(null)
  const activeSpriteRef = useRefSync(activeSprite)
  const onZoomChangeRef = useRefSync(onZoomChange)
  const zoomRef = useRef(DRAW_SCALE)

  useEffect(() => {
    const cleanupInput = initInput()
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

    const canvas = canvasRef.current
    const refs = {
      pausedRef, onInteractRef, onStateRef, charColorsRef, debugActiveRef,
      layerEditsRef, highlightColorsRef, spriteColorOverridesRef, hoverPreviewRef,
      onHoveredTileRef, onWorldDataRef, onEditSpriteRef, activeSpriteRef, onZoomChangeRef,
      doorUnlockedRef, nameSetRef, colorsSetRef
    }

    const { onMouseMove, onMouseDown, onMouseUp, onClick, onWheel } = createPointerHandlers(canvas, state, refs, zoomRef)

    const onKeyDown = e => {
      if (!debugActiveRef.current) return
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('keydown', onKeyDown)

    let rafId = requestAnimationFrame(function loop(ts) {
      const dt = Math.min((ts - state.last) / 1000, 0.05)
      state.last = ts
      state.torchPhase += dt * 4.5
      if (playerRef) playerRef.current = player

      updateGameLogic(state, world, refs, dt)
      renderGameFrame(ctx, world, state, refs, state.player, state.torchPhase, charColorsRef.current, zoomRef)

      rafId = requestAnimationFrame(loop)
    })

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
