import { useEffect, useRef } from 'react'
import { W, H, SCALE, COLS, ROWS, TILE, SPEED, TORCHES, buildMap } from '../../game/constants.js'
import { movePlayer }    from '../../game/collision.js'
import { initInput, inputDir } from '../../game/input.js'
import { drawFloor, drawWall, drawDoor, drawRug, drawTorch, drawShadow } from '../../game/drawRoom.js'
import { drawWarriorSprite } from '../../game/drawWarrior.js'

const DIR_MSG = {
  down:  'moves <em>south</em>.',
  up:    'moves <em>north</em>.',
  left:  'moves <em>west</em>.',
  right: 'moves <em>east</em>.',
}
const LOG_MAX = 3

export default function Game({ onStateChange }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    initInput()

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const map = buildMap()

    const player = {
      x: (COLS / 2 - 0.5) * TILE,
      y: (ROWS / 2 - 0.5) * TILE,
      w: TILE,
      h: TILE,
      frame: 0,
      frameTick: 0,
      facing: 'down',
      moving: false,
    }

    let torchPhase   = 0
    let last         = 0
    let lastFacing   = ''
    let prevMoving   = false
    let log          = [
      '<em>System:</em> Move with WASD.',
      'The torches flicker in the dark.',
      '<em>Kami</em> enters the dungeon.',
    ]
    const FRAME_TIME = 0.18

    function render() {
      ctx.clearRect(0, 0, W, H)
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = map[r][c]
          if      (t === 0) drawFloor(ctx, c, r)
          else if (t === 1) drawWall(ctx, c, r)
          else if (t === 2) drawDoor(ctx, c, r)
        }
      }
      drawRug(ctx)
      TORCHES.forEach(t => drawTorch(ctx, t.c, t.r, torchPhase + t.c))
      drawShadow(ctx, player.x, player.y)
      drawWarriorSprite(ctx, player.x, player.y, player.facing, player.frame)
    }

    function loop(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05)
      last = ts
      torchPhase += dt * 4.5

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

      if (player.moving && player.facing !== lastFacing) {
        log = [`<em>Kami</em> ${DIR_MSG[player.facing]}`, ...log].slice(0, LOG_MAX)
        lastFacing = player.facing
        onStateChange({ facing: player.facing, moving: player.moving, log })
      } else if (player.moving !== prevMoving || player.facing !== lastFacing) {
        onStateChange({ facing: player.facing, moving: player.moving, log })
      }
      prevMoving = player.moving

      render()
      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [onStateChange])

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      width={W}
      height={H}
    />
  )
}
