import React, { useRef, useCallback, useEffect, useState } from 'react'

const ACCENT = 'rgba(168,85,247,'

function polarToXY(cx, cy, angleDeg, r) {
  const a = (angleDeg - 90) * Math.PI / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function ringArc(cx, cy, r1, r2, startDeg, endDeg) {
  const gap = 0.5
  const s1 = polarToXY(cx, cy, startDeg + gap, r1)
  const e1 = polarToXY(cx, cy, endDeg - gap,   r1)
  const s2 = polarToXY(cx, cy, startDeg + gap, r2)
  const e2 = polarToXY(cx, cy, endDeg - gap,   r2)
  const large = (endDeg - startDeg) > 180 ? 1 : 0
  return `M ${s1[0]} ${s1[1]} A ${r1} ${r1} 0 ${large} 1 ${e1[0]} ${e1[1]} L ${e2[0]} ${e2[1]} A ${r2} ${r2} 0 ${large} 0 ${s2[0]} ${s2[1]} Z`
}

function getPointerAngle(e, svgEl, cx, cy) {
  const rect = svgEl.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = (clientX - rect.left) / rect.width  * svgEl.viewBox.baseVal.width  - cx
  const y = (clientY - rect.top)  / rect.height * svgEl.viewBox.baseVal.height - cy
  return Math.atan2(y, x) * 180 / Math.PI
}

function useNeedle(svgRef, cx, cy, needleRef, onDelta) {
  const prevAngle  = useRef(null)
  const angleRef   = useRef(0)
  const onDeltaRef = useRef(onDelta)
  useEffect(() => { onDeltaRef.current = onDelta }, [onDelta])

  useEffect(() => {
    if (needleRef.current)
      needleRef.current.setAttribute('transform', `rotate(${angleRef.current} ${cx} ${cy})`)
  })

  return {
    onPointerDown: (e) => {
      prevAngle.current = getPointerAngle(e, svgRef.current, cx, cy)
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.style.cursor = 'grabbing'
    },
    onPointerMove: (e) => {
      if (prevAngle.current === null) return
      const angle = getPointerAngle(e, svgRef.current, cx, cy)
      let delta = angle - prevAngle.current
      if (delta > 180)  delta -= 360
      if (delta < -180) delta += 360
      if (Math.abs(delta) < 0.01) return
      angleRef.current += delta
      prevAngle.current = angle
      if (needleRef.current) {
        needleRef.current.setAttribute('transform', `rotate(${angleRef.current} ${cx} ${cy})`)
      }
      onDeltaRef.current(delta)
    },
    onPointerUp: (e) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
      prevAngle.current = null
      e.currentTarget.style.cursor = 'grab'
    }
  }
}

function useImperativeRing(svgRef, cx, cy, total, onPreview, onCommit) {
  const groupRef     = useRef(null)
  const isDragging   = useRef(false)
  const onPreviewRef = useRef(onPreview)
  const onCommitRef  = useRef(onCommit)
  useEffect(() => { onPreviewRef.current = onPreview }, [onPreview])
  useEffect(() => { onCommitRef.current  = onCommit  }, [onCommit])

  const angleToIdx = useCallback(e => {
    const angle = getPointerAngle(e, svgRef.current, cx, cy)
    const norm = ((angle + 90) % 360 + 360) % 360
    return Math.floor(norm / (360 / total)) % total
  }, [svgRef, cx, cy, total])

  const onPointerDown = useCallback(e => {
    isDragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.style.cursor = 'grabbing'
    onPreviewRef.current(angleToIdx(e))
  }, [angleToIdx])

  const onPointerMove = useCallback(e => {
    onPreviewRef.current(angleToIdx(e))
  }, [angleToIdx])

  const onPointerUp = useCallback(e => {
    e.currentTarget.style.cursor = 'grab'
    isDragging.current = false
    onCommitRef.current(angleToIdx(e))
    onPreviewRef.current(null)
  }, [angleToIdx])

  const onPointerLeave = useCallback(() => {
    if (isDragging.current) return
    onPreviewRef.current(null)
  }, [])

  return { groupRef, onPointerDown, onPointerMove, onPointerUp, onPointerLeave }
}

