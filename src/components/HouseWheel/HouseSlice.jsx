import React from 'react'
import { HOUSE_THEMES, HOUSE_LONG } from './houseWheelData.js'
import { WHEEL_RADIUS } from './houseWheelGeometry.js'
import { PlanetMarker } from './PlanetMarker.jsx'

export function HouseSlice({
  houseNumber,
  placements,
  houseCusps,
  ascLong,
  hovered,
  lockedPoint,
  setHovered,
  setLockedPoint,
  polarToXY,
  arc,
  getInterpretation,
  houseTotal,
  housePlanets,
}) {
  const h = houseNumber
  const { INNER_R, BASE_R, HOUSE_R1, HOUSE_R2, SIGN_R2, GAP_DEG } = WHEEL_RADIUS

  const hStartRaw = houseCusps && !isNaN(houseCusps[h - 1]) ? houseCusps[h - 1] - ascLong : (h - 1) * 30
  const hEndRaw = houseCusps && !isNaN(houseCusps[h === 12 ? 0 : h]) ? houseCusps[h === 12 ? 0 : h] - ascLong : h * 30
  const startDeg = ((hStartRaw + 360) % 360) + GAP_DEG / 2
  const endDeg = ((hEndRaw < hStartRaw ? hEndRaw + 360 : hEndRaw) % 720) - GAP_DEG / 2
  const midDeg = (startDeg + (endDeg < startDeg ? endDeg + 360 : endDeg)) / 2
  const n = houseTotal(h)
  const isHov = hovered?.type === 'house' && hovered.id === h

  return (
    <g
      onMouseEnter={() =>
        setHovered({
          type: 'house',
          id: h,
          label: `House ${h}`,
          theme: HOUSE_THEMES[h],
          desc: HOUSE_LONG[h],
          planets: housePlanets,
        })
      }
      onMouseLeave={() => setHovered(null)}
      style={{ cursor: 'default' }}
    >
      <path d={arc(startDeg, endDeg, INNER_R, BASE_R)} fill={isHov ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)'} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

      <path d={arc(startDeg, endDeg, HOUSE_R1, HOUSE_R2)} fill={isHov ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'} stroke={isHov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)'} strokeWidth="1.2" />

      {housePlanets.map(pName => (
        <PlanetMarker
          key={pName}
          pName={pName}
          placements={placements}
          hovered={hovered}
          lockedPoint={lockedPoint}
          setHovered={setHovered}
          setLockedPoint={setLockedPoint}
          polarToXY={polarToXY}
          getInterpretation={getInterpretation}
          ringR={50}
          ascLong={ascLong}
          houseId={h}
          housePlanets={housePlanets}
        />
      ))}

      <text
        x={polarToXY(midDeg, (HOUSE_R1 + HOUSE_R2) / 2)[0]}
        y={polarToXY(midDeg, (HOUSE_R1 + HOUSE_R2) / 2)[1]}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="800"
        fill={n > 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'}
      >
        {h}
      </text>

      {h === 1 && <circle cx={polarToXY(0, SIGN_R2 + 4)[0]} cy={polarToXY(0, SIGN_R2 + 4)[1]} r="2.5" fill="rgba(255,255,255,0.5)" />}
    </g>
  )
}
