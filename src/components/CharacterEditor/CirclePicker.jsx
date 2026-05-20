import React, { useRef, useState } from 'react'
import { useWheelNeedle } from './useWheelNeedle.js'
import { useWheelRings } from './useWheelRings.js'
import { WheelRing } from './WheelRing.jsx'
import { WheelNeedle } from './WheelNeedle.jsx'
import { WheelCenter } from './WheelCenter.jsx'

export function WheelPicker({ value, onChange, onPreview, size = 220, rings, needleConfig, centerDisplay, style }) {
  const svgRef = useRef(null)
  const VB = 240
  const cx = 120
  const cy = 120
  const needleRef = useRef(null)
  const [hovered, setHovered] = useState({})

  const needle = useWheelNeedle(svgRef, cx, cy, needleRef, needleConfig, value, onChange)
  const ringHandlers = useWheelRings(svgRef, cx, cy, rings, value, onChange, onPreview, hovered, setHovered)

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${VB} ${VB}`} style={{ display: 'block', userSelect: 'none', touchAction: 'none', ...style }}>
      {rings.map((ring, ringIdx) => (
        <WheelRing key={ringIdx} ring={ring} ringIdx={ringIdx} handler={ringHandlers[ringIdx]} cx={cx} cy={cy} value={value} hovered={hovered} />
      ))}

      {needle && <WheelNeedle cx={cx} cy={cy} needleRef={needleRef} needleConfig={needleConfig} needle={needle} />}

      <WheelCenter cx={cx} cy={cy} centerDisplay={centerDisplay} value={value} hovered={hovered} />

      <line
        x1={cx}
        y1={cy - (rings[rings.length - 1]?.r2 || 0) - 2}
        x2={cx}
        y2={cy - (rings[0]?.r1 || 0) + 2}
        stroke="rgba(168,85,247,0.5)"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    </svg>
  )
}

export { DateWheel } from './DateWheel.jsx'
export { TimeWheel } from './TimeWheel.jsx'
