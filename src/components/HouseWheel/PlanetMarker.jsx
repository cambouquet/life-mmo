import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { ELEMENT_COLOR, PLANET_GLYPHS, PLANET_NAMES } from '../HoroscopeModal/astroConstants.js'
import { PLANET_SUMMARY } from './houseWheelData.js'

export function PlanetMarker({
  pName,
  placements,
  hovered,
  lockedPoint,
  setHovered,
  setLockedPoint,
  polarToXY,
  getInterpretation,
  ringR,
  ascLong,
  houseId,
  housePlanets,
}) {
  const pd = placements[pName]
  const col = ELEMENT_COLOR[SIGN_META[pd.sign]?.element] ?? '#fff'
  const pDeg = (pd.longitude - ascLong + 360) % 360
  const [px, py] = polarToXY(pDeg, ringR)
  const isPHov = hovered?.type === 'planet' && hovered.id === pName
  const isPLocked = lockedPoint === pName
  const isHighlighted =
    (hovered?.type === 'house' && hovered.id === houseId) ||
    (hovered?.type === 'sign' && hovered.planets?.includes(pName))

  return (
    <g
      onMouseEnter={e => {
        e.stopPropagation()
        setHovered({
          type: 'planet',
          id: pName,
          label: PLANET_NAMES[pName] ?? pName,
          summary: PLANET_SUMMARY[pName],
          glyph: PLANET_GLYPHS[pName],
          color: col,
          desc: getInterpretation(pName),
        })
      }}
      onMouseLeave={() => setHovered(null)}
      onClick={e => {
        e.stopPropagation()
        setLockedPoint(lockedPoint === pName ? null : pName)
      }}
      style={{ cursor: 'pointer' }}
    >
      <circle
        cx={px}
        cy={py}
        r={isPHov || isPLocked ? 7 : isHighlighted ? 6 : 5}
        fill={`${col}${isPHov || isPLocked ? '33' : isHighlighted ? '25' : '15'}`}
        stroke={`${col}${isPHov || isPLocked ? '66' : isHighlighted ? '55' : '33'}`}
        strokeWidth={isPHov || isPLocked ? '1.5' : isHighlighted ? '1.2' : '0.5'}
      />
      <text
        x={px}
        y={py}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isPHov ? 10 : 8}
        fill={col}
        fontWeight="900"
        style={{ pointerEvents: 'none' }}
      >
        {PLANET_GLYPHS[pName]}
      </text>
    </g>
  )
}
