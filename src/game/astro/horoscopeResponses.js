import { findAspects } from './aspects.js'
import { ELEMENT_LINES, LUCKY_BY_ELEMENT } from './readingTemplates.js'
import { dominantElement, bestTransitLine } from './horoscopeHelpers.js'
import { buildZodiac, buildCosmic, buildMoonline } from './horoscopeStrings.js'

export function buildUngatedResponse(transitPlacements) {
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
      skyAspects: findAspects(transitPlacements),
      dominantElement: dominantElement(transitPlacements),
    },
  }
}

export function buildGatedResponse(natalPlacements, transitPlacements, transitNatalAspects, skyAspects) {
  const best = bestTransitLine(transitNatalAspects)
  const guidance = best?.text ?? ELEMENT_LINES[dominantElement(transitPlacements)]
  const natalMoonElement = natalPlacements.Moon.element
  const lucky = LUCKY_BY_ELEMENT[natalMoonElement] ?? LUCKY_BY_ELEMENT.Water
  return {
    zodiac: buildZodiac(natalPlacements),
    cosmic: buildCosmic(natalPlacements, transitPlacements),
    moonline: buildMoonline(natalPlacements, transitPlacements),
    guidance,
    lucky,
    gated: false,
    _debug: { transitPlacements, natalPlacements, transitNatalAspects, skyAspects, dominantElement: dominantElement(transitPlacements), guidanceSource: best?.source ?? null },
  }
}
