import React, { useRef, useCallback } from 'react'

const ACCENT = 'rgba(168,85,247,'
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS_IN_MONTH = (m, y) => new Date(y, m, 0).getDate()

// ── shared helpers ────────────────────────────────────────────────────────────
function angleForIndex(i, total) { return (i / total) * 360 }
function indexFromAngle(angleDeg, total) {
  const norm = ((angleDeg % 360) + 360) % 360
  return Math.round(norm / 360 * total) % total
}
function polarToXY(cx, cy, angleDeg, r) {
  const a = (angleDeg - 90) * Math.PI / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function useRingDrag(svgRef, cx, cy, onAngle) {
  const dragging = useRef(false)
  const [isDown, setIsDown] = React.useState(false)

  const getAngle = useCallback(e => {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const x = (clientX - rect.left) / rect.width  * svg.viewBox.baseVal.width  - cx
    const y = (clientY - rect.top)  / rect.height * svg.viewBox.baseVal.height - cy
    return Math.atan2(y, x) * 180 / Math.PI + 90
  }, [svgRef, cx, cy])

  const onPointerDown = useCallback(e => {
    dragging.current = true
    setIsDown(true)
    onAngle(getAngle(e))
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [getAngle, onAngle])

  const onPointerMove = useCallback(e => {
    if (!dragging.current) return
    onAngle(getAngle(e))
  }, [getAngle, onAngle])

  const onPointerUp = useCallback(() => {
    dragging.current = false
    setIsDown(false)
  }, [])

  const cursor = isDown ? 'grabbing' : 'grab'
  return { onPointerDown, onPointerMove, onPointerUp, cursor }
}

// ── Ring arc path ─────────────────────────────────────────────────────────────
function ringArc(cx, cy, r1, r2, startDeg, endDeg) {
  const gap = 0.5
  const s1 = polarToXY(cx, cy, startDeg + gap, r1)
  const e1 = polarToXY(cx, cy, endDeg - gap,   r1)
  const s2 = polarToXY(cx, cy, startDeg + gap, r2)
  const e2 = polarToXY(cx, cy, endDeg - gap,   r2)
  const large = (endDeg - startDeg) > 180 ? 1 : 0
  return `M ${s1[0]} ${s1[1]} A ${r1} ${r1} 0 ${large} 1 ${e1[0]} ${e1[1]} L ${e2[0]} ${e2[1]} A ${r2} ${r2} 0 ${large} 0 ${s2[0]} ${s2[1]} Z`
}

// ── Date Wheel ────────────────────────────────────────────────────────────────
// value: { day, month, year }   (1-indexed month)
// onChange: ({ day, month, year }) => void
export function DateWheel({ value, onChange, size = 220 }) {
  const { day, month, year } = value
  const svgRef = useRef(null)
  const VB = 220, cx = 110, cy = 110  // fixed viewBox coords

  const maxDay = DAYS_IN_MONTH(month, year)

  // ring radii
  const DAY_R1 = 28, DAY_R2 = 50
  const MON_R1 = 54, MON_R2 = 76
  const YR_R1  = 80, YR_R2  = 102

  const YEARS = Array.from({length: 101}, (_, i) => 1930 + i)  // 1930–2030

  // drag handlers per ring
  const dayDrag   = useRingDrag(svgRef, cx, cy, a => {
    const idx = indexFromAngle(a, maxDay)
    onChange({ day: idx + 1, month, year })
  })
  const monDrag   = useRingDrag(svgRef, cx, cy, a => {
    const idx = indexFromAngle(a, 12)
    const newMonth = idx + 1
    const newDay = Math.min(day, DAYS_IN_MONTH(newMonth, year))
    onChange({ day: newDay, month: newMonth, year })
  })
  const yearDrag  = useRingDrag(svgRef, cx, cy, a => {
    const idx = indexFromAngle(a, YEARS.length)
    onChange({ day, month, year: YEARS[idx] })
  })
  const { cursor: dayCursor, ...dayHandlers } = dayDrag
  const { cursor: monCursor, ...monHandlers } = monDrag
  const { cursor: yrCursor,  ...yearHandlers } = yearDrag

  const yearIdx = YEARS.indexOf(year)

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}
         style={{ display:'block', userSelect:'none', touchAction:'none' }}>

      {/* ── Day ring ── */}
      <g {...dayHandlers} style={{ cursor: dayCursor }}>
        {Array.from({length: maxDay}, (_, i) => {
          const ang = angleForIndex(i, maxDay)
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

      {/* ── Month ring ── */}
      <g {...monHandlers} style={{ cursor: monCursor }}>
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

      {/* ── Year ring ── */}
      <g {...yearHandlers} style={{ cursor: yrCursor }}>
        {YEARS.map((y, i) => {
          const ang = angleForIndex(i, YEARS.length)
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
// value: { hour, minute }
// onChange: ({ hour, minute }) => void
export function TimeWheel({ value, onChange, size = 180 }) {
  const { hour, minute } = value
  const svgRef = useRef(null)
  const VB = 180, cx = 90, cy = 90  // fixed viewBox coords

  const HR_R1 = 28, HR_R2 = 52
  const MN_R1 = 56, MN_R2 = 80

  const hourDrag = useRingDrag(svgRef, cx, cy, a => {
    const h = indexFromAngle(a, 24)
    onChange({ hour: h, minute })
  })
  const minDrag  = useRingDrag(svgRef, cx, cy, a => {
    const m = indexFromAngle(a, 60)
    onChange({ hour, minute: m })
  })
  const { cursor: hrCursor, ...hourHandlers } = hourDrag
  const { cursor: mnCursor, ...minHandlers  } = minDrag

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}
         style={{ display:'block', userSelect:'none', touchAction:'none' }}>

      {/* ── Hour ring ── */}
      <g {...hourHandlers} style={{ cursor: hrCursor }}>
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

      {/* ── Minute ring ── */}
      <g {...minHandlers} style={{ cursor: mnCursor }}>
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
