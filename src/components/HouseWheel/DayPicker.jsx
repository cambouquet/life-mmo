import React from 'react'
import { WHEEL_RADIUS } from './houseWheelGeometry.js'
import { computeDaySegments } from './wheelPickers.js'

export function DayPicker({ birthDate, onBirthDateChange, polarToXY, arc }) {
  const { DATE_D_R1, DATE_D_R2 } = WHEEL_RADIUS

  return (
    <>
      {computeDaySegments().map(seg => {
        const isSelected = seg.day === birthDate.day
        const [dx, dy] = polarToXY(seg.startDeg + 5.8, (DATE_D_R1 + DATE_D_R2) / 2)
        return (
          <g
            key={seg.id}
            onClick={() => onBirthDateChange({ ...birthDate, day: seg.day })}
            style={{ cursor: 'pointer' }}
          >
            <path
              d={arc(seg.startDeg, seg.endDeg, DATE_D_R1, DATE_D_R2)}
              fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
              stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'}
              strokeWidth="0.6"
            />
            {seg.day % 5 === 1 && (
              <text
                x={dx}
                y={dy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="4"
                fontWeight={isSelected ? '700' : '500'}
                fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}
              >
                {seg.day}
              </text>
            )}
          </g>
        )
      })}
    </>
  )
}
