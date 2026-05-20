import { drawMirror } from './mirror.jsx'
import { drawTable } from './table.jsx'

export function drawBehindPlayer(ctx, world, player, torchPhase, charColors, refl1, refl2) {
  const { MIRROR_TY, MIRROR2_TY, TABLE_X, TABLE_Y, TABLE_CX, TABLE_CY } = world
  const playerY8 = player.y + 8
  const pcx = player.x + 8
  const pcy = player.y + 8

  if (MIRROR_TY  + 32 < playerY8) drawMirror(ctx, world.MIRROR_TX,  MIRROR_TY,  torchPhase, refl1, true)
  if (MIRROR2_TY + 32 < playerY8) drawMirror(ctx, world.MIRROR2_TX, MIRROR2_TY, torchPhase, refl2)
  if (TABLE_Y    + 12 < playerY8) {
    const d = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
    drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, Math.max(0, Math.min(1, (48 - d) / 36)))
  }
}

export function drawInFrontOfPlayer(ctx, world, player, torchPhase, charColors, refl1, refl2) {
  const { MIRROR_TY, MIRROR2_TY, TABLE_X, TABLE_Y, TABLE_CX, TABLE_CY } = world
  const playerY8 = player.y + 8
  const pcx = player.x + 8
  const pcy = player.y + 8

  if (MIRROR_TY  + 32 >= playerY8) drawMirror(ctx, world.MIRROR_TX,  MIRROR_TY,  torchPhase, refl1, true)
  if (MIRROR2_TY + 32 >= playerY8) drawMirror(ctx, world.MIRROR2_TX, MIRROR2_TY, torchPhase, refl2)
  if (TABLE_Y    + 12 >= playerY8) {
    const d = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
    drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, Math.max(0, Math.min(1, (48 - d) / 36)))
  }
}
