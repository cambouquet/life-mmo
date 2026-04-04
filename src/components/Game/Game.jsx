import { useEffect, useRef } from 'react'
import { W, H, COLS, ROWS, TILE, SPEED, TORCHES, buildMap } from '../../game/constants.js'
import { movePlayer }    from '../../game/collision.js'
import { initInput, inputDir, isKeyDown } from '../../game/input.js'
import { drawFloor, drawWall, drawDoor, drawRug, drawTorch, drawShadow, drawTable } from '../../game/drawRoom.js'
import { drawWarriorSprite } from '../../game/drawWarrior.js'

const DIR_MSG = {
  down:  'moves <em>south</em>.',
  up:    'moves <em>north</em>.',
  left:  'moves <em>west</em>.',
  right: 'moves <em>east</em>.',
}
const LOG_MAX     = 3
const TABLE_CX    = 10 * TILE
const TABLE_CY    = 2 * TILE + TILE / 2
const INTERACT_R2 = 32 * 32
const MAX_JUMP_H  = 9    // logical px at apex
const JUMP_VEL    = 70   // initial upward velocity px/s
const GRAVITY     = 280  // px/s²

export default function Game({ onStateChange, onInteract, paused }) {
  const canvasRef     = useRef(null)
  const pausedRef     = useRef(paused)
  const onInteractRef = useRef(onInteract)
  const onStateRef    = useRef(onStateChange)

  useEffect(() => { pausedRef.current = paused },         [paused])
  useEffect(() => { onInteractRef.current = onInteract }, [onInteract])
  useEffect(() => { onStateRef.current = onStateChange }, [onStateChange])

  useEffect(() => {
    const cleanupInput = initInput()
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const map = buildMap()

    const player = {
      x: (COLS / 2 - 0.5) * TILE,
      y: (ROWS / 2 - 0.5) * TILE,
      w: TILE, h: TILE,
      frame: 0, frameTick: 0,
      facing: 'down', moving: false,
      jumpHeight: 0, jumpVel: 0, jumping: false,
    }

    let torchPhase = 0
    let last       = 0
    let lastFacing = ''
    let prevShift  = false
    let prevSpace  = false
    let log        = [
      '<em>System:</em> Move with WASD.',
      'The torches flicker in the dark.',
      '<em>Kami</em> enters the dungeon.',
    ]
    const FRAME_TIME = 0.18

    function nearTable() {
      const px = player.x + TILE / 2
      const py = player.y + TILE / 2
      const dx = px - TABLE_CX
      const dy = py - TABLE_CY
      return dx * dx + dy * dy < INTERACT_R2
    }

    function render(near) {
      ctx.clearRect(0, 0, W, H)
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = map[r][c]
          if      (t === 0) drawFloor(ctx, c, r)
          else if (t === 1) drawWall(ctx, c, r)
          else if (t === 2) drawDoor(ctx, c, r)
          else if (t === 3) drawFloor(ctx, c, r)
        }
      }
      drawRug(ctx)
      drawTable(ctx, torchPhase)
      TORCHES.forEach(t => drawTorch(ctx, t.c, t.r, torchPhase + t.c))

      const jf = player.jumpHeight / MAX_JUMP_H
      drawShadow(ctx, player.x, player.y, jf)
      drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame)

      // Interaction badge above table
      if (near && !pausedRef.current) {
        const pulse = Math.sin(torchPhase * 2.5) * 0.18 + 0.82
        ctx.save()
        ctx.globalAlpha = pulse
        ctx.fillStyle   = 'rgba(10,6,22,0.78)'
        ctx.fillRect(TABLE_CX - 14, TABLE_CY - 18, 28, 8)
        ctx.strokeStyle = '#4a2878'
        ctx.lineWidth   = 0.5
        ctx.strokeRect(TABLE_CX - 14, TABLE_CY - 18, 28, 8)
        ctx.font          = '6px "Courier New"'
        ctx.textAlign     = 'center'
        ctx.textBaseline  = 'middle'
        ctx.fillStyle     = '#c8a8f0'
        ctx.fillText('[SHF]', TABLE_CX, TABLE_CY - 14)
        ctx.restore()
      }
    }

    function loop(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      torchPhase += dt * 4.5

      const near = nearTable()

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

        // ── Jump (Space) ────────────────────────────────────────────────────
        const spaceNow     = isKeyDown('Space')
        const spacePressed = spaceNow && !prevSpace
        prevSpace = spaceNow
        if (spacePressed && !player.jumping) {
          player.jumping  = true
          player.jumpVel  = JUMP_VEL
        }
        if (player.jumping) {
          player.jumpVel    -= GRAVITY * dt
          player.jumpHeight += player.jumpVel * dt
          if (player.jumpHeight <= 0) {
            player.jumpHeight = 0
            player.jumpVel    = 0
            player.jumping    = false
          }
        }

        // ── Interact (Shift) ────────────────────────────────────────────────
        const shiftNow     = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
        const shiftPressed = shiftNow && !prevShift
        prevShift = shiftNow

        if (player.moving && player.facing !== lastFacing) {
          log = [`<em>Kami</em> ${DIR_MSG[player.facing]}`, ...log].slice(0, LOG_MAX)
          lastFacing = player.facing
        }

        if (shiftPressed && near) {
          log = ['<em>Kami</em> consults the celestial orb.', ...log].slice(0, LOG_MAX)
          onStateRef.current?.({ facing: player.facing, moving: player.moving, log })
          onInteractRef.current?.()
        } else {
          onStateRef.current?.({ facing: player.facing, moving: player.moving, log })
        }
      } else {
        // Paused: drain input state so nothing fires on unpause
        prevShift = isKeyDown('ShiftLeft') || isKeyDown('ShiftRight')
        prevSpace = isKeyDown('Space')
      }

      render(near)
      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)
    return () => {
      cleanupInput()
      cancelAnimationFrame(rafId)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      width={W}
      height={H}
    />
  )
}
