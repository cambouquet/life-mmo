export const LS_COLORS = 'life-mmo-colors-v3'
export const LS_BIRTH = 'life-mmo-birth'
export const LS_NAME = 'life-mmo-name'
export const LS_SLOT = (n) => `life-mmo-slot-${n}`
export const NUM_SLOTS = 3

export function readLS(key) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}
