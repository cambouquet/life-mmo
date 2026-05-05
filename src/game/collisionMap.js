import { GAP_W, DOOR_C, DOOR_R, DOOR_H, DOOR2_C, DOOR2_R, DOOR2_H } from './constants.jsx'

const SS_MIRROR = 0x02
const SS_TABLE  = 0x03

// Builds a 2D collision map from parsed layer data + door open states.
// Tile values: 0=floor, 1=wall, 3=table, 4=mirror, 5=void, 6=door opening
export function buildCollisionMap(layers, door1Open, door2Open) {
  const rows = layers.height
  const cols = layers.width
  const map  = []

  for (let r = 0; r < rows; r++) {
    map[r] = []
    for (let c = 0; c < cols; c++) {
      const g = layers.ground[r][c]
      const w = layers.walls[r][c]
      const o = layers.objects[r][c]
      if (w) {
        map[r][c] = 1   // wall
      } else if (g?.row === 0x01) {
        map[r][c] = 5   // void (FLOOR_VOID row)
      } else if (o?.ss === SS_MIRROR || o?.ss === SS_TABLE) {
        // Origin pixel only — footprint expansion done in post-pass below
        map[r][c] = o.ss === SS_MIRROR ? 4 : 3
      } else if (g) {
        map[r][c] = 0   // floor
      } else {
        map[r][c] = 5   // nothing = impassable
      }
    }
  }

  // Expand multi-tile object footprints from their single origin pixel
  // Mirror: 2×2 tiles. Table: 2×1 tiles.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const o = layers.objects[r][c]
      if (o?.ss === SS_MIRROR) {
        // Fill 2×2 block from origin
        if (r + 1 < rows && map[r+1][c]   === 0) map[r+1][c]   = 4
        if (c + 1 < cols && map[r][c+1]   === 0) map[r][c+1]   = 4
        if (r + 1 < rows && c + 1 < cols && map[r+1][c+1] === 0) map[r+1][c+1] = 4
      } else if (o?.ss === SS_TABLE) {
        // Fill 2×1 block from origin
        if (c + 1 < cols && map[r][c+1] === 0) map[r][c+1] = 3
      }
    }
  }

  const openDoor = (dc, dr, dh) => {
    for (let dr2 = 0; dr2 < dh; dr2++)
      for (let dc2 = 0; dc2 <= GAP_W + 1; dc2++)
        map[dr + dr2][dc + dc2] = 6
  }
  if (door1Open) openDoor(DOOR_C,  DOOR_R,  DOOR_H)
  if (door2Open) openDoor(DOOR2_C, DOOR2_R, DOOR2_H)

  return map
}
