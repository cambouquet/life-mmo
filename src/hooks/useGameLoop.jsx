import { useEffect, useRef } from 'react'
import { W, H, COLS, ROWS, TILE, SPEED, TORCHES, buildMap } from '../game/constants.jsx'
import { movePlayer }                from '../game/collision.jsx'
import { initInput, inputDir, isKeyDown } from '../game/input.jsx'
import { drawFloor, drawWall, drawDoor, drawRug, drawShadow } from '../game/draw/room.jsx'
import { drawTorch }                 from '../game/draw/torch.jsx'
import { drawTable }                 from '../game/draw/table.jsx'
import { drawWarriorSprite }         from '../game/draw/warrior.jsx'
import { drawNpc } from '../game/draw/npc.jsx'

const LOG_MAX         = 3
const TORCH_R2        = 26 * 26
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
const GUIDANCE_TORCH = [
  "The flame flickers.",
  "A torch half-lit. The choice is yours.",
  "Darken it or feed it — some things ask to be decided.",
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
    let torchStates = TORCHES.map(() => true)
    let prevShift   = false
    let prevSpace   = false
    let idleTime       = 0
    let guidanceTimer  = 16
    let guidance       = null
    let lastGuidanceCtx = null
    let idleSaidCount  = 0
    let log         = [
      '<em>System:</em> Move with WASD.',
      'The torches flicker in the dark.',
      '<em>Kami</em> enters the dungeon.',
    ]

    function nearNpc() {
      const px = player.x + TILE / 2, py = player.y + TILE / 2
      const dx = px - NPC_CX, dy = py - NPC_CY
      return dx * dx + dy * dy < NPC_INTERACT_R2
    }

    function nearTorchIdx() {
      const px = player.x + TILE / 2
      const py = player.y + TILE / 2
      for (let i = 0; i < TORCHES.length; i++) {
        const tx = TORCHES[i].c * TILE + TILE / 2
        const ty = TORCHES[i].r * TILE + TILE / 2
        const dx = px - tx, dy = py - ty
        if (dx * dx + dy * dy < TORCH_R2) return i
      }
      return -1
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

    function render(npcNear, nearTch) {
      ctx.clearRect(0, 0, W, H)
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const t = map[row][col]
          if      (t === 0) drawFloor(ctx, col, row)
          else if (t === 1) drawWall(ctx,  col, row)
          else if (t === 2) drawDoor(ctx,  col, row)
          else if (t === 3) drawFloor(ctx, col, row)
        }
      }
      drawRug(ctx)
      drawTable(ctx, torchPhase)
      TORCHES.forEach((t, i) => drawTorch(ctx, t.c, t.r, torchPhase + t.c, torchStates[i]))
      drawNpc(ctx, NPC_X, NPC_Y, torchPhase)

      const jf = player.jumpHeight / MAX_JUMP_H
      drawShadow(ctx, player.x, player.y, jf)
      drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame)

      if (!pausedRef.current) {
        if (npcNear) badge(NPC_CX, NPC_Y - 2)
        if (nearTch >= 0 && !npcNear) {
          const tt = TORCHES[nearTch]
          const bx = tt.c === 0            ? 2 * TILE + 6
                   : tt.c === COLS - 1     ? (COLS - 2) * TILE - 6
                   :                          tt.c * TILE + TILE / 2
          const by = tt.r === 0            ? TILE + 6
                   :                          tt.r * TILE + TILE / 2
          badge(bx, by)
        }
      }
    }

    function loop(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      torchPhase += dt * 4.5

      const npcNear    = nearNpc()
      const torchIdx   = nearTorchIdx()

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
        const guidanceCtx = npcNear ? 'npc' : torchIdx >= 0 ? 'torch' : (idleTime > 15 && idleSaidCount < 2) ? 'idle' : null
        if (guidanceCtx !== lastGuidanceCtx) {
          guidanceTimer = Math.min(guidanceTimer, guidanceCtx ? 4 : 2)
          lastGuidanceCtx = guidanceCtx
        }
        guidanceTimer -= dt
        if (guidanceTimer <= 0) {
          if      (guidanceCtx === 'npc')   { guidance = pick(GUIDANCE_NPC);   guidanceTimer = 30 + Math.random() * 20 }
          else if (guidanceCtx === 'torch') { guidance = pick(GUIDANCE_TORCH); guidanceTimer = 30 + Math.random() * 20 }
          else if (guidanceCtx === 'idle')  { guidance = pick(GUIDANCE_IDLE);  guidanceTimer = 999; idleSaidCount++ }
          else                              { guidance = null; guidanceTimer = 20 }
        }

        // Interact
        const shiftNow = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
        if (shiftNow && !prevShift) {
          if (npcNear) {
            log = ['<em>Kami</em> speaks with Lyra.', ...log].slice(0, LOG_MAX)
            onInteractRef.current?.()
          } else if (torchIdx >= 0) {
            torchStates[torchIdx] = !torchStates[torchIdx]
            log = [`<em>Kami</em> ${torchStates[torchIdx] ? 'lights' : 'snuffs'} a torch.`, ...log].slice(0, LOG_MAX)
          }
        }
        prevShift = shiftNow
        onStateRef.current?.({ facing: player.facing, moving: player.moving, log, guidance })
      } else {
        const shiftNow = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
        if (shiftNow && !prevShift) onInteractRef.current?.()
        prevShift = shiftNow
        prevSpace = isKeyDown('Space')
      }

      render(npcNear, torchIdx)
      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)
    return () => { cleanupInput(); cancelAnimationFrame(rafId) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
