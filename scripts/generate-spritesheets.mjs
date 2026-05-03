// Generates spritesheet PNGs for all procedural tile types.
// Run: node scripts/generate-spritesheets.mjs
//
// Output: src/assets/sprites/ss{ID:02x}_{name}.png
// Each spritesheet stacks all its rows vertically.
// Width = tileW, Height = tileH * numRows

import { PNG } from 'pngjs'
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/assets/sprites')
mkdirSync(OUT, { recursive: true })

// ── PNG helpers ────────────────────────────────────────────────────────────
function hex(h) {
  const n = parseInt(h.replace('#',''), 16)
  return [(n>>16)&0xff, (n>>8)&0xff, n&0xff]
}

function makePNG(w, h) {
  const png = new PNG({ width: w, height: h, filterType: -1 })
  png.data.fill(0)
  return png
}

function px(png, x, y, r, g, b, a = 255) {
  const i = (y * png.width + x) * 4
  png.data[i]   = r; png.data[i+1] = g
  png.data[i+2] = b; png.data[i+3] = a
}

function pxh(png, x, y, color, a = 255) {
  const [r, g, b] = hex(color)
  px(png, x, y, r, g, b, a)
}

function fillRect(png, x, y, w, h, color, a = 255) {
  const [r, g, b] = hex(color)
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++)
      px(png, x + dx, y + dy, r, g, b, a)
}

function save(png, name) {
  const buf = PNG.sync.write(png)
  const p = path.join(OUT, name)
  writeFileSync(p, buf)
  console.log(`  wrote ${name}  (${png.width}×${png.height})`)
}

// ── SS00: Floor (16×16 × 4 rows) ──────────────────────────────────────────
// Row 0: floor_a (checkerboard even)
// Row 1: floor_b (checkerboard odd)
// Row 2: floor_void (void gap — impassable darkness)
// Row 3: floor_red (red floor for testing)
function genFloor() {
  const T = 16
  const png = makePNG(T, T * 4)

  // Row 0 — floor_a
  fillRect(png, 0, 0, T, T, '#0e0b1a')
  // subtle pixel noise for texture
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++)
      if ((x + y) % 7 === 0) pxh(png, x, y, '#100d1e')

  // Row 1 — floor_b
  fillRect(png, 0, T, T, T, '#0b0917')
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++)
      if ((x * 3 + y * 2) % 11 === 0) pxh(png, x, T + y, '#0d0b1a')

  // Row 2 — void
  fillRect(png, 0, T*2, T, T, '#06040e')

  // Row 3 — floor_red (bright red for testing)
  fillRect(png, 0, T*3, T, T, '#ff0000')
  for (let y = 0; y < T; y++)
    for (let x = 0; x < T; x++)
      if ((x + y) % 7 === 0) pxh(png, x, T*3 + y, '#cc0000')

  save(png, 'ss00_floor.png')
}

