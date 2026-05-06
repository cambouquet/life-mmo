import { useEffect, useRef } from 'react'
import { initInput, isKeyDown } from '../game/input.jsx'
import { buildWorld }           from '../game/world.js'
import { updatePlayer }         from '../game/systems/player.js'
import { updateDoors, isNearDoor } from '../game/systems/door.js'
import { resolveGuidance }      from '../game/systems/guidance.js'
import { resolveInteract }      from '../game/systems/interact.js'
import { renderScene }          from '../game/draw/scene.js'
import { mouseTile } from '../game/draw/debug.js'
import { DRAW_SCALE } from '../game/constants.jsx'

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, highlightColors, spriteColorOverrides, onHoveredTileChange, onWorldDataChange, onEditSprite, onZoomChange }) {
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
  const onEditSpriteRef = useRef(null)
  const onZoomChangeRef = useRef(onZoomChange)
  const zoomRef = useRef(DRAW_SCALE)

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
  useEffect(() => { onEditSpriteRef.current = onEditSprite }, [onEditSprite])
  useEffect(() => { onZoomChangeRef.current = onZoomChange }, [onZoomChange])

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
    let altHeldDown = false
    let cameraOffsetX = 0
    let cameraOffsetY = 0
    let lastMouseX = 0
    let lastMouseY = 0
    let isPanning = false

    const canvas = canvasRef.current
    const onMouseMove = e => {
      altHeldDown = e.altKey

      // Handle camera panning in debug mode (middle mouse or spacebar drag)
      if (isPanning && debugActiveRef.current) {
        const deltaX = e.clientX - lastMouseX
        const deltaY = e.clientY - lastMouseY
        cameraOffsetX -= deltaX / zoomRef.current
        cameraOffsetY -= deltaY / zoomRef.current
      }
      lastMouseX = e.clientX
      lastMouseY = e.clientY

      hoveredTile = mouseTile(e, canvas, player.x + 8 + cameraOffsetX, player.y + 8 + cameraOffsetY, zoomRef.current)

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

      // Middle mouse button or space+click: start panning
      if (e.button === 1) {
        isPanning = true
        lastMouseX = e.clientX
        lastMouseY = e.clientY
        return
      }

      // Don't start drag for Alt+Click (paste mode)
      if (e.altKey) return

      dragMoved = false
      const tile = mouseTile(e, canvas, player.x + 8 + cameraOffsetX, player.y + 8 + cameraOffsetY, zoomRef.current)
      dragStart = tile
      isDragging = true
    }

    const onMouseUp = e => {
      if (e.button === 1) {
        isPanning = false
      }
      isDragging = false
      dragStart = null
      dragMoved = false
    }

    const onClick = e => {
      if (!debugActiveRef.current || dragMoved) return
      const tile = mouseTile(e, canvas, player.x + 8, player.y + 8, zoomRef.current)

      if (e.altKey && selectedTile) {
        // Alt+Click: paste the selected tile's data to the clicked tile
        const sourceKey = `${selectedTiles[0].c},${selectedTiles[0].r}`
        const editedData = layerEditsRef.current[sourceKey]

        if (!editedData || Object.keys(editedData).length === 0) {
          return
        }

        if (onEditSpriteRef.current) {
          onEditSpriteRef.current(prev => ({
            ...prev,
            [`${tile.c},${tile.r}`]: { ...editedData }
          }))
        }
        return
      } else if (e.ctrlKey) {
        // Ctrl+Click: toggle tile in multi-select
        const key = `${tile.c},${tile.r}`
        const existingIndex = selectedTiles.findIndex(t => `${t.c},${t.r}` === key)
        if (existingIndex >= 0) {
          selectedTiles.splice(existingIndex, 1)
          console.log('➖ Deselect:', `(${tile.c},${tile.r})`)
        } else {
          selectedTiles.push(tile)
          console.log('➕ Select:', `(${tile.c},${tile.r})`)
        }
        selectedTile = selectedTiles.length > 0 ? { tiles: selectedTiles } : null
      } else {
        // Single select
        selectedTile = tile
        selectedTiles = [tile]
      }
      onHoveredTileRef.current?.(selectedTile)
    }

    const onKeyDown = e => {
      if (!debugActiveRef.current) return
    }

    const onWheel = e => {
      if (!debugActiveRef.current) return
      e.preventDefault()

      if (e.shiftKey) {
        // Shift+Scroll: zoom
        const step = 0.25
        const minZoom = 1
        const maxZoom = 4
        zoomRef.current += e.deltaY < 0 ? step : -step
        zoomRef.current = Math.max(minZoom, Math.min(maxZoom, zoomRef.current))
        onZoomChangeRef.current?.(zoomRef.current)
      } else {
        // Scroll without shift: pan camera
        cameraOffsetX -= e.deltaX / zoomRef.current
        cameraOffsetY -= e.deltaY / zoomRef.current
      }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('keydown', onKeyDown)

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

        onStateRef.current?.({ facing: player.facing, moving: player.moving, log, guidance, doorOpen: door1.open, door2Open: door2.open, playerPos: { x: player.x, y: player.y } })
      } else {
        const spaceNow = isKeyDown('Space')
        if (spaceNow && !prevSpace) onInteractRef.current?.()
        prevSpace = spaceNow
      }

      const near2 = door2.open || isNearDoor(player, world.DOOR2_WX, world.DOOR2_WY)
      const selectedTiles = selectedTile?.tiles || (selectedTile ? [selectedTile] : [])
      const pastePreviewData = altHeldDown && selectedTile ? {
        sourceC: selectedTiles[0].c,
        sourceR: selectedTiles[0].r,
        sourceData: layerEditsRef.current[`${selectedTiles[0].c},${selectedTiles[0].r}`]
      } : null
      renderScene(ctx, world, { map, door1Progress: door1.progress, door2Progress: door2.progress, near2, hoveredTile, selectedTile, selectedTiles, layerEdits: layerEditsRef.current, highlightColors: highlightColorsRef.current, spriteColorOverrides: spriteColorOverridesRef.current, pastePreviewData }, player, torchPhase, charColorsRef.current, {
        paused:    pausedRef.current,
        nameSet:   !!nameSetRef?.current,
        colorsSet: !!colorsSetRef?.current,
      }, zoomRef.current, debugActiveRef.current ? { x: cameraOffsetX, y: cameraOffsetY } : { x: 0, y: 0 })

      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)
    return () => {
      cleanupInput()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('wheel', onWheel)
      document.removeEventListener('keydown', onKeyDown)
      cancelAnimationFrame(rafId)
      if (playerStateRef) playerStateRef.current = { x: player.x, y: player.y, facing: player.facing }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
