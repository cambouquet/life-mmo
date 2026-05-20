import * as procedural from './spritesheets/proceduralSheets.js'
import * as external from './spritesheets/externalSheets.js'

export const SHEETS = {
  SS00_FLOOR: procedural.SS00_FLOOR,
  SS01_WALL: procedural.SS01_WALL,
  SS02_MIRROR: procedural.SS02_MIRROR,
  SS03_TABLE: procedural.SS03_TABLE,
  SS04_TORCH: procedural.SS04_TORCH,
  SS05_DOOR: procedural.SS05_DOOR,
  SS06_WARRIOR: external.SS06_WARRIOR,
  SS07_NPC_ELF: external.SS07_NPC_ELF,
}

export function lookupSprite(r, g) {
  for (const sheet of Object.values(SHEETS)) {
    if (sheet.id === r) {
      const row = sheet.rows.find(row => row.g === g)
      return row ? { sheet, row } : null
    }
  }
  return null
}
