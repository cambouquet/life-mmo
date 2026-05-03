// Loads map layer data from pre-generated raw RGBA bytes.
// No browser image pipeline — values are exact, no gamma correction.
//
// Each pixel encodes:
//   R = spritesheet ID
//   G = row within that spritesheet
//   B = color variant
//   A = 255 (tile present) | 0 (empty)

import { MAP_W, MAP_H, LAYER0, LAYER1, LAYER2, LAYER3 } from '../assets/maps/mapData.js'

function b64ToBytes(b64) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

function parseLayer(b64) {
  const data = b64ToBytes(b64)
  const grid = []
  for (let r = 0; r < MAP_H; r++) {
    grid[r] = []
    for (let c = 0; c < MAP_W; c++) {
      const i = (r * MAP_W + c) * 4
      if (data[i + 3] === 0) {
        grid[r][c] = null
      } else {
        grid[r][c] = { ss: data[i], row: data[i + 1], variant: data[i + 2] }
      }
    }
  }
  return grid
}

export function loadMapLayers() {
  return {
    ground:   parseLayer(LAYER0),
    walls:    parseLayer(LAYER1),
    objects:  parseLayer(LAYER2),
    entities: parseLayer(LAYER3),
    width:    MAP_W,
    height:   MAP_H,
  }
}
