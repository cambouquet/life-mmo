import React, { useRef, useCallback, useEffect } from 'react'

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

function indexFromRotation(rotation, total) {
  const norm = ((-rotation % 360) + 360) % 360
  return Math.round(norm / (360 / total)) % total
}

// Imperative drag hook — rotates a DOM group directly via setAttribute, no React re-render during drag
function useImperativeRing(svgRef, cx, cy, total, onCommit) {
  const groupRef   = useRef(null)
  const rotRef     = useRef(0)   // accumulated rotation degrees
  const prevAngle  = useRef(null)

  const applyTransform = useCallback(() => {
    if (groupRef.current) {
      groupRef.current.setAttribute('transform', `rotate(${rotRef.current} ${cx} ${cy})`)
    }
  }, [cx, cy])

  // Re-apply transform after every React render (parent re-render resets DOM attributes)
  useEffect(() => { applyTransform() })

  const onPointerDown = useCallback(e => {
    prevAngle.current = getPointerAngle(e, svgRef.current, cx, cy)
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.style.cursor = 'grabbing'
  }, [svgRef, cx, cy])

  const onPointerMove = useCallback(e => {
    // Always report hovered index for live chart preview
    // The pointer angle relative to 12-o'clock is (angle + 90).
    // Combined with the ring's current rotation offset gives the hovered segment.
    const angle = getPointerAngle(e, svgRef.current, cx, cy)
    const hoveredIndex = indexFromRotation(rotRef.current - (angle + 90), total)
    onCommit(hoveredIndex)

    // Only physically rotate if dragging
    if (prevAngle.current === null) return
    let delta = angle - prevAngle.current
    if (delta > 180)  delta -= 360
    if (delta < -180) delta += 360
    rotRef.current += delta
    prevAngle.current = angle
    applyTransform()
  }, [svgRef, cx, cy, applyTransform, onCommit, total])

  const onPointerUp = useCallback(e => {
    prevAngle.current = null
    e.currentTarget.style.cursor = 'grab'
  }, [])

  return { groupRef, onPointerDown, onPointerMove, onPointerUp }
}

