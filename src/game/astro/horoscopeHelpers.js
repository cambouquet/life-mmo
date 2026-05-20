import { longitudeToSign, longitudeToSymbol, degreesInSign, getHouseNumber } from './ephemeris.js'
import { SIGN_META } from './signMeta.js'
import { TRANSIT_NATAL_LINES, ASPECT_NATURE_LINES, ELEMENT_LINES } from './readingTemplates.js'

export function enrichPlacements(rawPositions, houseCusps = null) {
  const placements = {}
  for (const [planet, lon] of Object.entries(rawPositions)) {
    const sign = longitudeToSign(lon)
    placements[planet] = {
      longitude: lon,
      sign,
      symbol: longitudeToSymbol(lon),
      degrees: degreesInSign(lon),
      element: SIGN_META[sign]?.element ?? '?',
      house: houseCusps ? getHouseNumber(lon, houseCusps) : null,
    }
  }

  if (placements.NorthNode) {
    const snLon = (placements.NorthNode.longitude + 180) % 360
    const snSign = longitudeToSign(snLon)
    placements.SouthNode = {
      longitude: snLon,
      sign: snSign,
      symbol: longitudeToSymbol(snLon),
      degrees: degreesInSign(snLon),
      element: SIGN_META[snSign]?.element ?? '?',
      house: houseCusps ? getHouseNumber(snLon, houseCusps) : null,
    }
  }

  return placements
}

export function dominantElement(placements) {
  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  for (const p of Object.values(placements)) {
    if (SIGN_META[p.sign]) tally[SIGN_META[p.sign].element]++
  }
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
}

export function bestTransitLine(aspects) {
  for (const asp of aspects) {
    const key = `${asp.transit}:${asp.aspect.name}:${asp.natal}`
    if (TRANSIT_NATAL_LINES[key]) return { text: TRANSIT_NATAL_LINES[key], source: asp }
  }
  if (aspects.length > 0) {
    return { text: ASPECT_NATURE_LINES[aspects[0].aspect.nature], source: aspects[0] }
  }
  return null
}
