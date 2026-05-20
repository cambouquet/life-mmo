import SPRITESHEETS_DATA from '../../game/config/spritesheets.json'
import spriteColors from '../../game/config/spriteColors.json'

export const SPRITESHEETS = {
  0x00: SPRITESHEETS_DATA['0x00'],
  0x01: SPRITESHEETS_DATA['0x01'],
  0x02: SPRITESHEETS_DATA['0x02'],
  0x03: SPRITESHEETS_DATA['0x03'],
  0x04: SPRITESHEETS_DATA['0x04'],
}

export const SPRITE_NAMES = {
  '0x00_0': 'floor_a',
  '0x00_1': 'floor_b',
  '0x00_2': 'void',
  '0x00_3': 'floor_red',
  '0x00_4': 'floor_darkred',
  '0x01_0': 'wall_solid',
  '0x01_1': 'wall_top',
  '0x01_2': 'wall_face',
  '0x01_3': 'wall_corner',
  '0x02_0': 'mirror_left',
  '0x02_1': 'mirror_full',
  '0x03_0': 'table',
  '0x04_0': 'torch_d1_top',
  '0x04_1': 'torch_d1_bot',
  '0x04_2': 'torch_d2_top',
  '0x04_3': 'torch_d2_bot',
}

export const WALL_LABELS = {
  0: { short: '▓ Solid', full: 'Solid Wall' },
  1: { short: '↑ Top', full: 'Light at Top' },
  2: { short: '⬤ Face', full: 'Light at Face' },
  3: { short: '⬉ Corner', full: 'Light at Corner' },
}

export const CATEGORIES = [
  { key: 'floor', label: 'Ground' },
  { key: 'wall', label: 'Wall' },
  { key: 'table', label: 'Object' },
  { key: 'torch', label: 'Entity' }
]

export const CATEGORY_ID_MAP = {
  floor: 0x00,
  wall: 0x01,
  mirror: 0x02,
  table: 0x03,
  torch: 0x04,
}

export { spriteColors }
