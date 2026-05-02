// ── Game constants ────────────────────────────────────────────────────────────
export const TILE       = 16;
export const DRAW_SCALE = 2;
export const SCALE = 1;
export const COLS  = 20;
export const ROWS  = 14;
export const W     = COLS * TILE;   // 320
export const H     = ROWS * TILE;   // 224
export const SPEED = 80;            // px/s (logical)

// ── Room layout ───────────────────────────────────────────────────────────────
// Two fully separate rooms with a void gap between them:
//   Left room  (start): cols 0..LEFT_W-1              — player + mirror
//   Gap (void):         cols LEFT_W..LEFT_W+GAP_W-1   — impassable void
//   Right room (side):  cols LEFT_W+GAP_W..TOTAL_W-1  — elf + table
// Each room has its own complete set of walls. No shared wall.
// Doors will open later.
export const LEFT_W  = 16   // left room width in tiles
export const GAP_W   = 4    // void gap between rooms
export const RIGHT_W = 14   // right room width in tiles
export const ROOM_H  = 14   // shared height in tiles
export const TOTAL_W = LEFT_W + GAP_W + RIGHT_W
export const TOTAL_H = ROOM_H
export const RIGHT_START = LEFT_W + GAP_W   // first col of right room

// ── Room tile map  (0=floor, 1=wall, 2=door gap, 3=table, 4=mirror) ───────────
export function buildMap() {
  const cols = TOTAL_W
  const rows = TOTAL_H
  const map = []

  for (let r = 0; r < rows; r++) {
    map[r] = []
    for (let c = 0; c < cols; c++) {
      const inLeft  = c < LEFT_W
      const inRight = c >= RIGHT_START && c < RIGHT_START + RIGHT_W

      if (inLeft) {
        const edge = r === 0 || r === rows - 1 || c === 0 || c === LEFT_W - 1
        map[r][c] = edge ? 1 : 0
      } else if (inRight) {
        const lc = c - RIGHT_START
        const edge = r === 0 || r === rows - 1 || lc === 0 || lc === RIGHT_W - 1
        map[r][c] = edge ? 1 : 0
      } else {
        map[r][c] = 5   // void gap — impassable but renders as pure dark void
      }
    }
  }

  // Mirror — 2 tiles wide, centered at top of left room (row 1)
  const mirrorC = Math.floor((LEFT_W - 2) / 2)
  const mirrorR = 1
  map[mirrorR][mirrorC]     = 4
  map[mirrorR][mirrorC + 1] = 4

  // Divination table — 2 tiles wide, in right room interior
  const tableC = RIGHT_START + 3
  const tableR = Math.floor(rows / 2) - 2
  map[tableR][tableC]     = 3
  map[tableR][tableC + 1] = 3

  return { map, mirrorC, mirrorR, tableC, tableR }
}

// ── Torch positions ───────────────────────────────────────────────────────────
export const TORCHES = [
  { c: 3,          r: 0 },
  { c: LEFT_W - 4, r: 0 },
  { c: 0,          r: Math.floor(ROOM_H / 2) },
  { c: LEFT_W - 1, r: Math.floor(ROOM_H / 2) },
]

// ── Colour palettes (defined in palette.js) ───────────────────────────────────
export { PAL, PC } from './palette.jsx'