// ── Date Wheel ────────────────────────────────────────────────────────────────
export function DateWheel({ value, onChange, size = 220 }) {
  const { day, month, year } = value
  const svgRef = useRef(null)
  const VB = 220, cx = 110, cy = 110

  const maxDay = DAYS_IN_MONTH(month, year)
  const YEARS  = Array.from({length: 101}, (_, i) => 1930 + i)

  const DAY_R1 = 28, DAY_R2 = 50
  const MON_R1 = 54, MON_R2 = 76
  const YR_R1  = 80, YR_R2  = 102

  const dayRing  = useImperativeRing(svgRef, cx, cy, maxDay,     idx => onChange({ day: idx + 1, month, year }))
  const monRing  = useImperativeRing(svgRef, cx, cy, 12,         idx => { const nm = idx + 1; onChange({ day: Math.min(day, DAYS_IN_MONTH(nm, year)), month: nm, year }) })
  const yearRing = useImperativeRing(svgRef, cx, cy, YEARS.length, idx => onChange({ day, month, year: YEARS[idx] }))

  const yearIdx = YEARS.indexOf(year)

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}
         style={{ display:'block', userSelect:'none', touchAction:'none' }}>

      {/* ── Day ring ── */}
      <g onPointerDown={dayRing.onPointerDown} onPointerMove={dayRing.onPointerMove} onPointerUp={dayRing.onPointerUp}
         style={{ cursor:'grab' }}>
        <g ref={dayRing.groupRef}>
          {Array.from({length: maxDay}, (_, i) => {
            const ang = (i / maxDay) * 360
            const isSelected = i + 1 === day
            const [tx, ty] = polarToXY(cx, cy, ang, (DAY_R1 + DAY_R2) / 2)
            return (
              <g key={i}>
                <path d={ringArc(cx, cy, DAY_R1, DAY_R2, ang, ang + 360/maxDay)}
                  fill={isSelected ? `${ACCENT}0.6)` : `${ACCENT}0.06)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : `${ACCENT}0.15)`}
                  strokeWidth={isSelected ? 1 : 0.5} />
                {(isSelected || i % 5 === 0) && (
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isSelected ? 7 : 5.5} fontFamily="monospace" fontWeight={isSelected ? 800 : 400}
                    fill={isSelected ? '#e8d4ff' : 'rgba(255,255,255,0.35)'}>
                    {i + 1}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {/* ── Month ring ── */}
      <g onPointerDown={monRing.onPointerDown} onPointerMove={monRing.onPointerMove} onPointerUp={monRing.onPointerUp}
         style={{ cursor:'grab' }}>
        <g ref={monRing.groupRef}>
          {MONTHS_SHORT.map((m, i) => {
            const ang = i * 30
            const isSelected = i + 1 === month
            const [tx, ty] = polarToXY(cx, cy, ang + 15, (MON_R1 + MON_R2) / 2)
            return (
              <g key={m}>
                <path d={ringArc(cx, cy, MON_R1, MON_R2, ang, ang + 30)}
                  fill={isSelected ? `${ACCENT}0.55)` : `${ACCENT}0.07)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : `${ACCENT}0.18)`}
                  strokeWidth={isSelected ? 1 : 0.5} />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                  fontSize={isSelected ? 7 : 6} fontFamily="monospace" fontWeight={isSelected ? 800 : 400}
                  fill={isSelected ? '#e8d4ff' : 'rgba(255,255,255,0.38)'}>
                  {m}
                </text>
              </g>
            )
          })}
        </g>
      </g>

      {/* ── Year ring ── */}
      <g onPointerDown={yearRing.onPointerDown} onPointerMove={yearRing.onPointerMove} onPointerUp={yearRing.onPointerUp}
         style={{ cursor:'grab' }}>
        <g ref={yearRing.groupRef}>
          {YEARS.map((y, i) => {
            const ang = (i / YEARS.length) * 360
            const isSelected = y === year
            const isNear = Math.abs(i - yearIdx) <= 2 || Math.abs(i - yearIdx) >= YEARS.length - 2
            const [tx, ty] = polarToXY(cx, cy, ang + 360/YEARS.length/2, (YR_R1 + YR_R2) / 2)
            return (
              <g key={y}>
                <path d={ringArc(cx, cy, YR_R1, YR_R2, ang, ang + 360/YEARS.length)}
                  fill={isSelected ? `${ACCENT}0.55)` : `${ACCENT}0.04)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : `${ACCENT}0.12)`}
                  strokeWidth={isSelected ? 1 : 0.3} />
                {(isSelected || isNear) && (
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isSelected ? 6.5 : 5} fontFamily="monospace" fontWeight={isSelected ? 800 : 400}
                    fill={isSelected ? '#e8d4ff' : 'rgba(255,255,255,0.3)'}>
                    {y}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {/* centre readout */}
      <text x={cx} y={cy - 7} textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontFamily="monospace" fontWeight="700" fill="#e8d4ff">
        {String(day).padStart(2,'0')} {MONTHS_SHORT[month-1]}
      </text>
      <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fontFamily="monospace" fontWeight="500" fill="rgba(200,168,240,0.7)">
        {year}
      </text>

      {/* 12-o'clock selector tick */}
      <line x1={cx} y1={cy - YR_R2 - 2} x2={cx} y2={cy - DAY_R1 + 2}
        stroke="rgba(168,85,247,0.5)" strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  )
}

// ── Time Wheel ────────────────────────────────────────────────────────────────
export function TimeWheel({ value, onChange, size = 180 }) {
  const { hour, minute } = value
  const svgRef = useRef(null)
  const VB = 180, cx = 90, cy = 90

  const HR_R1 = 28, HR_R2 = 52
  const MN_R1 = 56, MN_R2 = 80

  const hourRing = useImperativeRing(svgRef, cx, cy, 24, idx => onChange({ hour: idx, minute }))
  const minRing  = useImperativeRing(svgRef, cx, cy, 60, idx => onChange({ hour, minute: idx }))

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}
         style={{ display:'block', userSelect:'none', touchAction:'none' }}>

      {/* ── Hour ring ── */}
      <g onPointerDown={hourRing.onPointerDown} onPointerMove={hourRing.onPointerMove} onPointerUp={hourRing.onPointerUp}
         style={{ cursor:'grab' }}>
        <g ref={hourRing.groupRef}>
          {Array.from({length: 24}, (_, i) => {
            const ang = i * 15
            const isSelected = i === hour
            const [tx, ty] = polarToXY(cx, cy, ang + 7.5, (HR_R1 + HR_R2) / 2)
            return (
              <g key={i}>
                <path d={ringArc(cx, cy, HR_R1, HR_R2, ang, ang + 15)}
                  fill={isSelected ? `${ACCENT}0.6)` : `${ACCENT}0.06)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : `${ACCENT}0.15)`}
                  strokeWidth={isSelected ? 1 : 0.5} />
                {(isSelected || i % 6 === 0) && (
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isSelected ? 7 : 6} fontFamily="monospace" fontWeight={isSelected ? 800 : 400}
                    fill={isSelected ? '#e8d4ff' : 'rgba(255,255,255,0.35)'}>
                    {String(i).padStart(2,'0')}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {/* ── Minute ring ── */}
      <g onPointerDown={minRing.onPointerDown} onPointerMove={minRing.onPointerMove} onPointerUp={minRing.onPointerUp}
         style={{ cursor:'grab' }}>
        <g ref={minRing.groupRef}>
          {Array.from({length: 60}, (_, i) => {
            const ang = i * 6
            const isSelected = i === minute
            const isQuarter = i % 15 === 0
            const [tx, ty] = polarToXY(cx, cy, ang + 3, (MN_R1 + MN_R2) / 2)
            return (
              <g key={i}>
                <path d={ringArc(cx, cy, MN_R1, MN_R2, ang, ang + 6)}
                  fill={isSelected ? `${ACCENT}0.6)` : `${ACCENT}0.05)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : `${ACCENT}0.12)`}
                  strokeWidth={isSelected ? 1 : 0.3} />
                {(isSelected || isQuarter) && (
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isSelected ? 6.5 : 5.5} fontFamily="monospace" fontWeight={isSelected ? 800 : 400}
                    fill={isSelected ? '#e8d4ff' : 'rgba(255,255,255,0.3)'}>
                    {String(i).padStart(2,'0')}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {/* centre readout */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fontSize="14" fontFamily="monospace" fontWeight="700" fill="#e8d4ff">
        {String(hour).padStart(2,'0')}:{String(minute).padStart(2,'0')}
      </text>

      {/* 12-o'clock tick */}
      <line x1={cx} y1={cy - MN_R2 - 2} x2={cx} y2={cy - HR_R1 + 2}
        stroke="rgba(168,85,247,0.5)" strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  )
}
