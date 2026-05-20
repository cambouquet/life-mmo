import { DRAW_SCALE } from '../constants.jsx'
import { drawRoom } from './room.jsx'
import { drawWarriorSprite } from './warrior.jsx'
import { drawNpc } from './npc.jsx'
import { drawBoundsOfLight } from './bounds.jsx'
import { drawProximityAura } from './proximityAura.jsx'
import { drawTorch } from './torch.jsx'
import { drawDoorCorridor } from './corridor.js'
import { drawBadge } from './badge.js'
import { nearMirror, nearNpc } from '../systems/interact.js'
import { reflectionData, drawSelectedTiles, drawPastePreview, drawHoveredTile } from './sceneHelpers.js'
import { drawBehindPlayer, drawInFrontOfPlayer } from './sceneLayers.js'
import { drawHoverPreview } from './hoverPreview.js'

export function renderScene(ctx, world, state, player, torchPhase, charColors, refs, zoom = DRAW_SCALE, cameraOffset = { x: 0, y: 0 }) {
  const { map, door1Progress, door2Progress, near2, hoveredTile, selectedTiles, layerEdits, highlightColors, spriteColorOverrides, hoverPreview, pastePreviewData } = state
  const { wallX, gapY1, gapY2, wall2X, gap2Y1, gap2Y2, MIRROR_CX, MIRROR_CY, MIRROR2_CX, MIRROR2_CY, NPC_CX, NPC_CY, NPC_X, NPC_Y, ROOMS, TORCHES, TORCHES2 } = world

  const cw = ctx.canvas.width
  const ch = ctx.canvas.height
  const pcx = player.x + 8
  const pcy = player.y + 8

  ctx.fillStyle = '#06040e'
  ctx.fillRect(0, 0, cw, ch)

  ctx.save()
  ctx.translate(cw / 2, ch / 2)
  ctx.scale(zoom, zoom)
  ctx.translate(-pcx + cameraOffset.x, -pcy + cameraOffset.y)

  drawProximityAura(ctx, NPC_CX, NPC_CY, pcx, pcy, 64, '96,232,255')
  drawProximityAura(ctx, MIRROR_CX, MIRROR_CY, pcx, pcy, 56, '168,85,247')
  drawProximityAura(ctx, MIRROR2_CX, MIRROR2_CY, pcx, pcy, 56, '168,85,247')

  drawRoom(ctx, world.layers, map, layerEdits, spriteColorOverrides)
  drawDoorCorridor(ctx, door1Progress, wallX, gapY1, gapY2)
  drawDoorCorridor(ctx, door2Progress, wall2X, gap2Y1, gap2Y2, true)

  const refl1 = reflectionData(player, MIRROR_CX, MIRROR_CY, charColors)
  const refl2 = reflectionData(player, MIRROR2_CX, MIRROR2_CY, charColors)

  drawBehindPlayer(ctx, world, player, torchPhase, charColors, refl1, refl2)
  drawNpc(ctx, NPC_X, NPC_Y, torchPhase)
  drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame, torchPhase, charColors, player.moving)
  drawInFrontOfPlayer(ctx, world, player, torchPhase, charColors, refl1, refl2)

  if (!refs.paused) {
    if (nearNpc(player, NPC_CX, NPC_CY)) drawBadge(ctx, NPC_CX, NPC_CY - 2, torchPhase)
    if (nearMirror(player, MIRROR_CX, MIRROR_CY)) drawBadge(ctx, MIRROR_CX, world.MIRROR_TY - 4, torchPhase, '[MIR]')
    if (nearMirror(player, MIRROR2_CX, MIRROR2_CY)) drawBadge(ctx, MIRROR2_CX, world.MIRROR2_TY - 4, torchPhase, '[MIR]')
  }

  const gap1 = door1Progress > 0 ? { y1: gapY1, y2: gapY2 } : null
  const gap2 = door2Progress > 0 ? { y1: gap2Y1, y2: gap2Y2 } : null
  drawBoundsOfLight(ctx, ROOMS, torchPhase, pcx, pcy, gap1, gap2)
  drawTorch(ctx, TORCHES[0].c, TORCHES[0].r, torchPhase, refs.nameSet)
  drawTorch(ctx, TORCHES[1].c, TORCHES[1].r, torchPhase, refs.colorsSet)
  drawTorch(ctx, TORCHES2[0].c, TORCHES2[0].r, torchPhase, near2)
  drawTorch(ctx, TORCHES2[1].c, TORCHES2[1].r, torchPhase, near2)

  drawSelectedTiles(ctx, selectedTiles, highlightColors)
  drawPastePreview(ctx, pastePreviewData, hoveredTile)
  drawHoveredTile(ctx, hoveredTile, selectedTiles, highlightColors)
  drawHoverPreview(ctx, hoverPreview, hoveredTile, spriteColorOverrides)

  ctx.restore()
}
