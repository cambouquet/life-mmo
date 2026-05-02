import React, { useRef, useState, useCallback } from 'react'

// ── Palettes ──────────────────────────────────────────────────────────────────

const PALETTES = {
  hair: [
    '#0a0a0a','#2a2a2a','#4a4a4a','#787878','#a0a0a0','#c8c8c8','#f0f0f0',
    '#3d1c00','#6b3300','#8b4513','#c68642','#e8c97a','#fffacd',
    '#2c1654','#4a2878','#7a3fa0','#a87fd4','#c9a0f0',
    '#1a2a4a','#2e4a7a','#4a6fa0','#8ab8d4',
    '#3a0a0a','#6a1a1a','#9a2a2a','#c04040',
    '#1a3a1a','#2e5a2e','#4a7a4a',
  ],
  skin: [
    '#fff0e8','#fde8c8','#f8d5a8','#f0c080',
    '#e8a85a','#d4884a','#b8683a','#8b4a2a','#6b3020','#3a1508',
    '#fde0d0','#f5c8b8','#e8a898','#d48878','#b86858','#8b4838',
  ],
  eyes: [
    '#1a3a6a','#2a5a9a','#4a9adf','#8acfff',
    '#1a4a2a','#3a8a4a','#6aba7a','#8acf9a',
    '#4a2a6a','#7a3aa0','#aa5adf','#e0a0ff',
    '#6a3a1a','#aa7a3a','#e0b87a',
    '#4a0a0a','#9a2a2a','#e87878',
    '#606060','#a0a0a0','#d0d0d0',
  ],
  outfit: [
    '#0a0a2a','#1a1a4a','#3a3a8a','#6a6abf',
    '#1a0a2a','#3a1858','#602888','#7a3aa0',
    '#0a2a2a','#0a4a4a','#0a5a5a','#1a6a6a',
    '#2a0a0a','#4a1818','#6a2828','#7a3030',
    '#0a1a0a','#183a18','#285a28','#306030',
    '#2a1800','#4a3000','#6a4a10','#7a5818',
  ],
  stick: [
    '#4a7abf','#6a9adf','#8ab8f5',
    '#7a4abf','#9a6adf','#c090f5',
    '#bf7a4a','#df9a6a','#f5ba90',
    '#4abf7a','#6adf9a','#90f5ba',
    '#bf4a7a','#df6a9a','#f590ba',
    '#bfbf4a','#dfdf6a','#f5f590',
    '#9a2a2a','#bf4a4a','#df7070',
    '#909090','#c0c0c0','#e8e8e8',
  ],
}

// ── Cassiopeia W radii pattern ────────────────────────────────────────────────
// The 5 stars of Cassiopeia read left→right: α β γ δ ε
// Their altitudes form a W: high, low, high, low, high
// We map that to ring sizes: big gap between rings → "high", small → "low"
// Concretely: outer two rings thick (α=Hair, ε=Wand), middle two thin (β=Skin, δ=Outfit), center (γ=Eyes)
// Radii chosen so the ring widths vary: outer=wide, mid=narrow, center=wide
//   Hair  (α): r1=96  r2=116  width=20  ← high star
//   Skin  (β): r1=78  r2=92   width=14  ← low star
//   Eyes  (γ): r1=52  r2=72   width=20  ← high star (center peak of W)
//   Outfit(δ): r1=34  r2=48   width=14  ← low star
//   Stick (ε): r1=14  r2=30   width=16  ← high star (innermost)
// Reading outward from center the widths go: 16, 14, 20, 14, 20 — W in cross-section

const RINGS = [
  { key: 'hair',   label: 'Hair',  r1: 96,  r2: 116 },
  { key: 'skin',   label: 'Skin',  r1: 78,  r2: 92  },
  { key: 'eyes',   label: 'Eyes',  r1: 52,  r2: 72  },
  { key: 'outfit', label: 'Armor', r1: 34,  r2: 48  },
  { key: 'stick',  label: 'Wand',  r1: 14,  r2: 30  },
]

// ── Geometry ──────────────────────────────────────────────────────────────────

function polarToXY(cx, cy, angleDeg, r) {
  const a = (angleDeg - 90) * Math.PI / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function ringSegPath(cx, cy, r1, r2, startDeg, endDeg) {
  const gap = 0.5
  const s1 = polarToXY(cx, cy, startDeg + gap, r1)
  const e1 = polarToXY(cx, cy, endDeg   - gap, r1)
  const s2 = polarToXY(cx, cy, startDeg + gap, r2)
  const e2 = polarToXY(cx, cy, endDeg   - gap, r2)
  const span = ((endDeg - startDeg) + 360) % 360
  const large = span > 180 ? 1 : 0
  return [
    `M ${s1[0].toFixed(2)} ${s1[1].toFixed(2)}`,
    `A ${r1} ${r1} 0 ${large} 1 ${e1[0].toFixed(2)} ${e1[1].toFixed(2)}`,
    `L ${e2[0].toFixed(2)} ${e2[1].toFixed(2)}`,
    `A ${r2} ${r2} 0 ${large} 0 ${s2[0].toFixed(2)} ${s2[1].toFixed(2)}`,
    'Z',
  ].join(' ')
}

function getPointerAngle(e, svgEl, cx, cy) {
  const rect    = svgEl.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = (clientX - rect.left) / rect.width  * svgEl.viewBox.baseVal.width  - cx
  const y = (clientY - rect.top)  / rect.height * svgEl.viewBox.baseVal.height - cy
  return (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360
}

function getPointerDist(e, svgEl, cx, cy) {
  const rect    = svgEl.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = (clientX - rect.left) / rect.width  * svgEl.viewBox.baseVal.width  - cx
  const y = (clientY - rect.top)  / rect.height * svgEl.viewBox.baseVal.height - cy
  return Math.sqrt(x * x + y * y)
}

// ── Main wheel ────────────────────────────────────────────────────────────────

// button radius flush with innermost ring's inner edge
const CENTER_R = RINGS[RINGS.length - 1].r1

export function CassiopeiaWheel({ colors, onChange, onPreview, onRandom, size = 260 }) {
  const VB  = 260
  const cx  = 130, cy = 130
  const svgRef  = useRef(null)
  const [hov, setHov] = useState(null) // { ringIdx, segIdx }

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
    // ignore clicks on the center button area — handled by foreignObject button
    const dist = getPointerDist(e, svgRef.current, cx, cy)
    if (dist <= CENTER_R) return
    const hit = hitTest(e)
    if (!hit) return
    const ring = RINGS[hit.ringIdx]
    const hex  = PALETTES[ring.key][hit.segIdx]
    onChange({ ...colors, [ring.key]: hex })
  }, [hitTest, colors, onChange])

  // Button size in SVG units
  const btnD = CENTER_R * 2

  return (
    <svg
      ref={svgRef}
      width={size} height={size}
      viewBox={`0 0 ${VB} ${VB}`}
      style={{ display: 'block', userSelect: 'none', touchAction: 'none', cursor: hov ? 'pointer' : 'default' }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
    >
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
              const isHov      = hov?.ringIdx === ri && hov?.segIdx === i
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

      {/* 12-o'clock dashed tick */}
      <line
        x1={cx} y1={cy - RINGS[0].r2 - 2}
        x2={cx} y2={cy - RINGS[RINGS.length - 1].r1 + 2}
        stroke="rgba(168,85,247,0.45)" strokeWidth="1" strokeDasharray="2,2"
        style={{ pointerEvents: 'none' }}
      />

      {/* ? random button flush with innermost ring */}
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
