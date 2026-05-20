export const SS00_FLOOR = {
  id: 0x00,
  name: 'floor',
  source: null,
  tileW: 16,
  tileH: 16,
  rows: [
    { g: 0x00, name: 'floor_a', color: '#0e0b1a' },
    { g: 0x01, name: 'floor_b', color: '#0b0917' },
    { g: 0x02, name: 'floor_void', color: '#06040e' },
    { g: 0x03, name: 'floor_door', color: '#0e0b1a' },
    { g: 0x04, name: 'floor_stone', color: '#5c5c5c' },
  ],
}

export const SS01_WALL = {
  id: 0x01,
  name: 'wall',
  source: null,
  tileW: 16,
  tileH: 16,
  rows: [
    { g: 0x00, name: 'wall_solid', color: '#0c0a14' },
    { g: 0x01, name: 'wall_top', color: '#1e1a38' },
    { g: 0x02, name: 'wall_face', color: '#100e1c' },
    { g: 0x03, name: 'wall_corner', color: '#0c0a14' },
  ],
}

export const SS02_MIRROR = {
  id: 0x02,
  name: 'mirror',
  source: null,
  tileW: 32,
  tileH: 32,
  rows: [
    { g: 0x00, name: 'mirror_left', note: 'left room mirror (limited)' },
    { g: 0x01, name: 'mirror_mid', note: 'mid room mirror (full)' },
  ],
}

export const SS03_TABLE = {
  id: 0x03,
  name: 'table',
  source: null,
  tileW: 32,
  tileH: 16,
  rows: [
    { g: 0x00, name: 'table_divination' },
  ],
}

export const SS04_TORCH = {
  id: 0x04,
  name: 'torch',
  source: null,
  tileW: 16,
  tileH: 16,
  rows: [
    { g: 0x00, name: 'torch_name', note: 'door1 top — lit when name set' },
    { g: 0x01, name: 'torch_colors', note: 'door1 bottom — lit when colors set' },
    { g: 0x02, name: 'torch_door2_t', note: 'door2 top — lit on approach' },
    { g: 0x03, name: 'torch_door2_b', note: 'door2 bottom — lit on approach' },
  ],
}

export const SS05_DOOR = {
  id: 0x05,
  name: 'door',
  source: null,
  tileW: 16,
  tileH: 16,
  rows: [
    { g: 0x00, name: 'door1_top' },
    { g: 0x01, name: 'door1_bottom' },
    { g: 0x02, name: 'door2_top' },
    { g: 0x03, name: 'door2_bottom' },
  ],
}
