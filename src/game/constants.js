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

// ── Colour palettes ───────────────────────────────────────────────────────────
export const PAL = {
  floorA:   '#1e1630',
  floorB:   '#221a38',
  wall:     '#0d0b1a',
  wallTop:  '#3a2868',
  wallFace: '#18123a',
  rug:      '#2a1848',
  rugBord:  '#4a2878',
  rugInner: '#382060',
  light:    '#ffe8a022',
  torch:    '#ffb830',
  torchGlo: '#ff840055',
  wood:     '#5c3a1e',
  woodDark: '#3d2510',
  metal:    '#7a8898',
  shadow:   '#00000060',
}

export const PC = {
  skin:      '#f5c9a0',
  armor:     '#4a5868',
  armorLt:   '#7a8fa8',
  armorDk:   '#2a3040',
  belt:      '#8a6020',
  boot:      '#2a1e10',
  eye:       '#1a0a30',
  helm:      '#3a4858',
  helmLt:    '#607080',
  visor:     '#1a2530',
  sword:     '#c8d8e8',
  swordHlt:  '#c8901a',
  swordGrp:  '#4a2810',
  shield:    '#3a4858',
  shieldRim: '#c8901a',
  cape:      '#8a1010',
  capeDk:    '#5a0808',
}
