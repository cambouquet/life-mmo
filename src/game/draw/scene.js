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
import { extractSceneVars, setupSceneContext } from './sceneSetup.js'

export function renderScene(ctx, world, state, player, torchPhase, charColors, refs, zoom = DRAW_SCALE, cameraOffset = { x: 0, y: 0 }) {
  const v = extractSceneVars(state, world, player)
  setupSceneContext(ctx, zoom, v.pcx, v.pcy, cameraOffset)

  drawProximityAura(ctx, v.NPC_CX, v.NPC_CY, v.pcx, v.pcy, 64, '96,232,255')
  drawProximityAura(ctx, v.MIRROR_CX, v.MIRROR_CY, v.pcx, v.pcy, 56, '168,85,247')
  drawProximityAura(ctx, v.MIRROR2_CX, v.MIRROR2_CY, v.pcx, v.pcy, 56, '168,85,247')

  drawRoom(ctx, world.layers, v.map, v.layerEdits, v.spriteColorOverrides)
  drawDoorCorridor(ctx, v.door1Progress, v.wallX, v.gapY1, v.gapY2)
  drawDoorCorridor(ctx, v.door2Progress, v.wall2X, v.gap2Y1, v.gap2Y2, true)

  const refl1 = reflectionData(player, v.MIRROR_CX, v.MIRROR_CY, charColors)
  const refl2 = reflectionData(player, v.MIRROR2_CX, v.MIRROR2_CY, charColors)

  drawBehindPlayer(ctx, world, player, torchPhase, charColors, refl1, refl2)
  drawNpc(ctx, v.NPC_X, v.NPC_Y, torchPhase)
  drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame, torchPhase, charColors, player.moving)
  drawInFrontOfPlayer(ctx, world, player, torchPhase, charColors, refl1, refl2)

  if (!refs.paused) {
    if (nearNpc(player, v.NPC_CX, v.NPC_CY)) drawBadge(ctx, v.NPC_CX, v.NPC_CY - 2, torchPhase)
    if (nearMirror(player, v.MIRROR_CX, v.MIRROR_CY)) drawBadge(ctx, v.MIRROR_CX, world.MIRROR_TY - 4, torchPhase, '[MIR]')
    if (nearMirror(player, v.MIRROR2_CX, v.MIRROR2_CY)) drawBadge(ctx, v.MIRROR2_CX, world.MIRROR2_TY - 4, torchPhase, '[MIR]')
  }

  const gap1 = v.door1Progress > 0 ? { y1: v.gapY1, y2: v.gapY2 } : null
  const gap2 = v.door2Progress > 0 ? { y1: v.gap2Y1, y2: v.gap2Y2 } : null
  drawBoundsOfLight(ctx, v.ROOMS, torchPhase, v.pcx, v.pcy, gap1, gap2)
  drawTorch(ctx, v.TORCHES[0].c, v.TORCHES[0].r, torchPhase, refs.nameSet)
  drawTorch(ctx, v.TORCHES[1].c, v.TORCHES[1].r, torchPhase, refs.colorsSet)
  drawTorch(ctx, v.TORCHES2[0].c, v.TORCHES2[0].r, torchPhase, v.near2)
  drawTorch(ctx, v.TORCHES2[1].c, v.TORCHES2[1].r, torchPhase, v.near2)

  drawSelectedTiles(ctx, v.selectedTiles, v.highlightColors)
  drawPastePreview(ctx, v.pastePreviewData, v.hoveredTile)
  drawHoveredTile(ctx, v.hoveredTile, v.selectedTiles, v.highlightColors)
  drawHoverPreview(ctx, v.hoverPreview, v.hoveredTile, v.spriteColorOverrides)

  ctx.restore()
}
