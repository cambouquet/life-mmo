import { useEffect, useRef } from 'react'
import { initInput, isKeyDown } from '../game/input.jsx'
import { buildWorld }           from '../game/world.js'
import { updatePlayer }         from '../game/systems/player.js'
import { updateDoors, isNearDoor } from '../game/systems/door.js'
import { resolveGuidance }      from '../game/systems/guidance.js'
import { resolveInteract }      from '../game/systems/interact.js'
import { renderScene }          from '../game/draw/scene.js'
import { mouseTile } from '../game/draw/debug.js'

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, onHoveredTileChange, onWorldDataChange }) {
  const pausedRef     = useRef(paused)
  const onInteractRef = useRef(onInteract)
  const onStateRef    = useRef(onStateChange)
  const charColorsRef = useRef(charColors)
  const debugActiveRef = useRef(debugActive)
  const layerEditsRef = useRef(layerEdits)
  const onHoveredTileRef = useRef(onHoveredTileChange)
  const onWorldDataRef = useRef(onWorldDataChange)

  useEffect(() => { pausedRef.current     = paused },        [paused])
  useEffect(() => { onInteractRef.current = onInteract },    [onInteract])
  useEffect(() => { onStateRef.current    = onStateChange }, [onStateChange])
  useEffect(() => { charColorsRef.current = charColors },    [charColors])
  useEffect(() => { debugActiveRef.current = debugActive },  [debugActive])
  useEffect(() => { layerEditsRef.current = layerEdits },    [layerEdits])
  useEffect(() => { onHoveredTileRef.current = onHoveredTileChange }, [onHoveredTileChange])
  useEffect(() => { onWorldDataRef.current = onWorldDataChange }, [onWorldDataChange])

  useEffect(() => {
    const cleanupInput = initInput()
    const ctx = canvasRef.current.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const world = buildWorld(playerStateRef)
    let { map, player } = world

    // Send world data to debug panel
    onWorldDataRef.current?.({ layers: world.layers, collMap: map })

    let torchPhase         = 0
    let last               = 0
    let prevShift          = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
    let prevSpace          = isKeyDown('Space')
    let elapsed            = 0
    let guidance           = null
    let mirrorOpened       = false
    let hasMovedToCorridor = false
    let log                = []
    let door1              = { open: false, progress: 0 }
    let door2              = { open: false, progress: 0 }
    let hoveredTile = null
    let selectedTile = null

    const canvas = canvasRef.current
    const onMouseMove = e => {
      hoveredTile = mouseTile(e, canvas, player.x + 8, player.y + 8)
      onHoveredTileRef.current?.(selectedTile || hoveredTile)
    }
    const onClick = e => {
      if (!debugActiveRef.current) return
      selectedTile = mouseTile(e, canvas, player.x + 8, player.y + 8)
      onHoveredTileRef.current?.(selectedTile)
    }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onClick)

    function loop(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      torchPhase += dt * 4.5
      if (playerRef) playerRef.current = player

      if (!pausedRef.current) {
        prevShift = updatePlayer(player, map, dt, prevShift)
        elapsed  += dt

        ;({ door1, door2, map } = updateDoors(door1, door2, player, world, !!doorUnlockedRef?.current, dt, map))

        const g = resolveGuidance(player, elapsed, mirrorOpened, hasMovedToCorridor)
        guidance           = g.text
        hasMovedToCorridor = g.movedToCorridor

        const spaceNow = isKeyDown('Space')
        if (spaceNow && !prevSpace) {
          const target = resolveInteract(player, world)
          if (target) {
            if (target === 'mirror1' || target === 'mirror2') mirrorOpened = true
            guidance = null
            onInteractRef.current?.(target)
          }
        }
        prevSpace = spaceNow

        onStateRef.current?.({ facing: player.facing, moving: player.moving, log, guidance, doorOpen: door1.open, door2Open: door2.open })
      } else {
        const spaceNow = isKeyDown('Space')
        if (spaceNow && !prevSpace) onInteractRef.current?.()
        prevSpace = spaceNow
      }

      const near2 = door2.open || isNearDoor(player, world.DOOR2_WX, world.DOOR2_WY)
      renderScene(ctx, world, { map, door1Progress: door1.progress, door2Progress: door2.progress, near2, hoveredTile, selectedTile, layerEdits: layerEditsRef.current }, player, torchPhase, charColorsRef.current, {
        paused:    pausedRef.current,
        nameSet:   !!nameSetRef?.current,
        colorsSet: !!colorsSetRef?.current,
      })

      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)
    return () => {
      cleanupInput()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      if (playerStateRef) playerStateRef.current = { x: player.x, y: player.y, facing: player.facing }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
