import SPRITESHEETS_DATA from '../../game/config/spritesheets.json'

export const LS_MAP_BACKUPS = 'life-mmo-map-backups'

export function loadBackups() {
  try {
    const data = localStorage.getItem(LS_MAP_BACKUPS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveBackups(backups) {
  localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify(backups))
}

export const COLL_VALUES = {
  0: 'floor',
  1: 'wall',
  5: 'void',
  6: 'door',
}

export const SPRITESHEET_VALUES = {
  0x00: SPRITESHEETS_DATA['0x00'].name,
  0x01: SPRITESHEETS_DATA['0x01'].name,
  0x02: SPRITESHEETS_DATA['0x02'].name,
  0x03: SPRITESHEETS_DATA['0x03'].name,
  0x04: SPRITESHEETS_DATA['0x04'].name,
}
