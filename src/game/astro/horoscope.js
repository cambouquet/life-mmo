import { getAllPositions, getPlacidusHouses, daysSinceJ2000 } from './ephemeris.js'
import { findAspects, findTransitToNatal } from './aspects.js'
import { SIGN_META } from './signMeta.js'
import { LUCKY_BY_ELEMENT, ELEMENT_LINES } from './readingTemplates.js'
import { enrichPlacements, dominantElement, bestTransitLine } from './horoscopeHelpers.js'
import { buildZodiac, buildCosmic, buildMoonline } from './horoscopeStrings.js'

export { SIGN_META }

export function generateHoroscope(transitDate = new Date(), birthData = null) {
  const rawTransits = getAllPositions(transitDate)
  const transitPlacements = enrichPlacements(rawTransits)

  if (!birthData || !birthData.date) {
    return {
      zodiac: { name: transitPlacements.Sun.sign, symbol: transitPlacements.Sun.symbol },
      cosmic: null,
      moonline: null,
      guidance: null,
      lucky: null,
      gated: true,
      _debug: {
        transitPlacements,
        natalPlacements: null,
        transitNatalAspects: [],
        skyAspects: findAspects(rawTransits),
        dominantElement: dominantElement(transitPlacements),
      },
    }
  }

  const [yr, mo, dy] = birthData.date.split('-').map(Number)
  const timeSplit = (birthData.time || '12:00').split(':').map(Number)
  const bh = timeSplit[0] || 0
  const bm = timeSplit[1] || 0
  const bs = timeSplit[2] || 0
  const tzOffset = birthData.city?.tz ?? 0
  const birthUTC = new Date(Date.UTC(yr, mo - 1, dy, bh - tzOffset, bm, bs))

  const location = birthData.city ? { lat: birthData.city.lat, lng: birthData.city.lng } : null
  const rawNatal = getAllPositions(birthUTC, location)
  const natalHouses = location ? getPlacidusHouses(daysSinceJ2000(birthUTC), location.lat, location.lng) : null
  const natalPlacements = enrichPlacements(rawNatal, natalHouses)

  const transitNatalAspects = findTransitToNatal(rawTransits, rawNatal)
  const skyAspects = findAspects(rawTransits)

  const zodiac = buildZodiac(natalPlacements)
  const cosmic = buildCosmic(natalPlacements, transitPlacements)
  const moonline = buildMoonline(natalPlacements, transitPlacements)

  const best = bestTransitLine(transitNatalAspects)
  const guidance = best?.text ?? ELEMENT_LINES[dominantElement(transitPlacements)]

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
