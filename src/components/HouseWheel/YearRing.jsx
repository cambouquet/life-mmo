import React from 'react'
import { WHEEL_RADIUS } from './houseWheelGeometry.js'

export function YearRing({ birthDate, polarToXY, arc }) {
  const { DATE_Y_R1, DATE_Y_R2 } = WHEEL_RADIUS
  const [yx, yy] = polarToXY(90, (DATE_Y_R1 + DATE_Y_R2) / 2)

  return (
    <g style={{ cursor: 'default' }}>
      <path
        d={arc(0, 360, DATE_Y_R1, DATE_Y_R2)}
        fill="rgba(168,85,247,0.05)"
        stroke="rgba(168,85,247,0.2)"
        strokeWidth="0.8"
      />
      <text
        x={yx}
        y={yy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="6"
        fontWeight="600"
        fill="rgba(200,168,240,0.7)"
      >
        {birthDate.year}
      </text>
    </g>
  )
}
