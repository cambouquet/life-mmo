// Spritesheet registry — every visual tile type in the game.
//
// Pixel encoding in map PNGs:
//   R = spritesheet ID (0–255)
//   G = row within that spritesheet (which sprite/tile variant)
//   B = color variant code (0 = default)
//
// A fully transparent pixel (alpha=0) means "nothing on this layer".

export const SHEETS = {
  // ── SS00: Floor tiles ──────────────────────────────────────────────────────
  // 16×16 procedural tiles, no external image
  SS00_FLOOR: {
    id:     0x00,
    name:   'floor',
    source: null,        // procedural
    tileW:  16,
    tileH:  16,
    rows: [
      { g: 0x00, name: 'floor_a',     color: '#0e0b1a' },  // checkerboard even
      { g: 0x01, name: 'floor_b',     color: '#0b0917' },  // checkerboard odd
      { g: 0x02, name: 'floor_void',  color: '#06040e' },  // void/gap (impassable)
      { g: 0x03, name: 'floor_door',  color: '#0e0b1a' },  // door corridor floor
    ],
  },

  // ── SS01: Wall tiles ───────────────────────────────────────────────────────
  SS01_WALL: {
    id:     0x01,
    name:   'wall',
    source: null,        // procedural
    tileW:  16,
    tileH:  16,
    rows: [
      { g: 0x00, name: 'wall_solid',  color: '#0c0a14' },
      { g: 0x01, name: 'wall_top',    color: '#1e1a38' },  // top-edge wall
      { g: 0x02, name: 'wall_face',   color: '#100e1c' },  // front-facing wall
      { g: 0x03, name: 'wall_corner', color: '#0c0a14' },  // corner
    ],
  },

  // ── SS02: Mirror ──────────────────────────────────────────────────────────
  // 2×2 tile object, procedurally drawn in mirror.jsx
  SS02_MIRROR: {
    id:     0x02,
    name:   'mirror',
    source: null,
    tileW:  32,
    tileH:  32,
    rows: [
      { g: 0x00, name: 'mirror_left',  note: 'left room mirror (limited)' },
      { g: 0x01, name: 'mirror_mid',   note: 'mid room mirror (full)' },
    ],
  },

  // ── SS03: Table ───────────────────────────────────────────────────────────
  // 2×1 tile object, procedurally drawn in table.jsx
  SS03_TABLE: {
    id:     0x03,
    name:   'table',
    source: null,
    tileW:  32,
    tileH:  16,
    rows: [
      { g: 0x00, name: 'table_divination' },
    ],
  },

  // ── SS04: Torch ───────────────────────────────────────────────────────────
  // 1×1 tile wall-mounted object, drawn in torch.jsx
  SS04_TORCH: {
    id:     0x04,
    name:   'torch',
    source: null,
    tileW:  16,
    tileH:  16,
    rows: [
      { g: 0x00, name: 'torch_name',    note: 'door1 top — lit when name set' },
      { g: 0x01, name: 'torch_colors',  note: 'door1 bottom — lit when colors set' },
      { g: 0x02, name: 'torch_door2_t', note: 'door2 top — lit on approach' },
      { g: 0x03, name: 'torch_door2_b', note: 'door2 bottom — lit on approach' },
    ],
  },

  // ── SS05: Door frame ──────────────────────────────────────────────────────
  // The wall opening tile, used on layer2 to mark door positions
  SS05_DOOR: {
    id:     0x05,
    name:   'door',
    source: null,
    tileW:  16,
    tileH:  16,
    rows: [
      { g: 0x00, name: 'door1_top'    },
      { g: 0x01, name: 'door1_bottom' },
      { g: 0x02, name: 'door2_top'    },
      { g: 0x03, name: 'door2_bottom' },
    ],
  },

  // ── SS06: Warrior (player) ────────────────────────────────────────────────
  // External spritesheet: 03000_magicienne.png (320×256, 32×32 frames)
  // 10 cols × 8 rows
  // Row layout: 0=down, 1=down_walk, 2=up, 3=up_walk, 4=left, 5=left_walk, 6=right, 7=right_walk
  SS06_WARRIOR: {
    id:     0x06,
    name:   'warrior',
    source: 'sprites/03000_magicienne.png',
    tileW:  32,
    tileH:  32,
    rows: [
      { g: 0x00, name: 'down_idle'  },
      { g: 0x01, name: 'down_walk'  },
      { g: 0x02, name: 'up_idle'    },
      { g: 0x03, name: 'up_walk'    },
      { g: 0x04, name: 'left_idle'  },
      { g: 0x05, name: 'left_walk'  },
      { g: 0x06, name: 'right_idle' },
      { g: 0x07, name: 'right_walk' },
    ],
    // B = color variant (0 = default palette, future: alternate outfits)
    colorVariants: [
      { b: 0x00, name: 'default' },
    ],
  },

  // ── SS07: NPC — Elf ───────────────────────────────────────────────────────
  // External spritesheet: 03002_elfeF.png (256×128, 32×32 frames)
  // 8 cols × 4 rows
  SS07_NPC_ELF: {
    id:     0x07,
    name:   'npc_elf',
    source: 'sprites/03002_elfeF.png',
    tileW:  32,
    tileH:  32,
    rows: [
      { g: 0x00, name: 'down_idle'  },
      { g: 0x01, name: 'down_walk'  },
      { g: 0x02, name: 'left_idle'  },
      { g: 0x03, name: 'left_walk'  },
    ],
    colorVariants: [
      { b: 0x00, name: 'default' },
    ],
  },
}

// Reverse lookup: given (r, g) → sheet + row descriptor
export function lookupSprite(r, g) {
  for (const sheet of Object.values(SHEETS)) {
    if (sheet.id === r) {
      const row = sheet.rows.find(row => row.g === g)
      return row ? { sheet, row } : null
    }
  }
  return null
}
