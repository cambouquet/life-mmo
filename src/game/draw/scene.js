import { DRAW_SCALE, TILE } from '../constants.jsx'
import { drawRoom }          from './room.jsx'
import { drawTable }         from './table.jsx'
import { drawWarriorSprite } from './warrior.jsx'
import { drawNpc }           from './npc.jsx'
import { drawBoundsOfLight } from './bounds.jsx'
import { drawProximityAura } from './proximityAura.jsx'
import { drawMirror }        from './mirror.jsx'
import { drawTorch }         from './torch.jsx'
import { drawDoorCorridor }  from './corridor.js'
import { drawBadge }         from './badge.js'
import { nearMirror, nearNpc } from '../systems/interact.js'

function reflectionData(player, mirrorCX, mirrorCY, charColors) {
  const dist  = Math.hypot(player.x + 8 - mirrorCX, player.y + 8 - mirrorCY)
  const alpha = Math.max(0, Math.min(1, (64 - dist) / 44))
  if (alpha <= 0.02) return null
  return {
    facing: player.facing, frame: player.frame,
    colors: charColors, moving: player.moving,
    alpha, x: player.x, y: player.y,
  }
}

// ctx:         canvas 2d context
// world:       built by buildWorld()
// state:       { map, door1Progress, door2Progress, near2, debug, hoveredTile }
// player:      player object
// torchPhase:  number
// charColors:  object
// refs:        { paused, nameSet, colorsSet }
export function renderScene(ctx, world, state, player, torchPhase, charColors, refs) {
  const { map, door1Progress, door2Progress, near2, hoveredTile, selectedTile, layerEdits } = state
  const {
    wallX, gapY1, gapY2,
    wall2X, gap2Y1, gap2Y2,
    MIRROR_TX, MIRROR_TY, MIRROR_CX, MIRROR_CY,
    MIRROR2_TX, MIRROR2_TY, MIRROR2_CX, MIRROR2_CY,
    TABLE_X, TABLE_Y, TABLE_CX, TABLE_CY,
    NPC_X, NPC_Y, NPC_CX, NPC_CY,
    ROOMS, TORCHES, TORCHES2,
  } = world

  const cw  = ctx.canvas.width
  const ch  = ctx.canvas.height
  const pcx = player.x + 8
  const pcy = player.y + 8

  ctx.fillStyle = '#06040e'
  ctx.fillRect(0, 0, cw, ch)

  ctx.save()
  ctx.translate(cw / 2, ch / 2)
  ctx.scale(DRAW_SCALE, DRAW_SCALE)
  ctx.translate(-pcx, -pcy)

  // Proximity auras
  drawProximityAura(ctx, NPC_CX,     NPC_CY,     pcx, pcy, 64, '96,232,255')
  drawProximityAura(ctx, MIRROR_CX,  MIRROR_CY,  pcx, pcy, 56, '168,85,247')
  drawProximityAura(ctx, MIRROR2_CX, MIRROR2_CY, pcx, pcy, 56, '168,85,247')

  // World tiles
  drawRoom(ctx, world.layers, map, layerEdits)
  drawDoorCorridor(ctx, door1Progress, wallX,  gapY1,  gapY2)
  drawDoorCorridor(ctx, door2Progress, wall2X, gap2Y1, gap2Y2, true)

  // Mirror reflections
  const refl1 = reflectionData(player, MIRROR_CX,  MIRROR_CY,  charColors)
  const refl2 = reflectionData(player, MIRROR2_CX, MIRROR2_CY, charColors)

  const playerY8 = player.y + 8

  // Behind-player pass
  if (MIRROR_TY  + 32 < playerY8) drawMirror(ctx, MIRROR_TX,  MIRROR_TY,  torchPhase, refl1, true)
  if (MIRROR2_TY + 32 < playerY8) drawMirror(ctx, MIRROR2_TX, MIRROR2_TY, torchPhase, refl2)
  if (TABLE_Y    + 12 < playerY8) {
    const d = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
    drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, Math.max(0, Math.min(1, (48 - d) / 36)))
  }

  drawNpc(ctx, NPC_X, NPC_Y, torchPhase)
  drawWarriorSprite(ctx, player.x, player.y - player.jumpHeight, player.facing, player.frame, torchPhase, charColors, player.moving)

  // In-front-of-player pass
  if (MIRROR_TY  + 32 >= playerY8) drawMirror(ctx, MIRROR_TX,  MIRROR_TY,  torchPhase, refl1, true)
  if (MIRROR2_TY + 32 >= playerY8) drawMirror(ctx, MIRROR2_TX, MIRROR2_TY, torchPhase, refl2)
  if (TABLE_Y    + 12 >= playerY8) {
    const d = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
    drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, Math.max(0, Math.min(1, (48 - d) / 36)))
  }

  // Interaction badges
  if (!refs.paused) {
    if (nearNpc(player,    NPC_CX,     NPC_CY))     drawBadge(ctx, NPC_CX,     NPC_CY - 2,          torchPhase)
    if (nearMirror(player, MIRROR_CX,  MIRROR_CY))  drawBadge(ctx, MIRROR_CX,  MIRROR_TY - 4,       torchPhase, '[MIR]')
    if (nearMirror(player, MIRROR2_CX, MIRROR2_CY)) drawBadge(ctx, MIRROR2_CX, MIRROR2_TY - 4,      torchPhase, '[MIR]')
  }

  // Wall glow + torches
  const gap1 = door1Progress > 0 ? { y1: gapY1,  y2: gapY2  } : null
  const gap2 = door2Progress > 0 ? { y1: gap2Y1, y2: gap2Y2 } : null
  drawBoundsOfLight(ctx, ROOMS, torchPhase, pcx, pcy, gap1, gap2)
  drawTorch(ctx, TORCHES[0].c,  TORCHES[0].r,  torchPhase, refs.nameSet)
  drawTorch(ctx, TORCHES[1].c,  TORCHES[1].r,  torchPhase, refs.colorsSet)
  drawTorch(ctx, TORCHES2[0].c, TORCHES2[0].r, torchPhase, near2)
  drawTorch(ctx, TORCHES2[1].c, TORCHES2[1].r, torchPhase, near2)

  // Highlight hovered cell (dimmer) - always show if hovering
  if (hoveredTile && (!selectedTile || (hoveredTile.c !== selectedTile.c || hoveredTile.r !== selectedTile.r))) {
    const x = hoveredTile.c * TILE
    const y = hoveredTile.r * TILE
    ctx.fillStyle = 'rgba(100,200,255,0.15)'
    ctx.fillRect(x, y, TILE, TILE)
    ctx.strokeStyle = 'rgba(100,220,255,0.4)'
    ctx.lineWidth = 0.5
    ctx.strokeRect(x, y, TILE, TILE)
  }

  // Highlight selected cell (brighter) - on top
  if (selectedTile) {
    const x = selectedTile.c * TILE
    const y = selectedTile.r * TILE
    ctx.fillStyle = 'rgba(100,200,255,0.35)'
    ctx.fillRect(x, y, TILE, TILE)
    ctx.strokeStyle = 'rgba(100,255,255,0.8)'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, TILE, TILE)
  }

  ctx.restore()
}
