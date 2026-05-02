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
// Three fully separate rooms with void gaps between them:
//   Left room  (start): cols 0..LEFT_W-1                         — player + mirror
//   Gap (void):         cols LEFT_W..LEFT_W+GAP_W-1              — impassable void
//   Mid room:           cols LEFT_W+GAP_W..LEFT_W+GAP_W+MID_W-1  — mirror
//   Gap2 (void):        cols MID_START+MID_W..MID_START+MID_W+GAP_W-1
//   Right room (side):  cols RIGHT_START..TOTAL_W-1              — elf + table
// Each room has its own complete set of walls. No shared wall.
export const LEFT_W  = 16   // left room width in tiles
export const GAP_W   = 4    // void gap between rooms
export const MID_W   = 14   // middle room width in tiles
export const RIGHT_W = 14   // right room width in tiles
export const ROOM_H  = 14   // shared height in tiles
export const MID_START   = LEFT_W + GAP_W
export const RIGHT_START = MID_START + MID_W + GAP_W
export const TOTAL_W = LEFT_W + GAP_W + MID_W + GAP_W + RIGHT_W
export const TOTAL_H = ROOM_H

// ── Door position — right wall of left room, vertically centered ──────────────
export const DOOR_C    = LEFT_W - 1          // col 15 — rightmost wall of left room
export const DOOR_R    = Math.floor(ROOM_H / 2) - 1  // row 6
export const DOOR_H    = 2                   // 2 tiles tall

// ── Room tile map  (0=floor, 1=wall, 2=door gap, 3=table, 4=mirror, 6=door opening) ──
export function buildMap(doorOpen = false) {
  const cols = TOTAL_W
  const rows = TOTAL_H
  const map = []

  for (let r = 0; r < rows; r++) {
    map[r] = []
    for (let c = 0; c < cols; c++) {
      const inLeft  = c < LEFT_W
      const inMid   = c >= MID_START && c < MID_START + MID_W
      const inRight = c >= RIGHT_START && c < RIGHT_START + RIGHT_W

      if (inLeft) {
        const edge = r === 0 || r === rows - 1 || c === 0 || c === LEFT_W - 1
        map[r][c] = edge ? 1 : 0
      } else if (inMid) {
        const lc = c - MID_START
        const edge = r === 0 || r === rows - 1 || lc === 0 || lc === MID_W - 1
        map[r][c] = edge ? 1 : 0
      } else if (inRight) {
        const lc = c - RIGHT_START
        const edge = r === 0 || r === rows - 1 || lc === 0 || lc === RIGHT_W - 1
        map[r][c] = edge ? 1 : 0
      } else {
        map[r][c] = 5   // void gap — impassable
      }
    }
  }

  // Door opening in right wall of left room
  if (doorOpen) {
    for (let dr = 0; dr < DOOR_H; dr++) {
      map[DOOR_R + dr][DOOR_C] = 6  // passable door opening
    }
  }

  // Left room mirror — 2 tiles wide, centered at top of left room (row 1)
  const mirrorC = Math.floor(LEFT_W / 2) - 1   // col 7
  const mirrorR = 1
  for (let dr = 0; dr <= 1; dr++) {
    map[mirrorR + dr][mirrorC]     = 4
    map[mirrorR + dr][mirrorC + 1] = 4
  }

  // Mid room mirror — 2 tiles wide, centered at top of mid room (row 1)
  const mirror2C = MID_START + Math.floor(MID_W / 2) - 1
  const mirror2R = 1
  for (let dr = 0; dr <= 1; dr++) {
    map[mirror2R + dr][mirror2C]     = 4
    map[mirror2R + dr][mirror2C + 1] = 4
  }

  // Divination table — 2 tiles wide, in right room interior
  const tableC = RIGHT_START + 3
  const tableR = Math.floor(rows / 2) - 2
  map[tableR][tableC]     = 3
  map[tableR][tableC + 1] = 3

  return { map, mirrorC, mirrorR, mirror2C, mirror2R, tableC, tableR }
}

// ── Torch positions — two door torches flanking the right wall opening ────────
// top torch lights when name is set; bottom torch lights when colors are chosen
export const TORCHES = [
  { c: LEFT_W - 1, r: DOOR_R - 1 },   // top — lit by name
  { c: LEFT_W - 1, r: DOOR_R + DOOR_H }, // bottom — lit by colors
]

// ── Colour palettes (defined in palette.js) ───────────────────────────────────
export { PAL, PC } from './palette.jsx'
