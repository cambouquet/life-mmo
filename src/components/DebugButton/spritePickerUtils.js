import { CATEGORY_ID_MAP, spriteColors } from './spritePickerData.js'

export function getCategoryId(category) {
  return CATEGORY_ID_MAP[category]
}

export function getSpriteColor(ss, row, spriteColorOverrides, variant = 0) {
  const colorKey = ss === 0x00 ? variant : row
  const overrideKey = ss === 0x00 ? `${ss}_v${variant}` : `${ss}_${row}`

  if (spriteColorOverrides?.[overrideKey]) return spriteColorOverrides[overrideKey]
  if (ss === 0x00) return spriteColors.floor[colorKey] ?? spriteColors.floor[0]
  if (ss === 0x01) return spriteColors.wall[colorKey] ?? spriteColors.wall[0]
  return '#0a0612'
}
