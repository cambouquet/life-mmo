// ── Game constants ────────────────────────────────────────────────────────────
export const TILE  = 16;
export const SCALE = 3;
export const COLS  = 20;
export const ROWS  = 14;
export const W     = COLS * TILE;   // 320
export const H     = ROWS * TILE;   // 224
export const SPEED = 80;            // px/s (logical)

// ── Room tile map  (0=floor, 1=wall, 2=door gap) ─────────────────────────────
export function buildMap() {
  const map = []
  for (let r = 0; r < ROWS; r++) {
    map[r] = []
    for (let c = 0; c < COLS; c++) {
      const edge = r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1
      map[r][c] = edge ? 1 : 0
    }
  }
  map[ROWS - 1][Math.floor(COLS / 2)]     = 2
  map[ROWS - 1][Math.floor(COLS / 2) + 1] = 2
  // Divination table — 2 tiles wide, upper centre (type 3 = solid furniture)
  map[2][9]  = 3
  map[2][10] = 3
  return map
}

// ── Torch positions ───────────────────────────────────────────────────────────
export const TORCHES = [
  { c: 3,          r: 0 },
  { c: COLS - 4,   r: 0 },
  { c: 0,          r: Math.floor(ROWS / 2) },
  { c: COLS - 1,   r: Math.floor(ROWS / 2) },
]

// ── Colour palettes (defined in palette.js) ───────────────────────────────────
export { PAL, PC } from './palette.js'
