import { RINGS, PALETTES } from './cassiopeiaData.js'
import { ringSegPath } from './cassiopeiaGeometry.js'

export function CassiopeiaSegments({ cx, cy, colors, hovState }) {
  return (
    <>
      {RINGS.map((ring, ri) => {
        const pal    = PALETTES[ring.key]
        const n      = pal.length
        const segDeg = 360 / n
        const selHex = colors[ring.key]

        return (
          <g key={ring.key}>
            {pal.map((hex, i) => {
              const startDeg   = i * segDeg
              const endDeg     = startDeg + segDeg
              const isSelected = hex === selHex
              const isHov      = hovState?.ringIdx === ri && hovState?.segIdx === i
              return (
                <path
                  key={i}
                  d={ringSegPath(cx, cy, ring.r1, ring.r2, startDeg, endDeg)}
                  fill={hex}
                  fillOpacity={isSelected ? 1 : isHov ? 0.9 : 0.45}
                  stroke={isSelected ? '#e8d4ff' : isHov ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.07)'}
                  strokeWidth={isSelected ? 1.5 : isHov ? 0.8 : 0.3}
                />
              )
            })}
          </g>
        )
      })}
    </>
  )
}
