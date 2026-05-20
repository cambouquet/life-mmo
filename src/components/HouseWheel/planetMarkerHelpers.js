import { PLANET_GLYPHS, PLANET_NAMES } from '../HoroscopeModal/astroConstants'
import { PLANET_SUMMARY } from './houseWheelData'

export function createPlanetHoverState(pName, col, getInterpretation) {
  return {
    type: 'planet',
    id: pName,
    label: PLANET_NAMES[pName] ?? pName,
    summary: PLANET_SUMMARY[pName],
    glyph: PLANET_GLYPHS[pName],
    color: col,
    desc: getInterpretation(pName),
  }
}

export function getMarkerOpacity(isPHov, isPLocked, isHighlighted) {
  const fill = isPHov || isPLocked ? '33' : isHighlighted ? '25' : '15'
  const stroke = isPHov || isPLocked ? '66' : isHighlighted ? '55' : '33'
  const strokeWidth = isPHov || isPLocked ? '1.5' : isHighlighted ? '1.2' : '0.5'
  const radius = isPHov || isPLocked ? 7 : isHighlighted ? 6 : 5
  const fontSize = isPHov ? 10 : 8
  return { fill, stroke, strokeWidth, radius, fontSize }
}
