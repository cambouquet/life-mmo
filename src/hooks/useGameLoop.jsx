import { useEffect, useRef } from 'react'
import { initInput, isKeyDown } from '../game/input.jsx'
import { buildWorld }           from '../game/world.js'
import { updatePlayer }         from '../game/systems/player.js'
import { updateDoors, isNearDoor } from '../game/systems/door.js'
import { resolveGuidance }      from '../game/systems/guidance.js'
import { resolveInteract }      from '../game/systems/interact.js'
import { renderScene }          from '../game/draw/scene.js'
import { mouseTile } from '../game/draw/debug.js'

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, highlightColors, spriteColorOverrides, onHoveredTileChange, onWorldDataChange }) {
  const pausedRef     = useRef(paused)
  const onInteractRef = useRef(onInteract)
  const onStateRef    = useRef(onStateChange)
  const charColorsRef = useRef(charColors)
  const debugActiveRef = useRef(debugActive)
  const layerEditsRef = useRef(layerEdits)
  const highlightColorsRef = useRef(highlightColors)
  const spriteColorOverridesRef = useRef(spriteColorOverrides)
  const onHoveredTileRef = useRef(onHoveredTileChange)
  const onWorldDataRef = useRef(onWorldDataChange)

  useEffect(() => { pausedRef.current     = paused },        [paused])
  useEffect(() => { onInteractRef.current = onInteract },    [onInteract])
  useEffect(() => { onStateRef.current    = onStateChange }, [onStateChange])
  useEffect(() => { charColorsRef.current = charColors },    [charColors])
  useEffect(() => { debugActiveRef.current = debugActive },  [debugActive])
  useEffect(() => { layerEditsRef.current = layerEdits },    [layerEdits])
  useEffect(() => { highlightColorsRef.current = highlightColors }, [highlightColors])
  useEffect(() => { spriteColorOverridesRef.current = spriteColorOverrides }, [spriteColorOverrides])
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
    let selectedTiles = []
    let dragStart = null
    let isDragging = false
    let dragMoved = false

    const canvas = canvasRef.current
    const onMouseMove = e => {
      hoveredTile = mouseTile(e, canvas, player.x + 8, player.y + 8)

      if (isDragging && dragStart && debugActiveRef.current) {
        dragMoved = true
        // Update selection while dragging
        const current = hoveredTile
        const minC = Math.min(dragStart.c, current.c)
        const maxC = Math.max(dragStart.c, current.c)
        const minR = Math.min(dragStart.r, current.r)
        const maxR = Math.max(dragStart.r, current.r)

        selectedTiles = []
        for (let c = minC; c <= maxC; c++) {
          for (let r = minR; r <= maxR; r++) {
            selectedTiles.push({ c, r })
          }
        }
        selectedTile = selectedTiles.length > 0 ? { tiles: selectedTiles } : null
        onHoveredTileRef.current?.(selectedTile)
      } else {
        onHoveredTileRef.current?.(selectedTile || hoveredTile)
      }
    }

    const onMouseDown = e => {
      if (!debugActiveRef.current) return
      dragMoved = false
      const tile = mouseTile(e, canvas, player.x + 8, player.y + 8)
      dragStart = tile
      isDragging = true
    }

    const onMouseUp = e => {
      isDragging = false
      dragStart = null
    }

    const onClick = e => {
      if (!debugActiveRef.current || dragMoved) return
      const tile = mouseTile(e, canvas, player.x + 8, player.y + 8)

      if (e.ctrlKey) {
        // Toggle tile in selection
        const key = `${tile.c},${tile.r}`
        const existingIndex = selectedTiles.findIndex(t => `${t.c},${t.r}` === key)
        if (existingIndex >= 0) {
          selectedTiles.splice(existingIndex, 1)
        } else {
          selectedTiles.push(tile)
        }
        selectedTile = selectedTiles.length > 0 ? { tiles: selectedTiles } : null
      } else {
        // Single select
        selectedTile = tile
        selectedTiles = [tile]
      }
      onHoveredTileRef.current?.(selectedTile)
    }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)
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
      const selectedTiles = selectedTile?.tiles || (selectedTile ? [selectedTile] : [])
      renderScene(ctx, world, { map, door1Progress: door1.progress, door2Progress: door2.progress, near2, hoveredTile, selectedTile, selectedTiles, layerEdits: layerEditsRef.current, highlightColors: highlightColorsRef.current, spriteColorOverrides: spriteColorOverridesRef.current }, player, torchPhase, charColorsRef.current, {
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
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      if (playerStateRef) playerStateRef.current = { x: player.x, y: player.y, facing: player.facing }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
