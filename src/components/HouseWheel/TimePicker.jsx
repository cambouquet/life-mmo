import React from 'react'
import { WHEEL_RADIUS } from './houseWheelGeometry.js'
import { computeHourSegments, computeMinuteSegments } from './wheelPickers.js'

export function TimePicker({ birthTime, onBirthTimeChange, polarToXY, arc }) {
  const { TIME_H_R1, TIME_H_R2, TIME_M_R1, TIME_M_R2 } = WHEEL_RADIUS

  if (!birthTime || !onBirthTimeChange) return null

  return (
    <>
      {computeHourSegments().map(seg => {
        const isSelected = seg.hour === birthTime.hour
        const [hx, hy] = polarToXY(seg.startDeg + 15, (TIME_H_R1 + TIME_H_R2) / 2)
        return (
          <g
            key={seg.id}
            onClick={() => onBirthTimeChange({ hour: seg.hour, minute: birthTime.minute })}
            style={{ cursor: 'pointer' }}
          >
            <path
              d={arc(seg.startDeg, seg.endDeg, TIME_H_R1, TIME_H_R2)}
              fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
              stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'}
              strokeWidth="0.8"
            />
            <text
              x={hx}
              y={hy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="6"
              fontWeight={isSelected ? '700' : '500'}
              fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}
            >
              {seg.hour}
            </text>
          </g>
        )
      })}

      {computeMinuteSegments().map(seg => {
        const isSelected = seg.minute === birthTime.minute
        const [mx, my] = polarToXY(seg.startDeg + 15, (TIME_M_R1 + TIME_M_R2) / 2)
        return (
          <g
            key={seg.id}
            onClick={() => onBirthTimeChange({ hour: birthTime.hour, minute: seg.minute })}
            style={{ cursor: 'pointer' }}
          >
            <path
              d={arc(seg.startDeg, seg.endDeg, TIME_M_R1, TIME_M_R2)}
              fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
              stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'}
              strokeWidth="0.8"
            />
            {seg.index % 3 === 0 && (
              <text
                x={mx}
                y={my}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="5"
                fontWeight={isSelected ? '700' : '500'}
                fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}
              >
                {String(seg.minute).padStart(2, '0')}
              </text>
            )}
          </g>
        )
      })}
    </>
  )
}
