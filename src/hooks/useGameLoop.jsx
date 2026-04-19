import { useEffect, useRef } from 'react'
import { TILE, DRAW_SCALE, SPEED, buildMap } from '../game/constants.jsx'
import { movePlayer }                from '../game/collision.jsx'
import { initInput, inputDir, isKeyDown } from '../game/input.jsx'
import { drawRoom }                  from '../game/draw/room.jsx'
import { drawTable }                 from '../game/draw/table.jsx'
import { drawWarriorSprite }         from '../game/draw/warrior.jsx'
import { drawNpc }                   from '../game/draw/npc.jsx'
import { drawBoundsOfLight }         from '../game/draw/bounds.jsx'
import { drawProximityAura }         from '../game/draw/proximityAura.jsx'
import { drawMirror }               from '../game/draw/mirror.jsx'

const LOG_MAX         = 3
const NPC_INTERACT_R2 = 28 * 28

const MAX_JUMP_H  = 9
const JUMP_VEL    = 70
const GRAVITY     = 280
const FRAME_TIME  = 0.18

const GUIDANCE_NPC = [
  "She's been watching you.",
  "The orb stirs when you draw close.",
  "A question hangs in the air between you.",
  "She has something to say. Or maybe she's waiting for you to ask.",
]

const GUIDANCE_IDLE = [
  "Still.",
  "Nothing moves but the torchlight.",
  "You've been standing here a while.",
  "The room is patient. Are you?",
  "What are you looking for?",
  "Some doors don't open until you stop rushing.",
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused, charColors }) {
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

    // Fixed large world — player is always centered, camera follows
    const WORLD_COLS = 60
    const WORLD_ROWS = 40
    const W      = WORLD_COLS * TILE
    const H      = WORLD_ROWS * TILE
    const pcStartC = Math.floor(WORLD_COLS / 2)
    const pcStartR = Math.floor(WORLD_ROWS / 2)
    const tableC   = pcStartC - 2
    const tableR   = pcStartR - 2
    const TABLE_X  = tableC * TILE
    const TABLE_Y  = tableR * TILE
    const TABLE_CX = TABLE_X + 16
    const TABLE_CY = TABLE_Y + 8
    // NPC stands 2 tiles to the right of the table
    const NPC_X    = (tableC + 3) * TILE
    const NPC_Y    = tableR * TILE
    const NPC_CX   = NPC_X + 8
    const NPC_CY   = NPC_Y + 8

    // Mirror — 2×2 tiles; top-left at (MIRROR_C, MIRROR_R - 1)
    const MIRROR_C  = pcStartC - 5
    const MIRROR_R  = pcStartR
    const MIRROR_TX = MIRROR_C * TILE                // top-left x of 32×32 sprite
    const MIRROR_TY = (MIRROR_R - 1) * TILE          // top-left y
    const MIRROR_CX = MIRROR_TX + 16                 // centre x (for aura / near-check)
    const MIRROR_CY = MIRROR_TY + 16                 // centre y

    const map    = buildMap(WORLD_COLS, WORLD_ROWS, MIRROR_C, MIRROR_R, tableC, tableR)
    const player = {
      x: pcStartC * TILE,
      y: pcStartR * TILE,
      w: TILE, h: TILE,
      frame: 0, frameTick: 0,
      facing: 'down', moving: false,
      jumpHeight: 0, jumpVel: 0, jumping: false,
    }

    let torchPhase  = 0
    let last        = 0
    let prevShift   = false
    let prevSpace   = false
    let idleTime       = 0
    let guidanceTimer  = 16
    let guidance       = null
    let lastGuidanceCtx = null
    let idleSaidCount  = 0
    let log         = [
      '<em>System:</em> Move with WASD.',
      'The void holds its breath.',
      '<em>Kami</em> steps into the dark.',
    ]

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

    function render(npcNear, mirrorNear) {
      const cw = ctx.canvas.width, ch = ctx.canvas.height
      const pcx = player.x + 8, pcy = player.y + 8

      ctx.fillStyle = '#06040e'
      ctx.fillRect(0, 0, cw, ch)

      // Camera: keep player centered on screen, world drawn at DRAW_SCALE
      ctx.save()
      ctx.translate(cw / 2, ch / 2)
      ctx.scale(DRAW_SCALE, DRAW_SCALE)
      ctx.translate(-pcx, -pcy)

      drawProximityAura(ctx, NPC_CX,    NPC_CY,    pcx, pcy, 64, '96,232,255')   // NPC — cyan
      drawProximityAura(ctx, MIRROR_CX, MIRROR_CY, pcx, pcy, 56, '168,85,247')  // Mirror — purple
      drawProximityAura(ctx, TABLE_CX,  TABLE_CY,  pcx, pcy, 40, '140,80,255')  // Table — indigo/violet

      drawRoom(ctx, map, torchPhase)

      // 1. Mirror - reflection and aura
      const mirrorDist  = Math.hypot(pcx - MIRROR_CX, pcy - MIRROR_CY)
      const reflAlpha   = Math.max(0, Math.min(1, (64 - mirrorDist) / 44))
      const reflection  = reflAlpha > 0.02 ? {
        facing: player.facing, frame: player.frame,
        colors: charColorsRef.current, moving: player.moving,
        alpha:  reflAlpha,
        x: player.x, 
        y: player.y, 
      } : null
      drawMirror(ctx, MIRROR_TX, MIRROR_TY, torchPhase, reflection)

      // 2. Table - proximity glow (removed pulsating oscillation)
      const tableDist = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
      const tableAlpha = Math.max(0, Math.min(1, (48 - tableDist) / 36))
      drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, tableAlpha)
      
      drawNpc(ctx, NPC_X, NPC_Y, torchPhase)
      drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame, torchPhase, charColorsRef.current, player.moving)

      if (!pausedRef.current) {
        if (npcNear) badge(NPC_CX, NPC_Y - 2)
        if (mirrorNear) badge(MIRROR_CX, MIRROR_TY - 4, '[MIR]')
      }

      drawBoundsOfLight(ctx, W, H, torchPhase, pcx, pcy)

      ctx.restore()
    }

    function loop(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      torchPhase += dt * 4.5

      const npcNear    = nearNpc()
      const mirrorNear = nearMirror()

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
          // Relaxed walk cycle (0.12s per frame) through all 8 unique positions
          if (player.frameTick >= 0.12) {
            player.frameTick = 0
            player.frame = (player.frame + 1) % 8
          }
        } else {
          // Idle frame logic: if not moving, we reset frame to 0
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

        // NPC speech timer removed — dialog modal handles NPC interaction

        // Guidance voice
        idleTime += player.moving ? -idleTime * dt * 3 : dt
        const guidanceCtx = npcNear ? 'npc' : mirrorNear ? 'mirror' : (idleTime > 15 && idleSaidCount < 2) ? 'idle' : null
        if (guidanceCtx !== lastGuidanceCtx) {
          guidanceTimer = Math.min(guidanceTimer, guidanceCtx ? 4 : 2)
          lastGuidanceCtx = guidanceCtx
        }
        guidanceTimer -= dt
        if (guidanceTimer <= 0) {
          if      (guidanceCtx === 'npc')    { guidance = pick(GUIDANCE_NPC);   guidanceTimer = 30 + Math.random() * 20 }
          else if (guidanceCtx === 'mirror') { guidance = "The glass reflects more than just your face."; guidanceTimer = 30 }
          else if (guidanceCtx === 'idle')   { guidance = pick(GUIDANCE_IDLE);  guidanceTimer = 999; idleSaidCount++ }
          else                               { guidance = null; guidanceTimer = 20 }
        }

        // Interact
        const spaceNow = isKeyDown('Space')
        if (spaceNow && !prevSpace && (npcNear || mirrorNear)) {
          if (mirrorNear) {
            log = ['<em>Kami</em> looks into the mirror.', ...log].slice(0, LOG_MAX)
            onInteractRef.current?.('mirror')
          } else {
            log = ['<em>Kami</em> speaks with Lyra.', ...log].slice(0, LOG_MAX)
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

      render(npcNear, mirrorNear)
      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)
    return () => { cleanupInput(); cancelAnimationFrame(rafId) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
