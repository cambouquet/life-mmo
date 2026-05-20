import { TILE, LEFT_W, MID_W, MID_START, RIGHT_W, ROOM_H, GAP_W, DOOR_C, DOOR_R, DOOR_H, DOOR2_C, DOOR2_R, DOOR2_H } from './constants.jsx'

export function buildDoorPositions() {
  const DOOR_WX = DOOR_C * TILE + TILE / 2
  const DOOR_WY = (DOOR_R + DOOR_H / 2) * TILE
  const wallX = DOOR_C * TILE
  const gapY1 = DOOR_R * TILE
  const gapY2 = (DOOR_R + DOOR_H) * TILE

  const DOOR2_WX = MID_START * TILE + TILE / 2
  const DOOR2_WY = (DOOR2_R + DOOR2_H / 2) * TILE
  const wall2X = MID_START * TILE
  const gap2Y1 = DOOR2_R * TILE
  const gap2Y2 = (DOOR2_R + DOOR2_H) * TILE

  return { DOOR_WX, DOOR_WY, wallX, gapY1, gapY2, DOOR2_WX, DOOR2_WY, wall2X, gap2Y1, gap2Y2 }
}

export function buildRoomBounds() {
  return [
    { x: 0, y: 0, w: LEFT_W * TILE, h: ROOM_H * TILE },
    { x: MID_START * TILE, y: 0, w: MID_W * TILE, h: ROOM_H * TILE },
    { x: (MID_START + MID_W + GAP_W) * TILE, y: 0, w: RIGHT_W * TILE, h: ROOM_H * TILE },
  ]
}

export function buildObjectPositions(mirrorC, mirrorR, mirror2C, mirror2R, tableC, tableR) {
  const MIRROR_TX = mirrorC * TILE
  const MIRROR_TY = mirrorR * TILE
  const MIRROR_CX = MIRROR_TX + 16
  const MIRROR_CY = MIRROR_TY + 16

  const MIRROR2_TX = mirror2C * TILE
  const MIRROR2_TY = mirror2R * TILE
  const MIRROR2_CX = MIRROR2_TX + 16
  const MIRROR2_CY = MIRROR2_TY + 16

  const TABLE_X = tableC * TILE
  const TABLE_Y = tableR * TILE
  const TABLE_CX = TABLE_X + 16
  const TABLE_CY = TABLE_Y + 8

  const NPC_X = (tableC + 2) * TILE
  const NPC_Y = tableR * TILE
  const NPC_CX = NPC_X + 8
  const NPC_CY = NPC_Y + 8

  return { MIRROR_TX, MIRROR_TY, MIRROR_CX, MIRROR_CY, MIRROR2_TX, MIRROR2_TY, MIRROR2_CX, MIRROR2_CY, TABLE_X, TABLE_Y, TABLE_CX, TABLE_CY, NPC_X, NPC_Y, NPC_CX, NPC_CY }
}
