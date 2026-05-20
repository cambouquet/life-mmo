import { useRef, useState, useCallback } from 'react'
import { WHEEL_VB, WHEEL_CENTER } from './cassiopeiaData'
import { CassiopeiaSegments } from './CassiopeiaSegments'
import { CassiopeiaCenter } from './CassiopeiaCenter'
import { createCassiopeiaHitTest, createCassiopeiaHandlers } from './cassiopeiaHandlers'

export function CassiopeiaWheel({ colors, onChange, onPreview, onRandom, size = 260 }) {
  const cx = WHEEL_CENTER, cy = WHEEL_CENTER
  const svgRef = useRef(null)
  const [hov, setHov] = useState(null)

  const hitTest = useCallback(createCassiopeiaHitTest(svgRef, cx, cy), [])
  const { onPointerMove, onPointerLeave, onPointerDown } = createCassiopeiaHandlers(svgRef, colors, onPreview, onChange, hitTest, setHov)

  return (
    <svg
      ref={svgRef}
      width={size} height={size}
      viewBox={`0 0 ${WHEEL_VB} ${WHEEL_VB}`}
      style={{ display: 'block', userSelect: 'none', touchAction: 'none', cursor: hov ? 'pointer' : 'default' }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
    >
      <CassiopeiaSegments cx={cx} cy={cy} colors={colors} hovState={hov} />
      <CassiopeiaCenter cx={cx} cy={cy} onRandom={onRandom} />
    </svg>
  )
}
