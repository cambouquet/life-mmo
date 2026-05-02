import { useEffect, useRef } from 'react'
import { TILE, DRAW_SCALE, SPEED, buildMap, LEFT_W, TOTAL_H, GAP_W, MID_W, MID_START, RIGHT_W, ROOM_H } from '../game/constants.jsx'
import { movePlayer }                from '../game/collision.jsx'
import { initInput, inputDir, isKeyDown } from '../game/input.jsx'
import { drawRoom }                  from '../game/draw/room.jsx'
import { drawTable }                 from '../game/draw/table.jsx'
import { drawWarriorSprite }         from '../game/draw/warrior.jsx'
import { drawNpc }                   from '../game/draw/npc.jsx'
import { drawBoundsOfLight }         from '../game/draw/bounds.jsx'
import { drawProximityAura }         from '../game/draw/proximityAura.jsx'
import { drawMirror }               from '../game/draw/mirror.jsx'

const NPC_INTERACT_R2 = 28 * 28

const JUMP_VEL = 70
const GRAVITY  = 280

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors, playerRef, playerStateRef }) {
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

    // Build map — returns tile grid + key object coords
    const { map, mirrorC, mirrorR, mirror2C, mirror2R, tableC, tableR } = buildMap()

    // Room rects in world pixels — used for per-room bounds-of-light
    const ROOMS = [
      { x: 0,                              y: 0, w: LEFT_W * TILE, h: ROOM_H * TILE },
      { x: MID_START * TILE,               y: 0, w: MID_W * TILE,  h: ROOM_H * TILE },
      { x: (MID_START + MID_W + GAP_W) * TILE, y: 0, w: RIGHT_W * TILE, h: ROOM_H * TILE },
    ]

    // Mirror 1 (left room): 2 tiles wide at (mirrorC, mirrorR); sprite is 32px wide
    const MIRROR_TX = mirrorC * TILE
    const MIRROR_TY = mirrorR * TILE
    const MIRROR_CX = MIRROR_TX + 16
    const MIRROR_CY = MIRROR_TY + 16

    // Mirror 2 (mid room)
    const MIRROR2_TX = mirror2C * TILE
    const MIRROR2_TY = mirror2R * TILE
    const MIRROR2_CX = MIRROR2_TX + 16
    const MIRROR2_CY = MIRROR2_TY + 16

    // Player spawn: pixel-align so body center (x+9) lands on MIRROR_CX
    const pcStartX = MIRROR_CX - 9
    const pcStartR = Math.floor(TOTAL_H / 2)
    const pcStartY = pcStartR * TILE

    // Table in right room
    const TABLE_X  = tableC * TILE
    const TABLE_Y  = tableR * TILE
    const TABLE_CX = TABLE_X + 16
    const TABLE_CY = TABLE_Y + 8

    // NPC stands next to the table (2 tiles right of tableC)
    const NPC_X  = (tableC + 2) * TILE
    const NPC_Y  = tableR * TILE
    const NPC_CX = NPC_X + 8
    const NPC_CY = NPC_Y + 8

    const saved  = playerStateRef?.current
    const player = {
      x: saved?.x ?? pcStartX,
      y: saved?.y ?? pcStartY,
      w: TILE, h: TILE,
      frame: 0, frameTick: 0,
      facing: saved?.facing ?? 'up', moving: false,
      jumpHeight: 0, jumpVel: 0, jumping: false,
    }

    let torchPhase  = 0
    let last        = 0
    let prevShift   = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
    let prevSpace   = isKeyDown('Space')
    let elapsed     = 0      // total time since game start
    let guidance    = null
    let mirrorOpened = false
    let log         = []

    function nearNpc() {
      const px = player.x + TILE / 2, py = player.y + TILE / 2
      const dx = px - NPC_CX, dy = py - NPC_CY
      return dx * dx + dy * dy < NPC_INTERACT_R2
    }

    function nearMirror() {
      const px = player.x + TILE / 2, py = player.y + TILE / 2
      const dx = px - MIRROR_CX, dy = py - MIRROR_CY
      return dx * dx + dy * dy < 32 * 32
    }

    function nearMirror2() {
      const px = player.x + TILE / 2, py = player.y + TILE / 2
      const dx = px - MIRROR2_CX, dy = py - MIRROR2_CY
      return dx * dx + dy * dy < 32 * 32
    }

    function badge(bx, by, label = '[SPC]') {
      const pulse = Math.sin(torchPhase * 2.5) * 0.18 + 0.82
      ctx.save()
      ctx.globalAlpha  = pulse
      ctx.fillStyle    = 'rgba(10,6,22,0.78)'
      ctx.fillRect(bx - 14, by - 4, 32, 8)
      ctx.strokeStyle  = '#4a2878'
      ctx.lineWidth    = 0.5
      ctx.strokeRect(bx - 14, by - 4, 32, 8)
      ctx.font         = '6px "Courier New"'
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle    = '#c8a8f0'
      ctx.fillText(label, bx, by)
      ctx.restore()
    }

    function render(npcNear, mirrorNear, mirror2Near) {
      const cw = ctx.canvas.width, ch = ctx.canvas.height
      const pcx = player.x + 8, pcy = player.y + 8

      ctx.fillStyle = '#06040e'
      ctx.fillRect(0, 0, cw, ch)

      // Camera: keep player centered on screen, world drawn at DRAW_SCALE
      ctx.save()
      ctx.translate(cw / 2, ch / 2)
      ctx.scale(DRAW_SCALE, DRAW_SCALE)
      ctx.translate(-pcx, -pcy)

      drawProximityAura(ctx, NPC_CX,     NPC_CY,     pcx, pcy, 64, '96,232,255')   // NPC — cyan
      drawProximityAura(ctx, MIRROR_CX,  MIRROR_CY,  pcx, pcy, 56, '168,85,247')  // Mirror 1 — purple
      drawProximityAura(ctx, MIRROR2_CX, MIRROR2_CY, pcx, pcy, 56, '168,85,247')  // Mirror 2 — purple

      drawRoom(ctx, map, torchPhase)

      // Mirror 1 reflection data
      const mirrorDist  = Math.hypot(pcx - MIRROR_CX, pcy - MIRROR_CY)
      const reflAlpha   = Math.max(0, Math.min(1, (64 - mirrorDist) / 44))
      const reflection  = reflAlpha > 0.02 ? {
        facing: player.facing, frame: player.frame,
        colors: charColorsRef.current, moving: player.moving,
        alpha:  reflAlpha,
        x: player.x,
        y: player.y,
      } : null

      // Mirror 2 reflection data
      const mirror2Dist  = Math.hypot(pcx - MIRROR2_CX, pcy - MIRROR2_CY)
      const refl2Alpha   = Math.max(0, Math.min(1, (64 - mirror2Dist) / 44))
      const reflection2  = refl2Alpha > 0.02 ? {
        facing: player.facing, frame: player.frame,
        colors: charColorsRef.current, moving: player.moving,
        alpha:  refl2Alpha,
        x: player.x,
        y: player.y,
      } : null

      // Depth sort: draw objects behind the player first
      if (MIRROR_TY + 32 < player.y + 8) {
        drawMirror(ctx, MIRROR_TX, MIRROR_TY, torchPhase, reflection, true)
      }
      if (MIRROR2_TY + 32 < player.y + 8) {
        drawMirror(ctx, MIRROR2_TX, MIRROR2_TY, torchPhase, reflection2)
      }
      if (TABLE_Y + 12 < player.y + 8) {
        const tableDist = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
        const tableAlpha = Math.max(0, Math.min(1, (48 - tableDist) / 36))
        drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, tableAlpha)
      }

      drawNpc(ctx, NPC_X, NPC_Y, torchPhase)

      // Player
      drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame, torchPhase, charColorsRef.current, player.moving)

      // Foreground objects in front of the player
      if (MIRROR_TY + 32 >= player.y + 8) {
        drawMirror(ctx, MIRROR_TX, MIRROR_TY, torchPhase, reflection, true)
      }
      if (MIRROR2_TY + 32 >= player.y + 8) {
        drawMirror(ctx, MIRROR2_TX, MIRROR2_TY, torchPhase, reflection2)
      }
      if (TABLE_Y + 12 >= player.y + 8) {
        const tableDist = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
        const tableAlpha = Math.max(0, Math.min(1, (48 - tableDist) / 36))
        drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, tableAlpha)
      }

      if (!pausedRef.current) {
        if (npcNear) badge(NPC_CX, NPC_Y - 2)
        if (mirrorNear) badge(MIRROR_CX, MIRROR_TY - 4, '[MIR]')
        if (mirror2Near) badge(MIRROR2_CX, MIRROR2_TY - 4, '[MIR]')
      }

      drawBoundsOfLight(ctx, ROOMS, torchPhase, pcx, pcy)

      ctx.restore()
    }

    function loop(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      torchPhase += dt * 4.5
      if (playerRef) playerRef.current = player

      const npcNear     = nearNpc()
      const mirrorNear  = nearMirror()
      const mirror2Near = nearMirror2()

      if (!pausedRef.current) {
        const { dx, dy } = inputDir()
        const isMoving = dx !== 0 || dy !== 0
        player.moving = isMoving

        if (isMoving) {
          if (dy < 0) player.facing = 'up'
          else if (dy > 0) player.facing = 'down'
          else if (dx < 0) player.facing = 'left'
          else if (dx > 0) player.facing = 'right'

          movePlayer(player, map, dx, dy, dt, SPEED)

          player.frameTick += dt
          if (player.frameTick >= 0.12) {
            player.frameTick = 0
            player.frame = (player.frame + 1) % 8
          }
        } else {
          player.frame = 0
          player.frameTick = 0
        }

        // Jump
        const shiftNow = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
        if (shiftNow && !prevShift && !player.jumping) {
          player.jumping = true
          player.jumpVel = JUMP_VEL
        }
        prevShift = shiftNow
        if (player.jumping) {
          player.jumpVel    -= GRAVITY * dt
          player.jumpHeight += player.jumpVel * dt
          if (player.jumpHeight <= 0) {
            player.jumpHeight = 0
            player.jumpVel    = 0
            player.jumping    = false
          }
        }

        // Guidance: silent for 20s, then show question until mirror is opened
        elapsed += dt
        if (!mirrorOpened) {
          guidance = elapsed >= 20 ? "Do you know who you are?" : null
        }

        // Interact
        const spaceNow = isKeyDown('Space')
        if (spaceNow && !prevSpace && (npcNear || mirrorNear || mirror2Near)) {
          if (mirrorNear) {
            mirrorOpened = true
            guidance = null
            onInteractRef.current?.('mirror1')
          } else if (mirror2Near) {
            mirrorOpened = true
            guidance = null
            onInteractRef.current?.('mirror2')
          } else {
            onInteractRef.current?.('npc')
          }
        }
        prevSpace = spaceNow
        onStateRef.current?.({ facing: player.facing, moving: player.moving, log, guidance })
      } else {
        const spaceNow = isKeyDown('Space')
        if (spaceNow && !prevSpace) onInteractRef.current?.()
        prevSpace = spaceNow
      }

      render(npcNear, mirrorNear, mirror2Near)
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
