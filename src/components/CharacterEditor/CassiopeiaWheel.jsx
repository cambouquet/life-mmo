import { useRef, useState, useCallback } from 'react'
import { RINGS, PALETTES, CENTER_R, WHEEL_VB, WHEEL_CENTER } from './cassiopeiaData.js'
import { getPointerAngle, getPointerDist } from './cassiopeiaGeometry.js'
import { CassiopeiaSegments } from './CassiopeiaSegments.jsx'

export function CassiopeiaWheel({ colors, onChange, onPreview, onRandom, size = 260 }) {
  const cx = WHEEL_CENTER, cy = WHEEL_CENTER
  const svgRef  = useRef(null)
  const [hov, setHov] = useState(null)

  const hitTest = useCallback((e) => {
    const svg  = svgRef.current
    if (!svg) return null
    const ang  = getPointerAngle(e, svg, cx, cy)
    const dist = getPointerDist(e, svg, cx, cy)
    for (let ri = 0; ri < RINGS.length; ri++) {
      const ring = RINGS[ri]
      if (dist < ring.r1 || dist > ring.r2) continue
      const pal = PALETTES[ring.key]
      const n   = pal.length
      const seg = Math.floor(ang / (360 / n)) % n
      return { ringIdx: ri, segIdx: seg }
    }
    return null
  }, [])

  const onPointerMove = useCallback((e) => {
    const hit = hitTest(e)
    setHov(hit)
    if (hit) {
      const ring = RINGS[hit.ringIdx]
      const hex  = PALETTES[ring.key][hit.segIdx]
      onPreview?.({ ...colors, [ring.key]: hex })
    } else {
      onPreview?.(null)
    }
  }, [hitTest, colors, onPreview])

  const onPointerLeave = useCallback(() => {
    setHov(null)
    onPreview?.(null)
  }, [onPreview])

  const onPointerDown = useCallback((e) => {
    const dist = getPointerDist(e, svgRef.current, cx, cy)
    if (dist <= CENTER_R) return
    const hit = hitTest(e)
    if (!hit) return
    const ring = RINGS[hit.ringIdx]
    const hex  = PALETTES[ring.key][hit.segIdx]
    onChange({ ...colors, [ring.key]: hex })
  }, [hitTest, colors, onChange])

  const btnD = CENTER_R * 2

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

      <line
        x1={cx} y1={cy - RINGS[0].r2 - 2}
        x2={cx} y2={cy - RINGS[RINGS.length - 1].r1 + 2}
        stroke="rgba(168,85,247,0.45)" strokeWidth="1" strokeDasharray="2,2"
        style={{ pointerEvents: 'none' }}
      />

      <foreignObject
        x={cx - CENTER_R} y={cy - CENTER_R}
        width={btnD} height={btnD}
        style={{ overflow: 'visible' }}
      >
        <button
          className="btn-random"
          title="Random palette"
          style={{ width: btnD, height: btnD, borderRadius: '50%', fontSize: 11 }}
          onPointerDown={e => e.stopPropagation()}
          onClick={onRandom}
        >?</button>
      </foreignObject>
    </svg>
  )
}
