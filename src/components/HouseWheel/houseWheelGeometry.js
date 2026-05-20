export const WHEEL_RADIUS = {
  cx: 150, cy: 150,
  BASE_R: 122,
  HOUSE_R1: 126, HOUSE_R2: 138,
  SIGN_R1: 143, SIGN_R2: 158,
  TIME_H_R1: 163, TIME_H_R2: 175,
  TIME_M_R1: 180, TIME_M_R2: 190,
  DATE_M_R1: 195, DATE_M_R2: 207,
  DATE_D_R1: 212, DATE_D_R2: 224,
  DATE_Y_R1: 229, DATE_Y_R2: 241,
  INNER_R: 20,
  GAP_DEG: 1.0,
}

export function computeHouseTally(placements, PLANET_ORDER, SIGN_META) {
  const houseTally = {}
  const rows = PLANET_ORDER.filter(p => placements[p])

  for (const p of rows) {
    const pd = placements[p]
    if (pd?.house) {
      const h = pd.house
      const el = SIGN_META[pd.sign]?.element
      if (!houseTally[h]) houseTally[h] = {}
      if (el) houseTally[h][el] = (houseTally[h][el] || 0) + 1
    }
  }

  const houseTotal = h => houseTally[h] ? Object.values(houseTally[h]).reduce((s,v)=>s+v,0) : 0
  const maxHouseEntry = Object.entries(houseTally).sort((a,b) =>
    Object.values(b[1]).reduce((s,v)=>s+v,0) - Object.values(a[1]).reduce((s,v)=>s+v,0)
  )[0]
  const maxHouseCount = maxHouseEntry ? Object.values(maxHouseEntry[1]).reduce((s,v)=>s+v,0) : 0
  const maxHouseEl = maxHouseEntry
    ? Object.entries(maxHouseEntry[1]).sort((a,b)=>b[1]-a[1])[0][0]
    : 'Air'

  return { houseTally, houseTotal, maxHouseCount, maxHouseEl }
}
