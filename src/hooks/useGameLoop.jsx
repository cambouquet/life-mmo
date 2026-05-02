import { useEffect, useRef } from 'react'
import { initInput, isKeyDown } from '../game/input.jsx'
import { buildWorld }           from '../game/world.js'
import { updatePlayer }         from '../game/systems/player.js'
import { updateDoors, isNearDoor } from '../game/systems/door.js'
import { resolveGuidance }      from '../game/systems/guidance.js'
import { resolveInteract }      from '../game/systems/interact.js'
import { renderScene }          from '../game/draw/scene.js'

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef }) {
  const pausedRef     = useRef(paused)
  const onInteractRef = useRef(onInteract)
  const onStateRef    = useRef(onStateChange)
  const charColorsRef = useRef(charColors)

  useEffect(() => { pausedRef.current     = paused },        [paused])
  useEffect(() => { onInteractRef.current = onInteract },    [onInteract])
  useEffect(() => { onStateRef.current    = onStateChange }, [onStateChange])
  useEffect(() => { charColorsRef.current = charColors },    [charColors])

  useEffect(() => {
    const cleanupInput = initInput()
    const ctx = canvasRef.current.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const world = buildWorld(playerStateRef)
    let { map, player } = world

    // Mutable loop state
    let torchPhase        = 0
    let last              = 0
    let prevShift         = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
    let prevSpace         = isKeyDown('Space')
    let elapsed           = 0
    let guidance          = null
    let mirrorOpened      = false
    let hasMovedToCorridor = false
    let log               = []
    let door1             = { open: false, progress: 0 }
    let door2             = { open: false, progress: 0 }

    function loop(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      torchPhase += dt * 4.5
      if (playerRef) playerRef.current = player

      if (!pausedRef.current) {
        // Player movement + jump
        prevShift = updatePlayer(player, map, dt, prevShift)
        elapsed  += dt

        // Doors
        ;({ door1, door2, map } = updateDoors(door1, door2, player, world, !!doorUnlockedRef?.current, dt, map))

        // Guidance
        const g = resolveGuidance(player, elapsed, mirrorOpened, hasMovedToCorridor)
        guidance          = g.text
        hasMovedToCorridor = g.movedToCorridor

        // Interaction
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
      renderScene(ctx, world, { map, door1Progress: door1.progress, door2Progress: door2.progress, near2 }, player, torchPhase, charColorsRef.current, {
        paused:    pausedRef.current,
        nameSet:   !!nameSetRef?.current,
        colorsSet: !!colorsSetRef?.current,
      })

      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)
    return () => {
      cleanupInput()
      cancelAnimationFrame(rafId)
      if (playerStateRef) playerStateRef.current = { x: player.x, y: player.y, facing: player.facing }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
