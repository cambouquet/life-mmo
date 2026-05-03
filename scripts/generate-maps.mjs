// Generates map layer PNGs for the game world.
// Run: node scripts/generate-maps.mjs
//
// Pixel encoding (RGBA):
//   R = spritesheet ID
//   G = row within that spritesheet (sprite type)
//   B = color variant
//   A = 255 (opaque) or 0 (nothing on this layer)
//
// Layers:
//   layer0_ground   — floor and void tiles
//   layer1_walls    — wall tiles only
//   layer2_objects  — mirrors, table, torches, door markers
//   layer3_entities — NPC and player spawn points

import { PNG } from 'pngjs'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/assets/maps')
mkdirSync(OUT, { recursive: true })

// Load visualization colors
const colorsPath = path.join(__dirname, '../src/game/config/mapVisualizationColors.json')
const COLORS = JSON.parse(readFileSync(colorsPath, 'utf8'))

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
}

// ── World constants ────────────────────────────────────────────────────────
const LEFT_W      = 16
const GAP_W       = 2
const MID_W       = 14
const RIGHT_W     = 14
const ROOM_H      = 14
const MID_START   = LEFT_W + GAP_W
const RIGHT_START = MID_START + MID_W + GAP_W
const TOTAL_W     = LEFT_W + GAP_W + MID_W + GAP_W + RIGHT_W
const TOTAL_H     = ROOM_H

const DOOR_C  = LEFT_W - 1
const DOOR_R  = Math.floor(ROOM_H / 2) - 1
const DOOR_H  = 2
const DOOR2_C = MID_START + MID_W - 1
const DOOR2_R = DOOR_R
const DOOR2_H = DOOR_H

// ── Spritesheet IDs ────────────────────────────────────────────────────────
const SS_FLOOR   = 0x00
const SS_WALL    = 0x01
const SS_MIRROR  = 0x02
const SS_TABLE   = 0x03
const SS_TORCH   = 0x04
const SS_DOOR    = 0x05
const SS_WARRIOR = 0x06
const SS_NPC_ELF = 0x07

// Floor row IDs
const FLOOR_A    = 0x00
const FLOOR_B    = 0x01
const FLOOR_VOID = 0x02
const FLOOR_RED  = 0x03

// Wall row IDs
const WALL_TOP    = 0x01
const WALL_FACE   = 0x02
const WALL_SOLID  = 0x00

const DEFAULT = 0x00

// ── PNG helpers ────────────────────────────────────────────────────────────
function makePNG(w, h) {
  const png = new PNG({ width: w, height: h, filterType: -1 })
  // Default: all transparent
  png.data.fill(0)
  return png
}

function setPixel(png, x, y, r, g, b) {
  const i = (y * png.width + x) * 4
  png.data[i]     = r
  png.data[i + 1] = g
  png.data[i + 2] = b
  png.data[i + 3] = 255
}

function setPixelFromColor(png, x, y, hexColor) {
  const [r, g, b] = hexToRgb(hexColor)
  setPixel(png, x, y, r, g, b)
}

function save(png, name) {
  const buf = PNG.sync.write(png)
  const p = path.join(OUT, `${name}.png`)
  writeFileSync(p, buf)
  console.log(`  wrote ${name}.png  (${png.width}×${png.height})`)
}

// Converts a PNG to a compact { w, h, data } where data is base64-encoded
// raw RGBA bytes — no browser image pipeline, no gamma correction.
function pngToRawB64(png) {
  // png.data is already the raw RGBA Uint8Array
  return Buffer.from(png.data).toString('base64')
}

// ── Tile classification ────────────────────────────────────────────────────
function tileKind(c, r) {
  const inLeft  = c < LEFT_W
  const inMid   = c >= MID_START && c < MID_START + MID_W
  const inRight = c >= RIGHT_START && c < RIGHT_START + RIGHT_W

  if (inLeft)  return (r === 0 || r === ROOM_H-1 || c === 0 || c === LEFT_W-1)           ? 'wall' : 'floor'
  if (inMid)   return (r === 0 || r === ROOM_H-1 || c-MID_START === 0 || c-MID_START === MID_W-1) ? 'wall' : 'floor'
  if (inRight) return (r === 0 || r === ROOM_H-1 || c-RIGHT_START === 0 || c-RIGHT_START === RIGHT_W-1) ? 'wall' : 'floor'
  return 'void'
}

function wallRow(c, r) {
  if (r === 0)           return WALL_TOP
  if (r === ROOM_H - 1)  return WALL_FACE
  return WALL_SOLID
}