// ── SS01: Wall (16×16 × 4 rows) ───────────────────────────────────────────
// Row 0: wall_solid (side walls)
// Row 1: wall_top   (top edge — bright cap)
// Row 2: wall_face  (bottom edge — darker front face)
// Row 3: wall_corner
function genWall() {
  const T = 16
  const png = makePNG(T, T * 4)

  // ── Row 0: wall_solid ─────────────────────────────────────────────────
  // Dark stone bricks with mortar lines
  const oy = 0
  fillRect(png, 0, oy, T, T, '#0c0a14')
  // Horizontal mortar at y=7
  fillRect(png, 0, oy+7, T, 1, '#0a0816')
  // Brick pattern: two offset rows of bricks
  // Top row bricks: vertical mortar at x=8
  pxh(png, 8, oy+1, '#0a0816')
  pxh(png, 8, oy+2, '#0a0816')
  pxh(png, 8, oy+3, '#0a0816')
  pxh(png, 8, oy+4, '#0a0816')
  pxh(png, 8, oy+5, '#0a0816')
  pxh(png, 8, oy+6, '#0a0816')
  // Bottom row bricks: vertical mortar at x=4, x=12
  pxh(png, 4,  oy+8,  '#0a0816')
  pxh(png, 4,  oy+9,  '#0a0816')
  pxh(png, 4,  oy+10, '#0a0816')
  pxh(png, 4,  oy+11, '#0a0816')
  pxh(png, 4,  oy+12, '#0a0816')
  pxh(png, 4,  oy+13, '#0a0816')
  pxh(png, 4,  oy+14, '#0a0816')
  pxh(png, 12, oy+8,  '#0a0816')
  pxh(png, 12, oy+9,  '#0a0816')
  pxh(png, 12, oy+10, '#0a0816')
  pxh(png, 12, oy+11, '#0a0816')
  pxh(png, 12, oy+12, '#0a0816')
  pxh(png, 12, oy+13, '#0a0816')
  pxh(png, 12, oy+14, '#0a0816')
  // Subtle brick face highlight (top-left of each brick block)
  pxh(png, 0, oy+1, '#161428')
  pxh(png, 0, oy+8, '#161428')
  pxh(png, 9, oy+1, '#161428')
  pxh(png, 5, oy+8, '#161428')
  pxh(png, 13,oy+8, '#161428')
  // Right edge glow hint (facing interior)
  for (let y = 0; y < T; y++) pxh(png, T-1, oy+y, '#161428')

  // ── Row 1: wall_top ───────────────────────────────────────────────────
  // Bright cap — seen from above, lighter to suggest depth
  const ty = T
  fillRect(png, 0, ty, T, T, '#1e1a38')
  // Top highlight row
  fillRect(png, 0, ty, T, 1, '#2a2650')
  // Subtle brick seam
  fillRect(png, 0, ty+7, T, 1, '#181430')
  pxh(png, 8, ty+3, '#181430')
  pxh(png, 4, ty+9, '#181430')
  pxh(png, 12,ty+9, '#181430')
  // Bottom edge darker (transition to wall face)
  fillRect(png, 0, ty+T-1, T, 1, '#0e0c1e')

  // ── Row 2: wall_face ──────────────────────────────────────────────────
  // Front-facing bottom wall — darker, slight bevel at top
  const fy = T * 2
  fillRect(png, 0, fy, T, T, '#100e1c')
  fillRect(png, 0, fy, T, 1, '#1a1830')   // top bevel
  fillRect(png, 0, fy+7, T, 1, '#0e0c18') // mortar
  pxh(png, 8, fy+3, '#0e0c18')
  pxh(png, 4, fy+9, '#0e0c18')
  pxh(png, 12,fy+9, '#0e0c18')

  // ── Row 3: wall_corner ────────────────────────────────────────────────
  // Corner piece — blend of top and side
  const cy = T * 3
  fillRect(png, 0, cy, T, T, '#0e0c1c')
  fillRect(png, 0, cy, T, 2, '#1e1a38')  // top cap
  fillRect(png, 0, cy+2, 2, T-2, '#161428') // left edge
  // Corner pixel
  pxh(png, 0, cy, '#2a2650')

  save(png, 'ss01_wall.png')
}

// ── SS02: Mirror (32×32 × 2 rows) ─────────────────────────────────────────
// Row 0: mirror_left (limited — left room)
// Row 1: mirror_mid  (full — mid room)
// Just the frame/backing; actual reflection drawn at runtime
function genMirror() {
  const W = 32, H = 32
  const png = makePNG(W, H * 2)

  for (let row = 0; row < 2; row++) {
    const oy = row * H
    // Dark glass backing
    fillRect(png, 0, oy, W, H, '#0d0b1e')
    // Frame border (2px)
    fillRect(png, 0, oy, W, 2, '#3a3060')      // top
    fillRect(png, 0, oy+H-2, W, 2, '#2a2050')  // bottom
    fillRect(png, 0, oy, 2, H, '#3a3060')      // left
    fillRect(png, W-2, oy, 2, H, '#2a2050')    // right
    // Glass surface gradient (hand-painted approximation)
    for (let y = 2; y < H-2; y++) {
      const t = y / H
      const r = Math.round(13 + t * 6)
      const g = Math.round(11 + t * 4)
      const b = Math.round(30 + t * 10)
      for (let x = 2; x < W-2; x++) px(png, x, oy+y, r, g, b)
    }
    // Top-left corner highlight
    pxh(png, 2, oy+2, '#6060a0')
    pxh(png, 3, oy+2, '#404080')
    pxh(png, 2, oy+3, '#404080')
    // Variant tint: row 1 (full mirror) gets a slightly warmer border
    if (row === 1) {
      fillRect(png, 0, oy, W, 1, '#503080')
      fillRect(png, 0, oy, 1, H, '#503080')
    }
  }

  save(png, 'ss02_mirror.png')
}

