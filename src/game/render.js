import { DRAW_SCALE } from './constants.jsx'
import { drawRoom } from './draw/room.jsx'
import { drawWarriorSprite } from './draw/warrior.jsx'
import { drawNpc } from './draw/npc.jsx'
import { drawBoundsOfLight } from './draw/bounds.jsx'
import { drawProximityAura } from './draw/proximityAura.jsx'
import { drawEditorOverlay } from './draw/ui.jsx'
import { drawBadge, calculateReflection } from './renderHelpers.js'
import { drawBehindPlayerRender, drawInFrontPlayerRender } from './renderLayers.js'

export { drawBadge } from './renderHelpers.js'

export function renderFrame(ctx, { player, world, torchPhase, charColors, birthData, npcNear, mirrorNear, paused, showEditor }) {
  const { W, H, NPC_CX, NPC_CY, MIRROR_CX, MIRROR_CY, map } = world
  const cw = ctx.canvas.width
  const ch = ctx.canvas.height
  const dpr = window.devicePixelRatio || 1

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const pcx = player.x + 8
  const pcy = player.y + 8

  ctx.fillStyle = '#06040e'
  ctx.fillRect(0, 0, cw, ch)

  ctx.save()
  ctx.scale(dpr, dpr)
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
  ctx.scale(DRAW_SCALE, DRAW_SCALE)
  ctx.translate(-pcx, -pcy)

  drawProximityAura(ctx, NPC_CX, NPC_CY, pcx, pcy, 56, '168,85,247')
  drawProximityAura(ctx, MIRROR_CX, MIRROR_CY, pcx, pcy, 56, '168,85,247')

  drawRoom(ctx, map, torchPhase)

  const reflection = calculateReflection(player, MIRROR_CX, MIRROR_CY, charColors)

  drawBehindPlayerRender(ctx, world, player, torchPhase, reflection)
  drawNpc(ctx, world.NPC_X, world.NPC_Y, torchPhase)
  drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame, torchPhase, charColors, player.moving)
  drawInFrontPlayerRender(ctx, world, player, torchPhase, reflection)

  if (!paused) {
    if (npcNear) drawBadge(ctx, NPC_CX, NPC_CY - 2, torchPhase, '[SPC]')
    if (mirrorNear) drawBadge(ctx, MIRROR_CX, world.MIRROR_TY - 4, torchPhase, '[MIR]')
  }

  drawBoundsOfLight(ctx, W, H, torchPhase, pcx, pcy)

  ctx.restore()

  if (showEditor && charColors && birthData) {
    drawEditorOverlay(ctx, charColors, birthData)
  }
}
