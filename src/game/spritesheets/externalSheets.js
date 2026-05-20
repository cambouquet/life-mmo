export const SS06_WARRIOR = {
  id: 0x06,
  name: 'warrior',
  source: 'sprites/03000_magicienne.png',
  tileW: 32,
  tileH: 32,
  rows: [
    { g: 0x00, name: 'down_idle' },
    { g: 0x01, name: 'down_walk' },
    { g: 0x02, name: 'up_idle' },
    { g: 0x03, name: 'up_walk' },
    { g: 0x04, name: 'left_idle' },
    { g: 0x05, name: 'left_walk' },
    { g: 0x06, name: 'right_idle' },
    { g: 0x07, name: 'right_walk' },
  ],
  colorVariants: [
    { b: 0x00, name: 'default' },
  ],
}

export const SS07_NPC_ELF = {
  id: 0x07,
  name: 'npc_elf',
  source: 'sprites/03002_elfeF.png',
  tileW: 32,
  tileH: 32,
  rows: [
    { g: 0x00, name: 'down_idle' },
    { g: 0x01, name: 'down_walk' },
    { g: 0x02, name: 'left_idle' },
    { g: 0x03, name: 'left_walk' },
  ],
  colorVariants: [
    { b: 0x00, name: 'default' },
  ],
}
