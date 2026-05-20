import { drawMirror } from './draw/mirror.jsx'
import { drawTable } from './draw/table.jsx'

export function drawBehindPlayerRender(ctx, world, player, torchPhase, reflection) {
  const { MIRROR_TY, MIRROR_TX, TABLE_Y, TABLE_X, TABLE_CX, TABLE_CY, pcx, pcy } = world

  if (MIRROR_TY + 32 < player.y + 8) {
    drawMirror(ctx, MIRROR_TX, MIRROR_TY, torchPhase, reflection)
  }

  if (TABLE_Y + 12 < player.y + 8) {
    const pcx = player.x + 8
    const pcy = player.y + 8
    const tableDist = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
    const tableAlpha = Math.max(0, Math.min(1, (48 - tableDist) / 36))
    drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, tableAlpha)
  }
}

export function drawInFrontPlayerRender(ctx, world, player, torchPhase, reflection) {
  const { MIRROR_TY, MIRROR_TX, TABLE_Y, TABLE_X, TABLE_CX, TABLE_CY } = world

  if (MIRROR_TY + 32 >= player.y + 8) {
    drawMirror(ctx, MIRROR_TX, MIRROR_TY, torchPhase, reflection)
  }

  if (TABLE_Y + 12 >= player.y + 8) {
    const pcx = player.x + 8
    const pcy = player.y + 8
    const tableDist = Math.hypot(pcx - TABLE_CX, pcy - TABLE_CY)
    const tableAlpha = Math.max(0, Math.min(1, (48 - tableDist) / 36))
    drawTable(ctx, torchPhase, TABLE_X, TABLE_Y, tableAlpha)
  }
}
