import { SIGN_META } from '../../game/astro/horoscope.js'
import { ELEMENT_COLOR, PLANET_GLYPHS } from '../HoroscopeModal/astroConstants.js'
import { createPlanetHoverState, getMarkerOpacity } from './planetMarkerHelpers'

export function PlanetMarker({ pName, placements, hovered, lockedPoint, setHovered, setLockedPoint, polarToXY, getInterpretation, ringR, ascLong, houseId, housePlanets }) {
  const pd = placements[pName]
  const col = ELEMENT_COLOR[SIGN_META[pd.sign]?.element] ?? '#fff'
  const [px, py] = polarToXY((pd.longitude - ascLong + 360) % 360, ringR)
  const isPHov = hovered?.type === 'planet' && hovered.id === pName
  const isPLocked = lockedPoint === pName
  const isHighlighted = (hovered?.type === 'house' && hovered.id === houseId) || (hovered?.type === 'sign' && hovered.planets?.includes(pName))
  const { fill, stroke, strokeWidth, radius, fontSize } = getMarkerOpacity(isPHov, isPLocked, isHighlighted)

  return (
    <g onMouseEnter={e => { e.stopPropagation(); setHovered(createPlanetHoverState(pName, col, getInterpretation)) }}
      onMouseLeave={() => setHovered(null)} onClick={e => { e.stopPropagation(); setLockedPoint(lockedPoint === pName ? null : pName) }} style={{ cursor: 'pointer' }}>
      <circle cx={px} cy={py} r={radius} fill={`${col}${fill}`} stroke={`${col}${stroke}`} strokeWidth={strokeWidth} />
      <text x={px} y={py} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill={col} fontWeight="900" style={{ pointerEvents: 'none' }}>{PLANET_GLYPHS[pName]}</text>
    </g>
  )
}
