export const PALETTES = {
  hair: [
    '#0a0a0a','#2a2a2a','#4a4a4a','#787878','#a0a0a0','#c8c8c8','#f0f0f0',
    '#3d1c00','#6b3300','#8b4513','#c68642','#e8c97a','#fffacd',
    '#2c1654','#4a2878','#7a3fa0','#a87fd4','#c9a0f0',
    '#1a2a4a','#2e4a7a','#4a6fa0','#8ab8d4',
    '#3a0a0a','#6a1a1a','#9a2a2a','#c04040',
    '#1a3a1a','#2e5a2e','#4a7a4a',
  ],
  skin: [
    '#fff0e8','#fde8c8','#f8d5a8','#f0c080',
    '#e8a85a','#d4884a','#b8683a','#8b4a2a','#6b3020','#3a1508',
    '#fde0d0','#f5c8b8','#e8a898','#d48878','#b86858','#8b4838',
  ],
  eyes: [
    '#1a3a6a','#2a5a9a','#4a9adf','#8acfff',
    '#1a4a2a','#3a8a4a','#6aba7a','#8acf9a',
    '#4a2a6a','#7a3aa0','#aa5adf','#e0a0ff',
    '#6a3a1a','#aa7a3a','#e0b87a',
    '#4a0a0a','#9a2a2a','#e87878',
    '#606060','#a0a0a0','#d0d0d0',
  ],
  outfit: [
    '#0a0a2a','#1a1a4a','#3a3a8a','#6a6abf',
    '#1a0a2a','#3a1858','#602888','#7a3aa0',
    '#0a2a2a','#0a4a4a','#0a5a5a','#1a6a6a',
    '#2a0a0a','#4a1818','#6a2828','#7a3030',
    '#0a1a0a','#183a18','#285a28','#306030',
    '#2a1800','#4a3000','#6a4a10','#7a5818',
  ],
  stick: [
    '#4a7abf','#6a9adf','#8ab8f5',
    '#7a4abf','#9a6adf','#c090f5',
    '#bf7a4a','#df9a6a','#f5ba90',
    '#4abf7a','#6adf9a','#90f5ba',
    '#bf4a7a','#df6a9a','#f590ba',
    '#bfbf4a','#dfdf6a','#f5f590',
    '#9a2a2a','#bf4a4a','#df7070',
    '#909090','#c0c0c0','#e8e8e8',
  ],
}

export const RINGS = [
  { key: 'hair',   label: 'Hair',  r1: 96,  r2: 116 },
  { key: 'skin',   label: 'Skin',  r1: 78,  r2: 92  },
  { key: 'eyes',   label: 'Eyes',  r1: 52,  r2: 72  },
  { key: 'outfit', label: 'Armor', r1: 34,  r2: 48  },
  { key: 'stick',  label: 'Wand',  r1: 14,  r2: 30  },
]

export const CENTER_R = RINGS[RINGS.length - 1].r1
export const WHEEL_VB = 260
export const WHEEL_CENTER = 130
