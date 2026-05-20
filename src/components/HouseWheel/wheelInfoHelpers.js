import { SIGN_META } from '../../game/astro/horoscope'
import { ELEMENT_COLOR, PLANET_GLYPHS, PLANET_NAMES } from '../HoroscopeModal/astroConstants'

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

export function getActivePoint(lockedPoint, hovered, placements, HOUSE_THEMES, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG, PLANET_NAMES, PLANET_GLYPHS, PLANET_SUMMARY) {
  if (hovered?.type === 'planet' && hovered.id === lockedPoint) {
    return { ...hovered, locked: true }
  }
  return hovered || {
    type: 'planet',
    id: lockedPoint,
    label: PLANET_NAMES[lockedPoint] ?? lockedPoint,
    glyph: PLANET_GLYPHS[lockedPoint],
    color: ELEMENT_COLOR[SIGN_META[placements[lockedPoint]?.sign]?.element] ?? '#fff',
    desc: getInterpretation(lockedPoint, placements, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG),
    summary: PLANET_SUMMARY[lockedPoint],
    locked: true
  }
}

export function getPlanetDegreesLabel(pd, HOUSE_THEMES) {
  const deg = Math.floor(pd.degrees)
  const theme = HOUSE_THEMES[pd.house]
  return `${pd.sign} ${deg}°${pd.house ? ` · H${pd.house}${theme ? ` (${theme})` : ''}` : ''}`
}
