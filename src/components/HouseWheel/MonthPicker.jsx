import React from 'react'
import { WHEEL_RADIUS } from './houseWheelGeometry.js'
import { computeMonthSegments } from './wheelPickers.js'

export function MonthPicker({ birthDate, onBirthDateChange, polarToXY, arc }) {
  const { DATE_M_R1, DATE_M_R2 } = WHEEL_RADIUS

  return (
    <>
      {computeMonthSegments().map(seg => {
        const isSelected = seg.month === birthDate.month
        const [mx, my] = polarToXY(seg.startDeg + 15, (DATE_M_R1 + DATE_M_R2) / 2)
        return (
          <g
            key={seg.id}
            onClick={() => onBirthDateChange({ ...birthDate, month: seg.month })}
            style={{ cursor: 'pointer' }}
          >
            <path
              d={arc(seg.startDeg, seg.endDeg, DATE_M_R1, DATE_M_R2)}
              fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
              stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'}
              strokeWidth="0.8"
            />
            <text
              x={mx}
              y={my}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="5"
              fontWeight={isSelected ? '700' : '500'}
              fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}
            >
              {seg.label}
            </text>
          </g>
        )
      })}
    </>
  )
}
