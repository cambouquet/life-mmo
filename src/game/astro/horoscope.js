import { getAllPositions } from './ephemeris.js'
import { findAspects, findTransitToNatal } from './aspects.js'
import { SIGN_META } from './signMeta.js'
import { enrichPlacements } from './horoscopeHelpers.js'
import { getNatalData } from './horoscopeHelpers2.js'
import { buildUngatedResponse, buildGatedResponse } from './horoscopeResponses.js'

export { SIGN_META }

export function generateHoroscope(transitDate = new Date(), birthData = null) {
  const rawTransits = getAllPositions(transitDate)
  const transitPlacements = enrichPlacements(rawTransits)

  if (!birthData || !birthData.date) {
    return buildUngatedResponse(transitPlacements)
  }

  const { rawNatal } = getNatalData(birthData)
  const natalPlacements = enrichPlacements(rawNatal)
  const transitNatalAspects = findTransitToNatal(rawTransits, rawNatal)
  const skyAspects = findAspects(rawTransits)

  return buildGatedResponse(natalPlacements, transitPlacements, transitNatalAspects, skyAspects)
}
