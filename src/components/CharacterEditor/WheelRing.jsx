import React from 'react'
import { polarToXY, ringArc } from './wheelGeometry.js'

const ACCENT = 'rgba(168,85,247,'

export function WheelRing({ ring, ringIdx, handler, cx, cy, value, hovered }) {
  return (
    <g
      key={ringIdx}
      onPointerDown={handler.onPointerDown}
      onPointerMove={handler.onPointerMove}
      onPointerUp={handler.onPointerUp}
      onPointerLeave={handler.onPointerLeave}
      style={{ cursor: 'grab' }}
    >
      <g ref={handler.groupRef}>
        {Array.from({ length: ring.count }, (_, i) => {
          const ang = (i / ring.count) * 360
          const isSelected = ring.isSelected(value, i)
          const isHov = hovered[ringIdx] === i
          const [tx, ty] = polarToXY(cx, cy, ang, (ring.r1 + ring.r2) * 0.5)
          return (
            <g key={i}>
              <path
                d={ringArc(cx, cy, ring.r1, ring.r2, ang, ang + 360 / ring.count)}
                fill={isSelected ? `${ACCENT}0.6)` : isHov ? 'rgba(250,220,255,0.15)' : `${ACCENT}0.06)`}
                stroke={isSelected ? `${ACCENT}0.9)` : isHov ? 'rgba(250,220,255,0.6)' : `${ACCENT}0.15)`}
                strokeWidth={isSelected || isHov ? 1 : 0.5}
              />
              {(isSelected || isHov || ring.shouldShowLabel?.(i)) && (
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isSelected ? 7 : isHov ? 6.5 : 5.5}
                  fontFamily="monospace"
                  fontWeight={isSelected || isHov ? 800 : 400}
                  fill={isSelected ? '#e8d4ff' : isHov ? '#fff' : 'rgba(255,255,255,0.35)'}
                >
                  {ring.label(i)}
                </text>
              )}
            </g>
          )
        })}
      </g>
    </g>
  )
}
