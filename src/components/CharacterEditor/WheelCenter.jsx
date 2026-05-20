import React from 'react'

export function WheelCenter({ cx, cy, centerDisplay, value, hovered }) {
  if (!centerDisplay) return null

  return (
    <>
      {centerDisplay.lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={cy + line.offset}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={line.size}
          fontFamily="monospace"
          fontWeight={line.weight}
          fill={line.color}
        >
          {line.text(value, hovered)}
        </text>
      ))}
    </>
  )
}
