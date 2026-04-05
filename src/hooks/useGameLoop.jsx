import { useEffect, useRef } from 'react'
import { W, H, COLS, ROWS, TILE, SPEED, buildMap } from '../game/constants.jsx'
import { movePlayer }                from '../game/collision.jsx'
import { initInput, inputDir, isKeyDown } from '../game/input.jsx'
import { drawShadow, drawAura } from '../game/draw/room.jsx'
import { drawTable }                 from '../game/draw/table.jsx'
import { drawWarriorSprite }         from '../game/draw/warrior.jsx'
import { drawNpc } from '../game/draw/npc.jsx'

const LOG_MAX         = 3
const NPC_X           = 10 * TILE       // col 10, row 3
const NPC_Y           = 3  * TILE
const NPC_CX          = NPC_X + 8
const NPC_CY          = NPC_Y + 8
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

export function useGameLoop(canvasRef, { onStateChange, onInteract, paused }) {
  const pausedRef     = useRef(paused)
  const onInteractRef = useRef(onInteract)
  const onStateRef    = useRef(onStateChange)

  useEffect(() => { pausedRef.current     = paused },        [paused])
  useEffect(() => { onInteractRef.current = onInteract },    [onInteract])
  useEffect(() => { onStateRef.current    = onStateChange }, [onStateChange])

  useEffect(() => {
    const cleanupInput = initInput()
    const ctx = canvasRef.current.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const map    = buildMap()
    const player = {
      x: (COLS / 2 - 0.5) * TILE,
      y: (ROWS / 2 - 0.5) * TILE,
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



    function badge(bx, by) {
      const pulse = Math.sin(torchPhase * 2.5) * 0.18 + 0.82
      ctx.save()
      ctx.globalAlpha  = pulse
      ctx.fillStyle    = 'rgba(10,6,22,0.78)'
      ctx.fillRect(bx - 14, by - 4, 28, 8)
      ctx.strokeStyle  = '#4a2878'
      ctx.lineWidth    = 0.5
      ctx.strokeRect(bx - 14, by - 4, 28, 8)
      ctx.font         = '6px "Courier New"'
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle    = '#c8a8f0'
      ctx.fillText('[SHF]', bx, by)
      ctx.restore()
    }

    function render(npcNear) {
      const cw = ctx.canvas.width, ch = ctx.canvas.height

      // Dark void background — fill full screen
      ctx.fillStyle = '#06040e'
      ctx.fillRect(0, 0, cw, ch)

      // Draw world at 2× centred in the viewport
      const DS = 2
      const ox = Math.round((cw - W * DS) / 2)
      const oy = Math.round((ch - H * DS) / 2)
      ctx.save()
      ctx.translate(ox, oy)
      ctx.scale(DS, DS)

      drawTable(ctx, torchPhase)

      // Auras — vertical body halos, drawn before sprites
      // sprite centre: x+7 horizontal, y+8 vertical (mid of 14px figure)
      const pAlpha = 0.72 + Math.sin(torchPhase * 0.8) * 0.10 + (npcNear ? 0.15 : 0)
      const nAlpha = 0.78 + Math.sin(torchPhase * 0.7 + 1) * 0.10 + (npcNear ? 0.12 : 0)
      // outer soft halo
      drawAura(ctx, player.x + 7, player.y + 8, '160,50,255', pAlpha * 0.30, 14, 20)
      drawAura(ctx, NPC_X + 7,   NPC_Y + 8,   '0,220,240',  nAlpha * 0.30, 14, 20)
      // inner bright core
      drawAura(ctx, player.x + 7, player.y + 8, '160,50,255', pAlpha,         8, 12)
      drawAura(ctx, NPC_X + 7,   NPC_Y + 8,   '0,220,240',  nAlpha,          8, 12)

      drawNpc(ctx, NPC_X, NPC_Y, torchPhase)

      const jf = player.jumpHeight / MAX_JUMP_H
      drawShadow(ctx, player.x, player.y, jf)
      drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame)

      if (!pausedRef.current && npcNear) badge(NPC_CX, NPC_Y - 2)

      ctx.restore()
    }

    function loop(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      torchPhase += dt * 4.5

      const npcNear    = nearNpc()

      if (!pausedRef.current) {
        const { dx, dy } = inputDir()
        player.moving = dx !== 0 || dy !== 0

        if (player.moving) {
          if      (dy < 0) player.facing = 'up'
          else if (dy > 0) player.facing = 'down'
          else if (dx < 0) player.facing = 'left'
          else if (dx > 0) player.facing = 'right'

          movePlayer(player, map, dx, dy, dt, SPEED)

          player.frameTick += dt
          if (player.frameTick >= FRAME_TIME) {
            player.frameTick = 0
            player.frame     = player.frame === 0 ? 1 : 0
          }
        } else {
          player.frame     = 0
          player.frameTick = 0
        }

        // Jump
        const spaceNow = isKeyDown('Space')
        if (spaceNow && !prevSpace && !player.jumping) {
          player.jumping = true
          player.jumpVel = JUMP_VEL
        }
        prevSpace = spaceNow
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
        const guidanceCtx = npcNear ? 'npc' : (idleTime > 15 && idleSaidCount < 2) ? 'idle' : null
        if (guidanceCtx !== lastGuidanceCtx) {
          guidanceTimer = Math.min(guidanceTimer, guidanceCtx ? 4 : 2)
          lastGuidanceCtx = guidanceCtx
        }
        guidanceTimer -= dt
        if (guidanceTimer <= 0) {
          if      (guidanceCtx === 'npc')   { guidance = pick(GUIDANCE_NPC);   guidanceTimer = 30 + Math.random() * 20 }

          else if (guidanceCtx === 'idle')  { guidance = pick(GUIDANCE_IDLE);  guidanceTimer = 999; idleSaidCount++ }
          else                              { guidance = null; guidanceTimer = 20 }
        }

        // Interact
        const shiftNow = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
        if (shiftNow && !prevShift && npcNear) {
          log = ['<em>Kami</em> speaks with Lyra.', ...log].slice(0, LOG_MAX)
          onInteractRef.current?.()
        }
        prevShift = shiftNow
        onStateRef.current?.({ facing: player.facing, moving: player.moving, log, guidance })
      } else {
        const shiftNow = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
        if (shiftNow && !prevShift) onInteractRef.current?.()
        prevShift = shiftNow
        prevSpace = isKeyDown('Space')
      }

      render(npcNear)
      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)
    return () => { cleanupInput(); cancelAnimationFrame(rafId) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
