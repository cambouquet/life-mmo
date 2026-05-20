export const LS_COLORS = 'life-mmo-colors-v3'
export const LS_BIRTH = 'life-mmo-birth'
export const LS_NAME = 'life-mmo-name'
export const LS_MAP_EDITS = 'life-mmo-map-edits-v2'
export const LS_SPRITE_COLORS = 'life-mmo-sprite-colors-v2'

export const DEFAULT_COLORS = {
  hair: '#ffffff',
  skin: '#ffffff',
  eyes: '#ffffff',
  outfit: '#ffffff',
  stick: '#ffffff'
}

export const DEFAULT_BIRTH = {
  date: '1988-01-27',
  time: '03:55',
  city: { name: 'Paris XIII', country: 'FR', lat: 48.83, lng: 2.36, tz: 1 }
}

export function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
