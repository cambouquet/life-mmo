export const HOUSE_THEMES_FIXED = {
  1: 'self', 2: 'resources', 3: 'mind', 4: 'home', 5: 'pleasure', 6: 'service',
  7: 'partnership', 8: 'transformation', 9: 'expansion', 10: 'career', 11: 'community', 12: 'hidden',
}

export function calculateHouseTally(displayPlacements, rows) {
  const hTally = {}
  rows.forEach(pName => {
    const p = displayPlacements[pName]
    if (p?.house) hTally[p.house] = (hTally[p.house] || 0) + 1
  })
  const maxH = Object.entries(hTally).length > 0 ? Object.entries(hTally).sort((a, b) => b[1] - a[1])[0] : null
  return { hTally, maxH, hId: maxH?.[0] || null, maxHCount: maxH?.[1] || 0 }
}
