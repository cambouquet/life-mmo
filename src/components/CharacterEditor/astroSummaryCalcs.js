import { SIGN_META } from '../../game/astro/horoscope.js'

export function calculateElementTally(natalPlacements) {
  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  Object.values(natalPlacements).forEach(p => {
    const meta = SIGN_META[p.sign]
    if (meta?.element) tally[meta.element]++
  })
  return tally
}

export function calculateModeTally(natalPlacements) {
  const modeTally = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  Object.values(natalPlacements).forEach(p => {
    const meta = SIGN_META[p.sign]
    if (meta?.mode) modeTally[meta.mode]++
  })
  return modeTally
}

export function calculateHouseTally(natalPlacements) {
  const hTally = {}
  Object.values(natalPlacements).forEach(p => {
    if (p.house) hTally[p.house] = (hTally[p.house] || 0) + 1
  })
  return hTally
}

export function getMax(obj) {
  const entries = Object.entries(obj)
  return entries.length > 0 ? entries.sort((a, b) => b[1] - a[1])[0] : null
}
