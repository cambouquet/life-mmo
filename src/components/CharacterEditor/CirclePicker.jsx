import React, { useRef, useCallback, useEffect, useState } from 'react'

const ACCENT = 'rgba(168,85,247,'
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS_IN_MONTH = (m, y) => new Date(y, m, 0).getDate()

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
function WheelPicker({ value, onChange, onPreview, size = 220, rings, needleConfig, centerDisplay, style }) {
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

// ── Date Wheel ────────────────────────────────────────────────────────────────
export function DateWheel({ value, onChange, onPreview, size = 220, style }) {
  const { day, month, year } = value
  const valRef = useRef({ day, month, year })
  useEffect(() => { valRef.current = { day, month, year } }, [day, month, year])

  const maxDay = DAYS_IN_MONTH(month, year)
  const YEARS = Array.from({length: 101}, (_, i) => 1930 + i)

  const rings = [
    {
      count: maxDay,
      r1: 28, r2: 50,
      isSelected: (v) => false,
      shouldShowLabel: (i) => i % 5 === 0,
      label: (i) => String(i + 1),
      onHover: (v, i) => ({ day: i + 1, month: v.month, year: v.year }),
      onSelect: (v, i) => { onChange({ day: i + 1, month: v.month, year: v.year }); return v }
    },
    {
      count: 12,
      r1: 54, r2: 76,
      isSelected: (v, i) => i + 1 === v.month,
      shouldShowLabel: () => true,
      label: (i) => MONTHS_SHORT[i],
      onHover: (v, i) => {
        const nm = i + 1
        return { day: Math.min(v.day, DAYS_IN_MONTH(nm, v.year)), month: nm, year: v.year }
      },
      onSelect: (v, i) => {
        const nm = i + 1
        onChange({ day: Math.min(v.day, DAYS_IN_MONTH(nm, v.year)), month: nm, year: v.year })
        return v
      }
    },
    {
      count: YEARS.length,
      r1: 80, r2: 102,
      isSelected: (v, i) => YEARS[i] === v.year,
      shouldShowLabel: (i) => {
        const yearIdx = YEARS.indexOf(value.year)
        return i === yearIdx || Math.abs(i - yearIdx) <= 2 || Math.abs(i - yearIdx) >= YEARS.length - 2
      },
      label: (i) => String(YEARS[i]),
      onHover: (v, i) => ({ day: v.day, month: v.month, year: YEARS[i] }),
      onSelect: (v, i) => { onChange({ day: v.day, month: v.month, year: YEARS[i] }); return v }
    }
  ]

  const dDisp = value.day
  const mDisp = value.month
  const yDisp = value.year

  return (
    <WheelPicker
      value={value}
      onChange={onChange}
      onPreview={onPreview}
      size={size}
      rings={rings}
      needleConfig={{
        needleR1: 101,
        needleR2: 113,
        degreesToUnits: 365 / 360,
        onDelta: (v, steps) => {
          const d = new Date(v.year, v.month - 1, v.day)
          d.setDate(d.getDate() + steps)
          const minDate = new Date(1930, 0, 1)
          const maxDate = new Date(2030, 11, 31)
          if (d < minDate || d > maxDate) return v
          onChange({ day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() })
          return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() }
        }
      }}
      centerDisplay={{
        lines: [
          {
            offset: -7,
            size: 13,
            weight: 700,
            color: '#e8d4ff',
            text: (v) => `${String(v.day).padStart(2,'0')} ${MONTHS_SHORT[v.month-1]}`
          },
          {
            offset: 9,
            size: 11,
            weight: 500,
            color: 'rgba(200,168,240,0.7)',
            text: (v) => String(v.year)
          }
        ]
      }}
      style={style}
    />
  )
}

// ── Time Wheel ────────────────────────────────────────────────────────────────
export function TimeWheel({ value, onChange, onPreview, size = 220, style }) {
  const { hour, minute } = value
  const valRef = useRef({ hour, minute })
  useEffect(() => { valRef.current = { hour, minute } }, [hour, minute])

  const rings = [
    {
      count: 60,
      r1: 28, r2: 50,
      isSelected: (v) => false,
      shouldShowLabel: (i) => i % 15 === 0,
      label: (i) => String(i).padStart(2,'0'),
      onHover: (v, i) => ({ hour: v.hour, minute: i }),
      onSelect: (v, i) => { onChange({ hour: v.hour, minute: i }); return v }
    },
    {
      count: 24,
      r1: 54, r2: 76,
      isSelected: (v, i) => i === v.hour,
      shouldShowLabel: () => true,
      label: (i) => String(i).padStart(2,'0'),
      onHover: (v, i) => ({ hour: i, minute: v.minute }),
      onSelect: (v, i) => { onChange({ hour: i, minute: v.minute }); return v }
    }
  ]

  return (
    <WheelPicker
      value={value}
      onChange={onChange}
      onPreview={onPreview}
      size={size}
      rings={rings}
      needleConfig={{
        needleR1: 80,
        needleR2: 102,
        degreesToUnits: 60 / 360,
        onDelta: (v, steps) => {
          let totalMin = v.hour * 60 + v.minute + steps
          let daysDiff = Math.floor(totalMin / 1440)
          totalMin = ((totalMin % 1440) + 1440) % 1440
          const nextVal = { hour: Math.floor(totalMin / 60), minute: totalMin % 60, daysDiff }
          onChange(nextVal)
          return nextVal
        }
      }}
      centerDisplay={{
        lines: [
          {
            offset: 0,
            size: 13,
            weight: 700,
            color: '#e8d4ff',
            text: (v) => `${String(v.hour).padStart(2,'0')}:${String(v.minute).padStart(2,'0')}`
          },
          {
            offset: 12,
            size: 11,
            weight: 500,
            color: 'rgba(200,168,240,0.7)',
            text: (v) => v.hour === 0 ? '12 AM' : v.hour < 12 ? v.hour + ' AM' : v.hour === 12 ? '12 PM' : (v.hour - 12) + ' PM'
          }
        ]
      }}
      style={style}
    />
  )
}