// ── Generic Wheel Picker Component ────────────────────────────────────────────
// Shared component for both date and time pickers
export function WheelPicker({ value, onChange, onPreview, size = 220, rings, needleConfig, centerDisplay, style }) {
  const svgRef = useRef(null)
  const VB = 240, cx = 120, cy = 120
  const needleRef = useRef(null)
  const needleAccum = useRef(0)

  const [hovered, setHovered] = useState({})

  // Setup needle if provided
  const needle = needleConfig ? useNeedle(svgRef, cx, cy, needleRef, delta => {
    needleAccum.current += delta * needleConfig.degreesToUnits
    const steps = Math.trunc(needleAccum.current)
    if (steps === 0) return
    needleAccum.current -= steps
    const newValue = needleConfig.onDelta(value, steps)
    onChange(newValue)
  }) : null

  // Setup rings
  const ringHandlers = rings.map((ring, idx) =>
    useImperativeRing(svgRef, cx, cy, ring.count,
      h => {
        const newHovered = { ...hovered }
        newHovered[idx] = h
        setHovered(newHovered)
        if (h === null) {
          onPreview?.(null)
        } else {
          onPreview?.(ring.onHover(value, h))
        }
      },
      h => {
        const newHovered = { ...hovered }
        delete newHovered[idx]
        setHovered(newHovered)
        onChange(ring.onSelect(value, h))
      }
    )
  )

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}
         style={{ display:'block', userSelect:'none', touchAction:'none', ...style }}>

      {rings.map((ring, ringIdx) => {
        const handler = ringHandlers[ringIdx]
        return (
          <g key={ringIdx}
             onPointerDown={handler.onPointerDown}
             onPointerMove={handler.onPointerMove}
             onPointerUp={handler.onPointerUp}
             onPointerLeave={handler.onPointerLeave}
             style={{ cursor:'grab' }}>
            <g ref={handler.groupRef}>
              {Array.from({length: ring.count}, (_, i) => {
                const ang = (i / ring.count) * 360
                const isSelected = ring.isSelected(value, i)
                const isHov = hovered[ringIdx] === i
                const [tx, ty] = polarToXY(cx, cy, ang, (ring.r1 + ring.r2) * 0.5)
                return (
                  <g key={i}>
                    <path d={ringArc(cx, cy, ring.r1, ring.r2, ang, ang + 360/ring.count)}
                      fill={isSelected ? `${ACCENT}0.6)` : isHov ? 'rgba(250,220,255,0.15)' : `${ACCENT}0.06)`}
                      stroke={isSelected ? `${ACCENT}0.9)` : isHov ? 'rgba(250,220,255,0.6)' : `${ACCENT}0.15)`}
                      strokeWidth={isSelected || isHov ? 1 : 0.5} />
                    {(isSelected || isHov || ring.shouldShowLabel?.(i)) && (
                      <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                        fontSize={isSelected ? 7 : isHov ? 6.5 : 5.5} fontFamily="monospace" fontWeight={isSelected || isHov ? 800 : 400}
                        fill={isSelected ? '#e8d4ff' : isHov ? '#fff' : 'rgba(255,255,255,0.35)'}>
                        {ring.label(i)}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          </g>
        )
      })}

      {needle && (
        <g onPointerDown={needle.onPointerDown} onPointerMove={needle.onPointerMove}
           onPointerUp={needle.onPointerUp} style={{ cursor:'grab' }}>
          <circle cx={cx} cy={cy} r={needleConfig.needleR2 + 4} fill="none" stroke="transparent" strokeWidth="22" />
          <g ref={needleRef}>
            <line x1={cx} y1={cy - needleConfig.needleR1} x2={cx} y2={cy - needleConfig.needleR2}
              stroke="rgba(168,85,247,0.35)" strokeWidth="10" strokeLinecap="round" />
            <line x1={cx} y1={cy - needleConfig.needleR1} x2={cx} y2={cy - needleConfig.needleR2}
              stroke="rgba(232,212,255,0.95)" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      )}

      {centerDisplay && (
        <>
          {centerDisplay.lines.map((line, i) => (
            <text key={i}
              x={cx} y={cy + line.offset}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={line.size} fontFamily="monospace" fontWeight={line.weight} fill={line.color}>
              {line.text(value, hovered)}
            </text>
          ))}
        </>
      )}

      <line x1={cx} y1={cy - (rings[rings.length - 1]?.r2 || 0) - 2} x2={cx} y2={cy - (rings[0]?.r1 || 0) + 2}
        stroke="rgba(168,85,247,0.5)" strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  )
}

export { DateWheel } from './DateWheel.jsx'
export { TimeWheel } from './TimeWheel.jsx'
