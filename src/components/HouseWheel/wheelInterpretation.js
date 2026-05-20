export function getInterpretation(pName, placements, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG) {
  const pd = placements[pName]
  if (!pd) return ''
  const deg = Math.floor(pd.degrees)
  const decan = deg <= 9 ? '1st decan' : deg <= 19 ? '2nd decan' : '3rd decan'
  const hName = HOUSE_NAMES[pd.house] ?? `House ${pd.house}`
  const hLong = HOUSE_LONG[pd.house] ?? ''
  const sLong = SIGN_DESC_LONG[pd.sign] ?? pd.sign
  return `${pName} in ${pd.sign} at ${deg}° (${decan}), ${hName}. ${sLong} ${hLong}`
}
