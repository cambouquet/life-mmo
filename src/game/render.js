import { DRAW_SCALE, TILE } from './constants.jsx'
import { drawRoom }          from './draw/room.jsx'
import { drawTable }         from './draw/table.jsx'
import { drawWarriorSprite } from './draw/warrior.jsx'
import { drawNpc }           from './draw/npc.jsx'
import { drawBoundsOfLight } from './draw/bounds.jsx'
import { drawProximityAura } from './draw/proximityAura.jsx'
import { drawMirror }        from './draw/mirror.jsx'
import { drawEditorOverlay } from './draw/ui.jsx'

export function drawBadge(ctx, bx, by, torchPhase, label = '[SPC]') {
  const pulse = Math.sin(torchPhase * 2.5) * 0.18 + 0.82
  ctx.save()
  ctx.globalAlpha  = pulse
  ctx.fillStyle    = 'rgba(10,6,22,0.78)'
  ctx.fillRect(bx - 14, by - 4, 32, 8)
  ctx.strokeStyle  = '#4a2878'
  ctx.lineWidth    = 0.5
  ctx.strokeRect(bx - 14, by - 4, 32, 8)
  ctx.font         = '500 7px "Outfit", sans-serif'
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle    = '#f4f0ff'
  ctx.fillText(label, bx, by + 0.5)
  ctx.restore()
}

export function renderFrame(ctx, {
  player,
  world,
  torchPhase,
  charColors,
  birthData,
  npcNear,
  mirrorNear,
  paused,
  showEditor,
}) {
  const { W, H, NPC_CX, NPC_CY, MIRROR_TX, MIRROR_TY, MIRROR_CX, MIRROR_CY, TABLE_X, TABLE_Y, TABLE_CX, TABLE_CY, map } = world
  const cw = ctx.canvas.width
  const ch = ctx.canvas.height
  const dpr = window.devicePixelRatio || 1

  // Enable high-quality rendering for text/gradients
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const pcx = player.x + 8
  const pcy = player.y + 8

  ctx.fillStyle = '#06040e'
  ctx.fillRect(0, 0, cw, ch)

  ctx.save()
  // Scale everything to account for high-DPI display
  ctx.scale(dpr, dpr)

  // Ensure the center translation is integer-rounded if the viewport scale is integer
  // However, on high-DPI screens or non-integer scales, floor/round can cause jitter.
  // We'll revert to precise floats for the camera but keep the sprite snapping.
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
  ctx.scale(DRAW_SCALE, DRAW_SCALE)
  ctx.translate(-pcx, -pcy)

  drawProximityAura(ctx, NPC_CX,    NPC_CY,    pcx, pcy, 56, '168,85,247')
  drawProximityAura(ctx, MIRROR_CX, MIRROR_CY, pcx, pcy, 56, '168,85,247')

  drawRoom(ctx, map, torchPhase)

  const mirrorDist = Math.hypot(pcx - MIRROR_CX, pcy - MIRROR_CY)
  const reflAlpha  = Math.max(0, Math.min(1, (64 - mirrorDist) / 44))
  const reflection = reflAlpha > 0.02 ? {
    facing: player.facing, frame: player.frame,
    colors: charColors, moving: player.moving,
    alpha: reflAlpha,
    x: player.x, y: player.y,
  } : null

  if (MIRROR_TY + 32 < player.y + 8) {
    drawMirror(ctx, MIRROR_TX, MIRROR_TY, torchPhase, reflection)
  }
  if (TABLE_Y + 12 < player.y + 8) {
    const tableDist  = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
    const tableAlpha = Math.max(0, Math.min(1, (48 - tableDist) / 36))
    drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, tableAlpha)
  }

  drawNpc(ctx, world.NPC_X, world.NPC_Y, torchPhase)
  drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame, torchPhase, charColors, player.moving)

  if (MIRROR_TY + 32 >= player.y + 8) {
    drawMirror(ctx, MIRROR_TX, MIRROR_TY, torchPhase, reflection)
  }
  if (TABLE_Y + 12 >= player.y + 8) {
    const tableDist  = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
    const tableAlpha = Math.max(0, Math.min(1, (48 - tableDist) / 36))
    drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, tableAlpha)
  }

  if (!paused) {
    if (npcNear)    drawBadge(ctx, NPC_CX,    NPC_CY    - 2, torchPhase, '[SPC]')
    if (mirrorNear) drawBadge(ctx, MIRROR_CX, MIRROR_TY - 4, torchPhase, '[MIR]')
  }

  drawBoundsOfLight(ctx, W, H, torchPhase, pcx, pcy)

  ctx.restore()

  if (showEditor && charColors && birthData) {
    drawEditorOverlay(ctx, charColors, birthData)
  }
}
