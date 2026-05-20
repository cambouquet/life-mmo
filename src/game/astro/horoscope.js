import { getAllPositions, getPlacidusHouses, getHouseNumber, longitudeToSign, longitudeToSymbol, degreesInSign, daysSinceJ2000 } from './ephemeris.js'
import { findAspects, findTransitToNatal } from './aspects.js'
import { SIGN_META } from './signMeta.js'
import { TRANSIT_NATAL_LINES, ASPECT_NATURE_LINES, ELEMENT_LINES, LUCKY_BY_ELEMENT } from './readingTemplates.js'

export { SIGN_META }

function enrichPlacements(rawPositions, houseCusps = null) {
  const placements = {}
  for (const [planet, lon] of Object.entries(rawPositions)) {
    const sign = longitudeToSign(lon)
    placements[planet] = {
      longitude: lon,
      sign,
      symbol:    longitudeToSymbol(lon),
      degrees:   degreesInSign(lon),
      element:   SIGN_META[sign]?.element ?? '?',
      house:     houseCusps ? getHouseNumber(lon, houseCusps) : null,
    }
  }

  // Add South Node (directly opposite North Node)
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

function dominantElement(placements) {
  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  for (const p of Object.values(placements)) {
    if (SIGN_META[p.sign]) tally[SIGN_META[p.sign].element]++
  }
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
}

function bestTransitLine(aspects) {
  for (const asp of aspects) {
    const key = `${asp.transit}:${asp.aspect.name}:${asp.natal}`
    if (TRANSIT_NATAL_LINES[key]) return { text: TRANSIT_NATAL_LINES[key], source: asp }
  }
  if (aspects.length > 0) {
    return { text: ASPECT_NATURE_LINES[aspects[0].aspect.nature], source: aspects[0] }
  }
  return null
}

// ── Public API ────────────────────────────────────────────────────────────────
// birthData: { date: 'YYYY-MM-DD', time: 'HH:MM', city: { lat, lng, tz, name, country } }
// All fields optional — more fields = more accurate/personal reading.
export function generateHoroscope(transitDate = new Date(), birthData = null) {
  const rawTransits = getAllPositions(transitDate)
  const transitPlacements = enrichPlacements(rawTransits)

  // No birth data — cannot do a personal reading
  if (!birthData || !birthData.date) {
    return {
      zodiac:    { name: transitPlacements.Sun.sign, symbol: transitPlacements.Sun.symbol },
      cosmic:    null,
      moonline:  null,
      guidance:  null,
      lucky:     null,
      gated:     true,
      _debug: {
        transitPlacements,
        natalPlacements: null,
        transitNatalAspects: [],
        skyAspects: findAspects(rawTransits),
        dominantElement: dominantElement(transitPlacements),
      },
    }
  }

  // Build exact birth UTC Date from date + time + timezone
  const [yr, mo, dy] = birthData.date.split('-').map(Number)
  const timeSplit    = (birthData.time || '12:00').split(':').map(Number)
  const bh = timeSplit[0] || 0
  const bm = timeSplit[1] || 0
  const bs = timeSplit[2] || 0
  const tzOffset     = birthData.city?.tz ?? 0
  const birthUTC     = new Date(Date.UTC(yr, mo - 1, dy, bh - tzOffset, bm, bs))

  const location = birthData.city ? { lat: birthData.city.lat, lng: birthData.city.lng } : null
  const rawNatal = getAllPositions(birthUTC, location)
  const natalHouses = location ? getPlacidusHouses(daysSinceJ2000(birthUTC), location.lat, location.lng) : null
  const natalPlacements = enrichPlacements(rawNatal, natalHouses)

  const transitNatalAspects = findTransitToNatal(rawTransits, rawNatal)
  const skyAspects          = findAspects(rawTransits)

  // zodiac — natal Sun sign + rising sign if available
  const rising = natalPlacements.Ascendant
  const zodiac = {
    name:    natalPlacements.Sun.sign,
    symbol:  natalPlacements.Sun.symbol,
    rising:  rising ? rising.sign   : null,
    risingSymbol: rising ? rising.symbol : null,
  }

  // cosmic — natal Sun sign + today's Sun position
  const sunMeta   = SIGN_META[natalPlacements.Sun.sign]
  const tSunSign  = transitPlacements.Sun.sign
  const cosmic = tSunSign === natalPlacements.Sun.sign
    ? `The Sun moves through your natal sign, ${natalPlacements.Sun.sign} — your sense of purpose burns at its brightest.`
    : `The Sun passes through ${tSunSign} while your natal Sun rests in ${natalPlacements.Sun.sign}, casting ${SIGN_META[tSunSign]?.element?.toLowerCase() ?? 'celestial'} light on your ${sunMeta?.quality ?? ''} nature.`

  // moonline — today's Moon transiting natal Moon's sign area
  const tMoonSign = transitPlacements.Moon.sign
  const nMoonSign = natalPlacements.Moon.sign
  const moonline = tMoonSign === nMoonSign
    ? `The Moon passes through your natal ${nMoonSign} — emotional memory and present feeling merge.`
    : `The Moon moves through ${tMoonSign}, touching your natal ${nMoonSign} instincts from a ${SIGN_META[tMoonSign]?.quality ?? ''} angle.`

  // guidance — best transit-to-natal aspect
  const best = bestTransitLine(transitNatalAspects)
  const guidance = best?.text ?? ELEMENT_LINES[dominantElement(transitPlacements)]

  // lucky — keyed by natal Moon element (stable, identity-based)
  const natalMoonElement = natalPlacements.Moon.element
  const lucky = LUCKY_BY_ELEMENT[natalMoonElement] ?? LUCKY_BY_ELEMENT.Water

  return {
    zodiac,
    cosmic,
    moonline,
    guidance,
    lucky,
    gated: false,
    _debug: {
      transitPlacements,
      natalPlacements,
      natalHouses,
      transitNatalAspects,
      skyAspects,
      dominantElement: dominantElement(transitPlacements),
      guidanceSource: best?.source ?? null,
    },
  }
}
