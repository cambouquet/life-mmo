// ── Game constants ────────────────────────────────────────────────────────────
export const TILE       = 16;
export const DRAW_SCALE = 2;
export const SCALE = 1;
export const COLS  = 20;
export const ROWS  = 14;
export const W     = COLS * TILE;   // 320
export const H     = ROWS * TILE;   // 224
export const SPEED = 80;            // px/s (logical)

// ── Room tile map  (0=floor, 1=wall, 2=door gap) ─────────────────────────────
export function buildMap(cols = COLS, rows = ROWS, mirrorC, mirrorR, tableC, tableR) {
  const map = []
  for (let r = 0; r < rows; r++) {
    map[r] = []
    for (let c = 0; c < cols; c++) {
      const edge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1
      map[r][c] = edge ? 1 : 0
    }
  }
  map[rows - 1][Math.floor(cols / 2)]     = 2
  map[rows - 1][Math.floor(cols / 2) + 1] = 2

  // Mirror — 2×4 tiles portrait
  // Only the front face (dr=0, bottom row) is tile 4 (solid).
  // The rows behind it (dr=-3 to -1) stay floor so the player can walk behind the mirror.
  const mc = mirrorC ?? Math.floor(cols / 2)
  const mr = mirrorR ?? 3
  for (let dc = 0; dc <= 1; dc++) {
    const cc = mc + dc
    if (mr >= 0 && mr < rows && cc >= 0 && cc < cols) map[mr][cc] = 4
  }

  // Furniture — use provided coords or default to fixed position
  const tc = tableC ?? 9
  const tr = tableR ?? 2
  if (tr > 0 && tr < rows - 1 && tc > 0 && tc + 1 < cols - 1) {
    map[tr][tc]     = 3
    map[tr][tc + 1] = 3
  }
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
export { PAL, PC } from './palette.jsx'