// ── SS03: Table (32×16 × 1 row) ───────────────────────────────────────────
function genTable() {
  const W = 32, H = 16
  const png = makePNG(W, H)

  // Tabletop
  fillRect(png, 0, 0, W, H, '#0a0812')
  // Top surface sheen
  fillRect(png, 1, 1, W-2, 1, '#12101e')
  // Two legs
  fillRect(png, 10, 12, 2, 4, '#1a1530')
  fillRect(png, 20, 12, 2, 4, '#1a1530')
  // Cards — left (face down)
  fillRect(png, 2, 4, 6, 8, '#1a1040')
  pxh(png, 5, 7, '#9040c0')  // gem
  // Cards — center (face up)
  fillRect(png, 13, 3, 6, 9, '#e8e0d0')
  pxh(png, 16, 6, '#8030b0') // symbol center
  pxh(png, 15, 6, '#8030b0')
  pxh(png, 17, 6, '#8030b0')
  pxh(png, 16, 5, '#8030b0')
  pxh(png, 16, 7, '#8030b0')
  // Cards — right (face down)
  fillRect(png, 24, 4, 6, 8, '#1a1040')
  pxh(png, 27, 7, '#9040c0') // gem

  save(png, 'ss03_table.png')
}

// ── SS04: Torch (16×16 × 4 rows) ──────────────────────────────────────────
// Rows 0-1: door1 torches (lit by name / colors)
// Rows 2-3: door2 torches (lit on approach)
// All 4 are visually identical — runtime determines lit/unlit state
function genTorch() {
  const T = 16
  const png = makePNG(T, T * 4)

  for (let row = 0; row < 4; row++) {
    const oy = row * T
    const cx = 8, cy = oy + 8

    // Wall backplate
    fillRect(png, cx-1, cy,   3, 6, '#28243c')
    pxh(png, cx, cy+1, '#3c3858')
    // Sconce arm
    fillRect(png, cx-3, cy-2, 4, 1, '#7880a0')
    pxh(png, cx-3, cy-1, '#484460')
    // Cup
    fillRect(png, cx-1, cy-3, 3, 2, '#7880a0')
    pxh(png, cx, cy-2, '#7070a0')
    // Crystal tube
    fillRect(png, cx-1, cy-7, 2, 4, '#1a0830')
    pxh(png, cx, cy-7, '#3a2060')
    pxh(png, cx-1, cy-6, '#0e0418')
    // Flame (always shown in spritesheet — runtime dims it when unlit)
    pxh(png, cx, cy-10, '#e0c0ff')
    pxh(png, cx-1, cy-9, '#a040e0')
    pxh(png, cx,   cy-9, '#d090ff')
    pxh(png, cx+1, cy-9, '#8820d0')
    pxh(png, cx-1, cy-8, '#7020b0')
    pxh(png, cx,   cy-8, '#b060f0')
    pxh(png, cx+1, cy-8, '#6010a0')
  }

  save(png, 'ss04_torch.png')
}

// ── SS05: Door frame (16×16 × 4 rows) ────────────────────────────────────
// Marks door tile positions — drawn as a subtle arch hint
function genDoor() {
  const T = 16
  const png = makePNG(T, T * 4)

  // door1 top, door1 bottom, door2 top, door2 bottom
  const labels = ['d1t','d1b','d2t','d2b']
  for (let row = 0; row < 4; row++) {
    const oy = row * T
    // Transparent — door frame drawn procedurally at runtime by corridor.js
    // Just store a dim marker pixel for reference
    fillRect(png, 0, oy, T, T, '#00000000'.slice(0,7))  // fully transparent
  }

  save(png, 'ss05_door.png')
}

// ── Run ────────────────────────────────────────────────────────────────────
console.log('Generating spritesheets...')
genFloor()
genWall()
genMirror()
genTable()
genTorch()
genDoor()
console.log('Done.')
