import { SIGN_META } from '../../game/astro/horoscope.js'

export function computeTallies(rows, displayPlacements) {
  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  const modeTally = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  const houseTally = {}

  for (const p of rows) {
    const pData = displayPlacements[p]
    if (!pData) continue
    const meta = SIGN_META[pData.sign]
    if (meta) {
      tally[meta.element] = (tally[meta.element] || 0) + 1
      modeTally[meta.mode] = (modeTally[meta.mode] || 0) + 1
    }
    if (pData.house) {
      const h = pData.house
      if (!houseTally[h]) houseTally[h] = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
      if (meta) houseTally[h][meta.element] = (houseTally[h][meta.element] || 0) + 1
    }
  }

  return { tally, modeTally, houseTally }
}

export function computeHouseTally(rows, displayPlacements) {
  const hTally = {}
  rows.forEach(pName => {
    const p = displayPlacements[pName]
    if (p && p.house) {
      hTally[p.house] = (hTally[p.house] || 0) + 1
    }
  })
  const maxH = Object.entries(hTally).sort((a, b) => b[1] - a[1])[0]
  return {
    maxCount: maxH ? maxH[1] : 0,
    houseId: maxH ? maxH[0] : null,
  }
}

export function formatBirthLine(birthData) {
  const dateObj = birthData?.date ? new Date(birthData.date + 'T' + (birthData.time || '12:00')) : null
  return [
    dateObj ? dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
    birthData?.time || null,
    birthData?.city?.name || null,
  ]
    .filter(Boolean)
    .join(' · ')
}
