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

function indexFromRotation(rotation, total) {
  const norm = ((-rotation % 360) + 360) % 360
  return Math.round(norm / (360 / total)) % total
}

function hoveredIndexFromAngle(angle, rotRef, total) {
  return indexFromRotation(rotRef.current - (angle + 90), total)
}

// Needle hook: spins freely, accumulates full turns, calls onTurn(n) each full revolution
function useNeedle(svgRef, cx, cy, needleRef, onTurn) {
  const prevAngle  = useRef(null)
  const accumRef   = useRef(0)   // total degrees spun
  const onTurnRef  = useRef(onTurn)
  useEffect(() => { onTurnRef.current = onTurn }, [onTurn])

  const applyTransform = useCallback(() => {
    if (needleRef.current)
      needleRef.current.setAttribute('transform', `rotate(${accumRef.current % 360} ${cx} ${cy})`)
  }, [needleRef, cx, cy])

  useEffect(() => { applyTransform() })

  const onPointerDown = useCallback(e => {
    prevAngle.current = getPointerAngle(e, svgRef.current, cx, cy)
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.style.cursor = 'grabbing'
  }, [svgRef, cx, cy])

  const onPointerMove = useCallback(e => {
    if (prevAngle.current === null) return
    const angle = getPointerAngle(e, svgRef.current, cx, cy)
    let delta = angle - prevAngle.current
    if (delta > 180)  delta -= 360
    if (delta < -180) delta += 360
    const before = Math.floor(accumRef.current / 360)
    accumRef.current += delta
    const after = Math.floor(accumRef.current / 360)
    if (after !== before) onTurnRef.current(after - before)
    prevAngle.current = angle
    applyTransform()
  }, [svgRef, cx, cy, applyTransform])

  const onPointerUp = useCallback(e => {
    prevAngle.current = null
    e.currentTarget.style.cursor = 'grab'
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp }
}

// Imperative ring: rotate DOM directly, preview on hover, commit on click or drag-release
function useImperativeRing(svgRef, cx, cy, total, onPreview, onCommit) {
  const groupRef     = useRef(null)
  const rotRef       = useRef(0)
  const prevAngle    = useRef(null)
  const didDrag      = useRef(false)
  const onPreviewRef = useRef(onPreview)
  const onCommitRef  = useRef(onCommit)
  useEffect(() => { onPreviewRef.current = onPreview }, [onPreview])
  useEffect(() => { onCommitRef.current  = onCommit  }, [onCommit])

  const applyTransform = useCallback(() => {
    if (groupRef.current)
      groupRef.current.setAttribute('transform', `rotate(${rotRef.current} ${cx} ${cy})`)
  }, [cx, cy])

  // Re-apply after every React render so parent re-renders don't reset the transform
  useEffect(() => { applyTransform() })

  const onPointerDown = useCallback(e => {
    didDrag.current = false
    prevAngle.current = getPointerAngle(e, svgRef.current, cx, cy)
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.style.cursor = 'grabbing'
  }, [svgRef, cx, cy])

  const onPointerMove = useCallback(e => {
    const angle = getPointerAngle(e, svgRef.current, cx, cy)
    // Preview hovered segment
    onPreviewRef.current(hoveredIndexFromAngle(angle, rotRef, total))
    // Rotate if dragging
    if (prevAngle.current === null) return
    let delta = angle - prevAngle.current
    if (delta > 180)  delta -= 360
    if (delta < -180) delta += 360
    if (Math.abs(delta) > 0.3) didDrag.current = true
    rotRef.current += delta
    prevAngle.current = angle
    applyTransform()
  }, [svgRef, cx, cy, total, applyTransform])

  const onPointerUp = useCallback(e => {
    e.currentTarget.style.cursor = 'grab'
    const angle = getPointerAngle(e, svgRef.current, cx, cy)
    const idx = didDrag.current
      ? indexFromRotation(rotRef.current, total)
      : hoveredIndexFromAngle(angle, rotRef, total)
    onCommitRef.current(idx)
    prevAngle.current = null
    didDrag.current = false
  }, [svgRef, cx, cy, total])

  const onPointerLeave = useCallback(() => {
    if (prevAngle.current !== null) return // mid-drag, ignore
    onPreviewRef.current(null) // restore committed value
  }, [])

  return { groupRef, onPointerDown, onPointerMove, onPointerUp, onPointerLeave }
}

// ── Date Wheel ────────────────────────────────────────────────────────────────
// value: committed { day, month, year }
// onChange: called on click/drag-release
// onPreview: called on hover with { day, month, year } or null (restore)
export function DateWheel({ value, onChange, onPreview, size = 220 }) {
  const { day, month, year } = value
  const svgRef = useRef(null)
  const VB = 220, cx = 110, cy = 110

  const maxDay = DAYS_IN_MONTH(month, year)
  const YEARS  = Array.from({length: 101}, (_, i) => 1930 + i)

  const DAY_R1 = 28, DAY_R2 = 50
  const MON_R1 = 54, MON_R2 = 76
  const YR_R1  = 80, YR_R2  = 102
  const NEEDLE_R1 = 106, NEEDLE_R2 = 116  // needle track just outside year ring

  const [hovDay,  setHovDay]  = useState(null)
  const [hovMon,  setHovMon]  = useState(null)
  const [hovYear, setHovYear] = useState(null)
  const needleRef = useRef(null)
  const yearNeedle = useNeedle(svgRef, cx, cy, needleRef, turns => {
    const idx = YEARS.indexOf(year)
    const next = Math.max(0, Math.min(YEARS.length - 1, idx + turns))
    onChange({ day, month, year: YEARS[next] })
  })

  const dayRing = useImperativeRing(svgRef, cx, cy, maxDay,
    idx => { setHovDay(idx); idx === null ? onPreview?.(null) : onPreview?.({ day: idx + 1, month, year }) },
    idx => { setHovDay(null); onChange({ day: idx + 1, month, year }) }
  )
  const monRing = useImperativeRing(svgRef, cx, cy, 12,
    idx => { setHovMon(idx); if (idx === null) { onPreview?.(null); return }; const nm = idx + 1; onPreview?.({ day: Math.min(day, DAYS_IN_MONTH(nm, year)), month: nm, year }) },
    idx => { setHovMon(null); const nm = idx + 1; onChange({ day: Math.min(day, DAYS_IN_MONTH(nm, year)), month: nm, year }) }
  )
  const yearRing = useImperativeRing(svgRef, cx, cy, YEARS.length,
    idx => { setHovYear(idx); idx === null ? onPreview?.(null) : onPreview?.({ day, month, year: YEARS[idx] }) },
    idx => { setHovYear(null); onChange({ day, month, year: YEARS[idx] }) }
  )

  const yearIdx = YEARS.indexOf(year)

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}
         style={{ display:'block', userSelect:'none', touchAction:'none' }}>

      {/* ── Day ring ── */}
      <g onPointerDown={dayRing.onPointerDown} onPointerMove={dayRing.onPointerMove}
         onPointerUp={dayRing.onPointerUp} onPointerLeave={dayRing.onPointerLeave}
         style={{ cursor:'grab' }}>
        <g ref={dayRing.groupRef}>
          {Array.from({length: maxDay}, (_, i) => {
            const ang = (i / maxDay) * 360
            const isSelected = i + 1 === day
            const isHov = hovDay === i
            const [tx, ty] = polarToXY(cx, cy, ang, (DAY_R1 + DAY_R2) / 2)
            return (
              <g key={i}>
                <path d={ringArc(cx, cy, DAY_R1, DAY_R2, ang, ang + 360/maxDay)}
                  fill={isSelected ? `${ACCENT}0.6)` : isHov ? 'rgba(250,220,255,0.15)' : `${ACCENT}0.06)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : isHov ? 'rgba(250,220,255,0.6)' : `${ACCENT}0.15)`}
                  strokeWidth={isSelected || isHov ? 1 : 0.5} />
                {(isSelected || isHov || i % 5 === 0) && (
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isSelected ? 7 : isHov ? 6.5 : 5.5} fontFamily="monospace" fontWeight={isSelected || isHov ? 800 : 400}
                    fill={isSelected ? '#e8d4ff' : isHov ? '#fff' : 'rgba(255,255,255,0.35)'}>
                    {i + 1}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {/* ── Month ring ── */}
      <g onPointerDown={monRing.onPointerDown} onPointerMove={monRing.onPointerMove}
         onPointerUp={monRing.onPointerUp} onPointerLeave={monRing.onPointerLeave}
         style={{ cursor:'grab' }}>
        <g ref={monRing.groupRef}>
          {MONTHS_SHORT.map((m, i) => {
            const ang = i * 30
            const isSelected = i + 1 === month
            const isHov = hovMon === i
            const [tx, ty] = polarToXY(cx, cy, ang + 15, (MON_R1 + MON_R2) / 2)
            return (
              <g key={m}>
                <path d={ringArc(cx, cy, MON_R1, MON_R2, ang, ang + 30)}
                  fill={isSelected ? `${ACCENT}0.55)` : isHov ? 'rgba(250,220,255,0.15)' : `${ACCENT}0.07)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : isHov ? 'rgba(250,220,255,0.6)' : `${ACCENT}0.18)`}
                  strokeWidth={isSelected || isHov ? 1 : 0.5} />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                  fontSize={isSelected ? 7 : isHov ? 7 : 6} fontFamily="monospace" fontWeight={isSelected || isHov ? 800 : 400}
                  fill={isSelected ? '#e8d4ff' : isHov ? '#fff' : 'rgba(255,255,255,0.38)'}>
                  {m}
                </text>
              </g>
            )
          })}
        </g>
      </g>

      {/* ── Year ring ── */}
      <g onPointerDown={yearRing.onPointerDown} onPointerMove={yearRing.onPointerMove}
         onPointerUp={yearRing.onPointerUp} onPointerLeave={yearRing.onPointerLeave}
         style={{ cursor:'grab' }}>
        <g ref={yearRing.groupRef}>
          {YEARS.map((y, i) => {
            const ang = (i / YEARS.length) * 360
            const isSelected = y === year
            const isHov = hovYear === i
            const isNear = Math.abs(i - yearIdx) <= 2 || Math.abs(i - yearIdx) >= YEARS.length - 2
            const [tx, ty] = polarToXY(cx, cy, ang + 360/YEARS.length/2, (YR_R1 + YR_R2) / 2)
            return (
              <g key={y}>
                <path d={ringArc(cx, cy, YR_R1, YR_R2, ang, ang + 360/YEARS.length)}
                  fill={isSelected ? `${ACCENT}0.55)` : isHov ? 'rgba(250,220,255,0.15)' : `${ACCENT}0.04)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : isHov ? 'rgba(250,220,255,0.6)' : `${ACCENT}0.12)`}
                  strokeWidth={isSelected || isHov ? 1 : 0.3} />
                {(isSelected || isHov || isNear) && (
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isSelected ? 6.5 : isHov ? 6.5 : 5} fontFamily="monospace" fontWeight={isSelected || isHov ? 800 : 400}
                    fill={isSelected ? '#e8d4ff' : isHov ? '#fff' : 'rgba(255,255,255,0.3)'}>
                    {y}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {/* ── Year needle (spin freely, 1 turn = 1 year) ── */}
      <g onPointerDown={yearNeedle.onPointerDown} onPointerMove={yearNeedle.onPointerMove}
         onPointerUp={yearNeedle.onPointerUp} style={{ cursor:'grab' }}>
        {/* invisible fat hit area */}
        <circle cx={cx} cy={cy} r={NEEDLE_R2 + 2} fill="none" stroke="transparent" strokeWidth="10" />
        <g ref={needleRef}>
          <line x1={cx} y1={cy - NEEDLE_R1} x2={cx} y2={cy - NEEDLE_R2}
            stroke="rgba(232,212,255,0.9)" strokeWidth="2" strokeLinecap="round" />
          <circle cx={cx} cy={cy - NEEDLE_R2} r="3"
            fill="#e8d4ff" stroke="rgba(168,85,247,0.8)" strokeWidth="1" />
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
// value: committed { hour, minute }
// onChange: called on click/drag-release
// onPreview: called on hover with { hour, minute } or null (restore)
export function TimeWheel({ value, onChange, onPreview, size = 180 }) {
  const { hour, minute } = value
  const svgRef = useRef(null)
  const VB = 180, cx = 90, cy = 90

  const HR_R1 = 28, HR_R2 = 52
  const MN_R1 = 56, MN_R2 = 80

  const HR_NEEDLE_R1 = 84, HR_NEEDLE_R2 = 94

  const [hovHour, setHovHour] = useState(null)
  const [hovMin,  setHovMin]  = useState(null)
  const timeNeedleRef = useRef(null)
  const timeNeedle = useNeedle(svgRef, cx, cy, timeNeedleRef, turns => {
    onChange({ hour: ((hour + turns) % 24 + 24) % 24, minute })
  })

  const hourRing = useImperativeRing(svgRef, cx, cy, 24,
    idx => { setHovHour(idx); idx === null ? onPreview?.(null) : onPreview?.({ hour: idx, minute }) },
    idx => { setHovHour(null); onChange({ hour: idx, minute }) }
  )
  const minRing = useImperativeRing(svgRef, cx, cy, 60,
    idx => { setHovMin(idx); idx === null ? onPreview?.(null) : onPreview?.({ hour, minute: idx }) },
    idx => { setHovMin(null); onChange({ hour, minute: idx }) }
  )

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}
         style={{ display:'block', userSelect:'none', touchAction:'none' }}>

      {/* ── Hour ring ── */}
      <g onPointerDown={hourRing.onPointerDown} onPointerMove={hourRing.onPointerMove}
         onPointerUp={hourRing.onPointerUp} onPointerLeave={hourRing.onPointerLeave}
         style={{ cursor:'grab' }}>
        <g ref={hourRing.groupRef}>
          {Array.from({length: 24}, (_, i) => {
            const ang = i * 15
            const isSelected = i === hour
            const isHov = hovHour === i
            const [tx, ty] = polarToXY(cx, cy, ang + 7.5, (HR_R1 + HR_R2) / 2)
            return (
              <g key={i}>
                <path d={ringArc(cx, cy, HR_R1, HR_R2, ang, ang + 15)}
                  fill={isSelected ? `${ACCENT}0.6)` : isHov ? 'rgba(250,220,255,0.15)' : `${ACCENT}0.06)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : isHov ? 'rgba(250,220,255,0.6)' : `${ACCENT}0.15)`}
                  strokeWidth={isSelected || isHov ? 1 : 0.5} />
                {(isSelected || isHov || i % 6 === 0) && (
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isSelected || isHov ? 7 : 6} fontFamily="monospace" fontWeight={isSelected || isHov ? 800 : 400}
                    fill={isSelected ? '#e8d4ff' : isHov ? '#fff' : 'rgba(255,255,255,0.35)'}>
                    {String(i).padStart(2,'0')}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {/* ── Minute ring ── */}
      <g onPointerDown={minRing.onPointerDown} onPointerMove={minRing.onPointerMove}
         onPointerUp={minRing.onPointerUp} onPointerLeave={minRing.onPointerLeave}
         style={{ cursor:'grab' }}>
        <g ref={minRing.groupRef}>
          {Array.from({length: 60}, (_, i) => {
            const ang = i * 6
            const isSelected = i === minute
            const isHov = hovMin === i
            const isQuarter = i % 15 === 0
            const [tx, ty] = polarToXY(cx, cy, ang + 3, (MN_R1 + MN_R2) / 2)
            return (
              <g key={i}>
                <path d={ringArc(cx, cy, MN_R1, MN_R2, ang, ang + 6)}
                  fill={isSelected ? `${ACCENT}0.6)` : isHov ? 'rgba(250,220,255,0.15)' : `${ACCENT}0.05)`}
                  stroke={isSelected ? `${ACCENT}0.9)` : isHov ? 'rgba(250,220,255,0.6)' : `${ACCENT}0.12)`}
                  strokeWidth={isSelected || isHov ? 1 : 0.3} />
                {(isSelected || isHov || isQuarter) && (
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isSelected || isHov ? 6.5 : 5.5} fontFamily="monospace" fontWeight={isSelected || isHov ? 800 : 400}
                    fill={isSelected ? '#e8d4ff' : isHov ? '#fff' : 'rgba(255,255,255,0.3)'}>
                    {String(i).padStart(2,'0')}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </g>

      {/* ── Hour needle (spin freely, 1 turn = 1 hour) ── */}
      <g onPointerDown={timeNeedle.onPointerDown} onPointerMove={timeNeedle.onPointerMove}
         onPointerUp={timeNeedle.onPointerUp} style={{ cursor:'grab' }}>
        <circle cx={cx} cy={cy} r={HR_NEEDLE_R2 + 2} fill="none" stroke="transparent" strokeWidth="10" />
        <g ref={timeNeedleRef}>
          <line x1={cx} y1={cy - HR_NEEDLE_R1} x2={cx} y2={cy - HR_NEEDLE_R2}
            stroke="rgba(232,212,255,0.9)" strokeWidth="2" strokeLinecap="round" />
          <circle cx={cx} cy={cy - HR_NEEDLE_R2} r="3"
            fill="#e8d4ff" stroke="rgba(168,85,247,0.8)" strokeWidth="1" />
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