// ── Layer 0: Ground ────────────────────────────────────────────────────────
function genLayer0() {
  const png = makePNG(TOTAL_W, TOTAL_H)
  const spriteSheets = COLORS.spritesheets

  for (let r = 0; r < TOTAL_H; r++) {
    for (let c = 0; c < TOTAL_W; c++) {
      const kind = tileKind(c, r)
      let ss, row, visualColor

      if (kind === 'void') {
        ss = SS_FLOOR
        row = FLOOR_VOID
        visualColor = '#000000'
      } else if (c === 5 && r === 7) {
        // Single red floor tile for testing
        ss = SS_FLOOR
        row = FLOOR_RED
        visualColor = '#ff0000'
      } else {
        ss = SS_FLOOR
        row = (c + r) % 2 === 0 ? FLOOR_A : FLOOR_B
        visualColor = spriteSheets['0x00']
      }

      // Encode actual sprite data in RGBA (used by mapData.js)
      setPixel(png, c, r, ss, row, DEFAULT)
    }
  }
  save(png, 'layer0_ground')
  return png
}

// ── Layer 1: Walls ─────────────────────────────────────────────────────────
function genLayer1() {
  const png = makePNG(TOTAL_W, TOTAL_H)

  for (let r = 0; r < TOTAL_H; r++) {
    for (let c = 0; c < TOTAL_W; c++) {
      if (tileKind(c, r) === 'wall') {
        // Door columns carry torches — no wall tile, torches stand alone
        if (c === DOOR_C || c === MID_START) continue
        const row = wallRow(c, r)
        setPixel(png, c, r, SS_WALL, row, DEFAULT)
      }
    }
  }
  save(png, 'layer1_walls')
  return png
}

// ── Layer 2: Objects ───────────────────────────────────────────────────────
function genLayer2() {
  const png = makePNG(TOTAL_W, TOTAL_H)

  // Mirror 1 — left room, origin tile (top-left of 2×2)
  const m1c = Math.floor(LEFT_W / 2) - 1
  setPixel(png, m1c, 1, SS_MIRROR, 0x00, DEFAULT)

  // Mirror 2 — mid room, origin tile
  const m2c = MID_START + Math.floor(MID_W / 2) - 1
  setPixel(png, m2c, 1, SS_MIRROR, 0x01, DEFAULT)

  // Table — right room, 2×1, origin tile
  const tableC = RIGHT_START + 3
  const tableR = Math.floor(ROOM_H / 2) - 2
  setPixel(png, tableC, tableR, SS_TABLE, 0x00, DEFAULT)

  // Torches — door 1 (col DOOR_C, flanking the opening)
  setPixel(png, DOOR_C, DOOR_R - 1,      SS_TORCH, 0x00, DEFAULT)
  setPixel(png, DOOR_C, DOOR_R + DOOR_H, SS_TORCH, 0x01, DEFAULT)

  // Torches — door 2 (left wall of mid room, col MID_START)
  setPixel(png, MID_START, DOOR2_R - 1,       SS_TORCH, 0x02, DEFAULT)
  setPixel(png, MID_START, DOOR2_R + DOOR2_H, SS_TORCH, 0x03, DEFAULT)

  // Door 1 opening tiles
  setPixel(png, DOOR_C, DOOR_R,     SS_DOOR, 0x00, DEFAULT)
  setPixel(png, DOOR_C, DOOR_R + 1, SS_DOOR, 0x01, DEFAULT)

  // Door 2 opening tiles (left wall of mid room)
  setPixel(png, MID_START, DOOR2_R,     SS_DOOR, 0x02, DEFAULT)
  setPixel(png, MID_START, DOOR2_R + 1, SS_DOOR, 0x03, DEFAULT)

  save(png, 'layer2_objects')
  return png
}

// ── Layer 3: Entities (spawn points) ──────────────────────────────────────
function genLayer3() {
  const png = makePNG(TOTAL_W, TOTAL_H)

  // Player spawn — left room, near mirror
  const m1c = Math.floor(LEFT_W / 2) - 1
  setPixel(png, m1c, Math.floor(TOTAL_H / 2), SS_WARRIOR, 0x02 /* up_idle */, DEFAULT)

  // NPC — right room, next to table
  const npcC = RIGHT_START + 5
  const npcR = Math.floor(ROOM_H / 2) - 2
  setPixel(png, npcC, npcR, SS_NPC_ELF, 0x00 /* down_idle */, DEFAULT)

  save(png, 'layer3_entities')
  return png
}

// ── Run ────────────────────────────────────────────────────────────────────
console.log(`Generating map layers (${TOTAL_W}×${TOTAL_H} tiles)...`)
const png0 = genLayer0()
const png1 = genLayer1()
const png2 = genLayer2()
const png3 = genLayer3()

// Emit raw RGBA data as a JS module so the browser never decodes the PNG
// through the image pipeline (which applies gamma correction and corrupts values).
const jsOut = path.join(OUT, 'mapData.js')
writeFileSync(jsOut, `// AUTO-GENERATED — do not edit. Run: node scripts/generate-maps.mjs
export const MAP_W = ${TOTAL_W}
export const MAP_H = ${TOTAL_H}
export const LAYER0 = '${pngToRawB64(png0)}'
export const LAYER1 = '${pngToRawB64(png1)}'
export const LAYER2 = '${pngToRawB64(png2)}'
export const LAYER3 = '${pngToRawB64(png3)}'
`)
console.log(`  wrote mapData.js`)
console.log('Done.')
