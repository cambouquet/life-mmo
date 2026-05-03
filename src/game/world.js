import {
  TILE,
  LEFT_W, TOTAL_H, GAP_W, MID_W, MID_START, RIGHT_W, ROOM_H,
  DOOR_C, DOOR_R, DOOR_H,
  DOOR2_C, DOOR2_R, DOOR2_H,
  TORCHES, TORCHES2,
} from './constants.jsx'
import { loadMapLayers }       from './mapLoader.js'
import { buildCollisionMap }   from './collisionMap.js'

// Spritesheet IDs used in layer2/layer3 PNGs
const SS_MIRROR  = 0x02
const SS_TABLE   = 0x03
const SS_TORCH   = 0x04

// Finds the first pixel in a layer grid matching a given spritesheet ID + row
function findSprite(grid, ss, row) {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c]?.ss === ss && grid[r][c]?.row === row)
        return { r, c }
  return null
}

// Finds all pixels matching a spritesheet ID
function findAllSprites(grid, ss) {
  const hits = []
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c]?.ss === ss)
        hits.push({ r, c, row: grid[r][c].row })
  return hits
}

export function buildWorld(playerStateRef) {
  const layers = loadMapLayers()

  // Extract object positions from layer2 (objects)
  const obj = layers.objects

  const mirror1Pixel  = findSprite(obj, SS_MIRROR, 0x00)
  const mirror2Pixel  = findSprite(obj, SS_MIRROR, 0x01)
  const tablePixel    = findSprite(obj, SS_TABLE,  0x00)
  const torchPixels   = findAllSprites(obj, SS_TORCH).sort((a, b) => a.row - b.row)

  // Tile coords → pixel coords
  const mirrorC  = mirror1Pixel?.c ?? Math.floor(LEFT_W / 2) - 1
  const mirrorR  = mirror1Pixel?.r ?? 1
  const mirror2C = mirror2Pixel?.c ?? MID_START + Math.floor(MID_W / 2) - 1
  const mirror2R = mirror2Pixel?.r ?? 1
  const tableC   = tablePixel?.c ?? (MID_START + MID_W + GAP_W + 3)
  const tableR   = tablePixel?.r ?? (Math.floor(ROOM_H / 2) - 2)

  // Torches from PNG (rows 0-1 = door1, rows 2-3 = door2)
  const torchesFromPng = torchPixels.map(t => ({ c: t.c, r: t.r, row: t.row }))
  const TORCHES_LIVE  = torchesFromPng.filter(t => t.row <= 0x01)
  const TORCHES2_LIVE = torchesFromPng.filter(t => t.row >= 0x02)

  // Door 1
  const DOOR_WX = DOOR_C * TILE + TILE / 2
  const DOOR_WY = (DOOR_R + DOOR_H / 2) * TILE
  const wallX   = DOOR_C * TILE
  const gapY1   = DOOR_R * TILE
  const gapY2   = (DOOR_R + DOOR_H) * TILE

  // Door 2 — left wall of room 2 (col MID_START), approached from the corridor
  const DOOR2_WX = MID_START * TILE + TILE / 2
  const DOOR2_WY = (DOOR2_R + DOOR2_H / 2) * TILE
  const wall2X   = MID_START * TILE
  const gap2Y1   = DOOR2_R * TILE
  const gap2Y2   = (DOOR2_R + DOOR2_H) * TILE

  // Rooms (for bounds-of-light)
  const ROOMS = [
    { x: 0,                                   y: 0, w: LEFT_W * TILE, h: ROOM_H * TILE },
    { x: MID_START * TILE,                    y: 0, w: MID_W  * TILE, h: ROOM_H * TILE },
    { x: (MID_START + MID_W + GAP_W) * TILE, y: 0, w: RIGHT_W * TILE, h: ROOM_H * TILE },
  ]

  // Mirror 1
  const MIRROR_TX = mirrorC  * TILE
  const MIRROR_TY = mirrorR  * TILE
  const MIRROR_CX = MIRROR_TX + 16
  const MIRROR_CY = MIRROR_TY + 16

  // Mirror 2
  const MIRROR2_TX = mirror2C * TILE
  const MIRROR2_TY = mirror2R * TILE
  const MIRROR2_CX = MIRROR2_TX + 16
  const MIRROR2_CY = MIRROR2_TY + 16

  // Table
  const TABLE_X  = tableC * TILE
  const TABLE_Y  = tableR * TILE
  const TABLE_CX = TABLE_X + 16
  const TABLE_CY = TABLE_Y + 8

  // NPC — 2 tiles right of table origin
  const NPC_X  = (tableC + 2) * TILE
  const NPC_Y  = tableR * TILE
  const NPC_CX = NPC_X + 8
  const NPC_CY = NPC_Y + 8

  // Initial collision map (both doors closed)
  const map = buildCollisionMap(layers, false, false)

  // Player spawn
  const pcStartX = MIRROR_CX - 9
  const pcStartY = Math.floor(TOTAL_H / 2) * TILE
  const saved    = playerStateRef?.current
  const player   = {
    x:          saved?.x      ?? pcStartX,
    y:          saved?.y      ?? pcStartY,
    w:          TILE,
    h:          TILE,
    frame:      0,
    frameTick:  0,
    facing:     saved?.facing ?? 'up',
    moving:     false,
    jumpHeight: 0,
    jumpVel:    0,
    jumping:    false,
  }

  return {
    layers,
    map,
    player,
    // Doors
    DOOR_WX, DOOR_WY, wallX, gapY1, gapY2,
    DOOR2_WX, DOOR2_WY, wall2X, gap2Y1, gap2Y2,
    ROOMS,
    // Mirrors
    MIRROR_TX, MIRROR_TY, MIRROR_CX, MIRROR_CY,
    MIRROR2_TX, MIRROR2_TY, MIRROR2_CX, MIRROR2_CY,
    // Table + NPC
    TABLE_X, TABLE_Y, TABLE_CX, TABLE_CY,
    NPC_X, NPC_Y, NPC_CX, NPC_CY,
    // Torches (from PNG or fallback to constants)
    TORCHES:  TORCHES_LIVE.length  ? TORCHES_LIVE  : TORCHES,
    TORCHES2: TORCHES2_LIVE.length ? TORCHES2_LIVE : TORCHES2,
    TILE,
  }
}
