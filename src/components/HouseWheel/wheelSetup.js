import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_ORDER } from '../HoroscopeModal/astroConstants.js'
import { createWheelGeometry } from './wheelGeometry.js'
import { WHEEL_RADIUS, computeHouseTally } from './houseWheelGeometry.js'
import { getInterpretation } from './wheelInterpretation.js'

export function setupWheelData(placements, houseCusps, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG) {
  if (!placements) return null

  const { cx, cy } = WHEEL_RADIUS
  const { polarToXY, arc } = createWheelGeometry(cx, cy)

  const rows = PLANET_ORDER.filter(p => placements[p])
  const ascLong = houseCusps ? houseCusps[0] : 0
  const { houseTotal } = computeHouseTally(placements, PLANET_ORDER, SIGN_META)

  return { cx, cy, polarToXY, arc, rows, ascLong, houseTotal }
}

export function getWheelInterpretation(pName, placements, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG) {
  return getInterpretation(pName, placements, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG)
}
