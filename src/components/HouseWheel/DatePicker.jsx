import React from 'react'
import { WHEEL_RADIUS } from './houseWheelGeometry.js'
import { computeMonthSegments, computeDaySegments } from './wheelPickers.js'

export function DatePicker({ birthDate, onBirthDateChange, polarToXY, arc }) {
  const { DATE_M_R1, DATE_M_R2, DATE_D_R1, DATE_D_R2, DATE_Y_R1, DATE_Y_R2 } = WHEEL_RADIUS

  if (!birthDate || !onBirthDateChange) return null

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

      <g style={{ cursor: 'default' }}>
        <path
          d={arc(0, 360, DATE_Y_R1, DATE_Y_R2)}
          fill="rgba(168,85,247,0.05)"
          stroke="rgba(168,85,247,0.2)"
          strokeWidth="0.8"
        />
        <text
          x={polarToXY(90, (DATE_Y_R1 + DATE_Y_R2) / 2)[0]}
          y={polarToXY(90, (DATE_Y_R1 + DATE_Y_R2) / 2)[1]}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="6"
          fontWeight="600"
          fill="rgba(200,168,240,0.7)"
        >
          {birthDate.year}
        </text>
      </g>
    </>
  )
}
