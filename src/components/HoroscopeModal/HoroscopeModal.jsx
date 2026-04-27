import React, { useState, useEffect } from 'react'
import { generateHoroscope, SIGN_META } from '../../game/astro/horoscope.js'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const PLANET_GLYPHS = { Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂', Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Pluto:'♇', Chiron:'⚷', NorthNode:'☊', Lilith:'⚸', Ascendant:'ASC', Descendant:'DSC', Midheaven:'MC', IC:'IC', Vertex:'Vx', PartOfFortune:'⊕' }
const PLANET_NAMES  = { NorthNode:'North Node', PartOfFortune:'Part of Fortune' }
const PLANET_ORDER  = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','Chiron','NorthNode','Lilith','Ascendant','Descendant','Midheaven','IC','Vertex','PartOfFortune']

const ELEMENT_COLOR = { 
  Fire:  '#fb923c', // Orange
  Earth: '#86efac', // Green
  Air:   '#fef08a', // Yellow (Sunlight/Air)
  Water: '#60a5fa'  // Deep Blue
}

function toInputDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function fmtDeg(decimal) {
  const d = Math.floor(decimal)
  const m = Math.floor((decimal - d) * 60)
  const s = Math.floor(((decimal - d) * 60 - m) * 60)
  return (
    <span className="coord">
      <span className="coord__deg">{d}</span>
      <span className="coord__unit">°</span>
      <span className="coord__val">{String(m).padStart(2, '0')}</span>
      <span className="coord__unit">'</span>
      <span className="coord__val">{String(s).padStart(2, '0')}</span>
      <span className="coord__unit">"</span>
    </span>
  )
}

// ── Birth Chart view ──────────────────────────────────────────────────────────
function BirthChart({ placements, birthData, reading, mode, houseCusps }) {
  const [selected, setSelected] = useState(null)
  
  if (!placements) {
    return (
      <div style={{ color:'#5a3870', fontSize:12, fontStyle:'italic', padding:'8px 0' }}>
        No birth data — enter your birth date in the mirror.
      </div>
    )
  }

  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  const modeTally = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  // houseTally[h] = { Fire:0, Earth:0, Air:0, Water:0 }
  const houseTally = {}

  const displayPlacements = mode === 'chart' ? placements : (reading?._debug?.transitPlacements || placements)
  const rows = PLANET_ORDER.filter(p => displayPlacements[p])

  for (const p of rows) {
    const meta = SIGN_META[displayPlacements[p].sign]
    if (meta) { tally[meta.element]++; modeTally[meta.mode]++ }
    if (displayPlacements[p].house) {
      const h = displayPlacements[p].house
      if (!houseTally[h]) houseTally[h] = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
      if (meta) houseTally[h][meta.element]++
    }
  }

  const dateObj = birthData?.date ? new Date(birthData.date + 'T' + (birthData.time || '12:00')) : null
  const birthLine = [
    dateObj ? dateObj.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : null,
    birthData?.time || null,
    birthData?.city?.name || null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="birth-chart">
      {birthLine && (
        <div className="birth-chart__header">{birthLine}</div>
      )}

      <table className="birth-chart__table">
        <tbody>
          {rows.map(planet => {
            const p    = displayPlacements[planet]
            const meta = SIGN_META[p.sign]
            const col  = ELEMENT_COLOR[meta?.element] ?? '#c8a8f0'
            const isAsc = planet === 'Ascendant'
            const isSelected = selected === planet

            const PLANET_DESC = {
              Sun:       { summary: "Your core self — who you are becoming.", detail: "The Sun is your conscious identity, the ego you build across a lifetime. It shows what you are here to master and express." },
              Moon:      { summary: "Your inner world — how you feel and need.", detail: "The Moon governs your emotional instincts, memory, and what makes you feel safe. It is the part of you that reacts before thinking." },
              Mercury:   { summary: "Your mind — how you think and speak.", detail: "Mercury rules your perception, reasoning, and communication style. It shapes how fast you process ideas and how you express them to others." },
              Venus:     { summary: "Your heart — what you love and desire.", detail: "Venus governs attraction, beauty, and values. It reveals what draws you in and how you behave in close relationships." },
              Mars:      { summary: "Your drive — how you act and fight.", detail: "Mars is raw energy and will. It shows how you pursue goals, handle conflict, and assert yourself when something matters." },
              Jupiter:   { summary: "Your growth — where life opens up for you.", detail: "Jupiter expands whatever it touches. It points to the area of life where you find abundance, optimism, and the urge to seek meaning." },
              Saturn:    { summary: "Your discipline — where you are tested.", detail: "Saturn brings structure through challenge. The sign it occupies reveals where you must work hardest — and where mastery is most rewarding." },
              Uranus:    { summary: "Your rebellion — where you break the mould.", detail: "Uranus moves slowly and shapes a generation. In your chart it marks the area where you hunger for freedom, disruption, and original thought." },
              Neptune:   { summary: "Your dissolution — where you dream and dissolve.", detail: "Neptune blurs boundaries and heightens sensitivity. It shows where you seek transcendence — and where you are most susceptible to illusion." },
              Pluto:     { summary: "Your transformation — where you die and are reborn.", detail: "Pluto moves over decades. Its sign colours generational power. Its degree in your chart marks where deep, irreversible change operates on your soul." },
              Chiron:        { summary: "Your wound — and your path to healing it.", detail: "Chiron marks where you carry a deep, formative wound — one that never fully closes, but which, through working with it, becomes your greatest source of wisdom and healing for others." },
              NorthNode:     { summary: "Your destiny — the direction your soul is growing toward.", detail: "The North Node is not a planet but a point of karmic direction. It shows the unfamiliar territory you are here to grow into, even if it feels uncomfortable." },
              Lilith:        { summary: "Your shadow — raw, undomesticated instinct.", detail: "Black Moon Lilith is the lunar apogee, the Moon's farthest point. It marks where you refuse to submit, where primal energy operates outside social rules — powerful but easily suppressed or over-expressed." },
              Ascendant:     { summary: "Your mask — how others first see you.", detail: "The Ascendant is the zodiac sign rising on the eastern horizon at your birth. It colours your appearance, demeanour, and the instinctive role you play in new situations." },
              Descendant:    { summary: "Your mirror — what you seek in others.", detail: "The Descendant is directly opposite the Ascendant. It describes the qualities you are drawn to in partners and close relationships — often traits you have not yet owned in yourself." },
              Midheaven:     { summary: "Your calling — how you are seen in the world.", detail: "The Midheaven (MC) is the highest point of the chart. It represents your public role, vocation, and the legacy you are building in the eyes of others." },
              IC:            { summary: "Your roots — where you come from and what sustains you.", detail: "The IC (Imum Coeli) is the lowest point of the chart, directly opposite the Midheaven. It speaks of home, ancestry, private foundations, and the psychological bedrock beneath your public life." },
              Vertex:        { summary: "Your fate point — encounters that feel destined.", detail: "The Vertex is a sensitive point on the prime vertical. It marks the kind of people and events that enter your life as if fated — encounters that feel larger than coincidence and tend to change you." },
              AntiVertex:    { summary: "What you bring to fated encounters.", detail: "The Anti-Vertex is directly opposite the Vertex. Where the Vertex describes what arrives from outside, the Anti-Vertex shows the energy and qualities you bring into those destined meetings." },
              PartOfFortune: { summary: "Your joy — where body, soul, and circumstance align.", detail: "The Part of Fortune is an Arabic lot derived from Sun, Moon, and Ascendant. It marks the area of life where you are most naturally lucky and where effort feels effortless." },
            }

            const SIGN_DESC = {
              Aries:       { short: "expressed with boldness and urgency",        long: "Aries sharpens energy into impulse and initiative. There is speed, directness, and a need to be first." },
              Taurus:      { short: "expressed with patience and groundedness",    long: "Taurus slows energy into something steady and embodied. There is persistence, sensuality, and a need for security." },
              Gemini:      { short: "expressed with curiosity and versatility",    long: "Gemini disperses energy across ideas and connections. There is wit, restlessness, and a need to communicate." },
              Cancer:      { short: "expressed through feeling and instinct",      long: "Cancer turns energy inward and protective. There is empathy, memory, and a need to belong and nurture." },
              Leo:         { short: "expressed with warmth and self-assurance",    long: "Leo channels energy into self-expression and generosity. There is pride, creativity, and a need to be seen." },
              Virgo:       { short: "expressed through precision and service",     long: "Virgo focuses energy into analysis and refinement. There is discernment, humility, and a need to be useful." },
              Libra:       { short: "expressed through harmony and relationship",  long: "Libra distributes energy between self and other. There is grace, indecision, and a need for fairness." },
              Scorpio:     { short: "expressed with intensity and depth",          long: "Scorpio concentrates energy into transformation. There is power, suspicion, and a need to uncover what is hidden." },
              Sagittarius: { short: "expressed with freedom and vision",           long: "Sagittarius expands energy toward meaning and horizon. There is optimism, excess, and a need for truth." },
              Capricorn:   { short: "expressed with discipline and ambition",      long: "Capricorn structures energy into long-term achievement. There is patience, control, and a need to build something lasting." },
              Aquarius:    { short: "expressed through originality and detachment",long: "Aquarius breaks energy away from convention. There is brilliance, coldness, and a need to serve a larger idea." },
              Pisces:      { short: "expressed with sensitivity and imagination",  long: "Pisces dissolves energy into the boundless. There is compassion, escapism, and a need to transcend the ordinary." },
            }

            const HOUSE_DESC = {
              1:  { name: "House of Self",          short: "identity, appearance, how you begin things" },
              2:  { name: "House of Resources",     short: "money, possessions, self-worth" },
              3:  { name: "House of Mind",          short: "communication, siblings, short journeys" },
              4:  { name: "House of Home",          short: "roots, family, private foundations" },
              5:  { name: "House of Pleasure",      short: "creativity, romance, play, children" },
              6:  { name: "House of Service",       short: "daily work, health, routines, duty" },
              7:  { name: "House of Partnership",   short: "marriage, close relationships, open enemies" },
              8:  { name: "House of Transformation",short: "death, rebirth, shared resources, the occult" },
              9:  { name: "House of Expansion",     short: "philosophy, travel, higher learning, beliefs" },
              10: { name: "House of Career",        short: "vocation, public reputation, authority" },
              11: { name: "House of Community",     short: "friends, groups, hopes, collective ideals" },
              12: { name: "House of the Hidden",    short: "the unconscious, isolation, karma, undoing" },
            }

            const pd = PLANET_DESC[planet]
            const sd = SIGN_DESC[p.sign]
            const hd = p.house ? HOUSE_DESC[p.house] : null

            return (
              <React.Fragment key={planet}>
                <tr 
                  className={`birth-chart__row${isAsc ? ' birth-chart__row--asc' : ''}${isSelected ? ' is-selected' : ''}`} 
                  style={{ color: col }} 
                  onClick={() => setSelected(isSelected ? null : planet)}
                >
                  <td className="birth-chart__glyph">
                    {PLANET_GLYPHS[planet]}
                  </td>
                  <td className="birth-chart__planet">
                    {PLANET_NAMES[planet] ?? planet}
                  </td>
                  <td className="birth-chart__sign">
                    {p.symbol} {p.sign}
                  </td>
                  <td className="birth-chart__deg">
                    {fmtDeg(p.degrees)}
                  </td>
                  {p.house && (
                    <td className="birth-chart__house">
                      <span className="birth-chart__house-badge" style={{ color: col, borderColor: `${col}55` }}>
                        {p.house}
                      </span>
                    </td>
                  )}
                  <td className="birth-chart__element-cell">
                    <span className="birth-chart__element" style={{ color: col, backgroundColor: `${col}22`, border: `1px solid ${col}44` }}>
                      {meta?.element ?? ''}
                    </span>
                  </td>
                </tr>
                {isSelected && (
                  <tr className="birth-chart__inline-detail">
                    <td colSpan="6">
                      <div className="birth-chart__detail-content" style={{ borderLeftColor: col }}>
                        <strong style={{ color: col }}>{planet} in {p.sign}{hd ? `, ${hd.name}` : ''} — {pd?.summary}, {sd?.short}.</strong>
                        <br/><br/>
                        <span style={{ opacity: 0.9 }}>
                          <em style={{ color: col, fontStyle:'normal' }}>{planet}: </em>{pd?.detail}
                        </span>
                        <br/><br/>
                        <span style={{ opacity: 0.85 }}>
                          <em style={{ color: col, fontStyle:'normal' }}>{p.symbol} {p.sign}: </em>{sd?.long}
                        </span>
                        <br/><br/>
                        <span style={{ opacity: 0.7 }}>
                          <em style={{ fontStyle:'normal' }}>° {Math.floor(p.degrees)}° in sign: </em>{
                            Math.floor(p.degrees) <= 3 ? "Early degrees — this energy is fresh, unformed, and still finding its footing. Raw potential." :
                            Math.floor(p.degrees) <= 9 ? "First decan — this energy expresses in its purest, most archetypal form." :
                            Math.floor(p.degrees) <= 19 ? "Second decan — this energy has matured into complexity and nuance." :
                            Math.floor(p.degrees) <= 26 ? "Third decan — this energy is seasoned, carrying experience and depth." :
                            "Late degrees — this energy is at a threshold, carrying the weight of the sign and approaching a transition."
                          }
                        </span>
                        {hd && <>
                          <br/><br/>
                          <span style={{ opacity: 0.8 }}>
                            <em style={{ color: col, fontStyle:'normal' }}>House {p.house} — {hd.name}: </em>{hd.short}.
                          </span>
                        </>}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>

      {(() => {
        const maxEl   = Object.entries(tally).sort((a,b) => b[1]-a[1])[0]
        const maxMode = Object.entries(modeTally).sort((a,b) => b[1]-a[1])[0]
        const ELEMENT_GLOSS = {
          Fire:  "instinctive, passionate, forward-moving",
          Earth: "grounded, practical, body-aware",
          Air:   "relational, intellectual, idea-driven",
          Water: "intuitive, feeling-led, depth-seeking",
        }
        const MODE_GLOSS = {
          Cardinal: "initiating — you begin things",
          Fixed:    "sustaining — you hold and deepen",
          Mutable:  "adapting — you shift and synthesise",
        }
        const maxHouse = Object.entries(houseTally).sort((a,b) => {
          const ta = Object.values(a[1]).reduce((s,v)=>s+v,0)
          const tb = Object.values(b[1]).reduce((s,v)=>s+v,0)
          return tb - ta
        })[0]
        const maxHouseCount = maxHouse ? Object.values(maxHouse[1]).reduce((s,v)=>s+v,0) : 1
        const houseTotal = h => houseTally[h] ? Object.values(houseTally[h]).reduce((s,v)=>s+v,0) : 0
        const HOUSE_THEMES = {
          1: 'self', 2: 'resources', 3: 'mind', 4: 'home', 5: 'pleasure',
          6: 'service', 7: 'partnership', 8: 'transformation', 9: 'expansion',
          10: 'career', 11: 'community', 12: 'hidden'
        }
        const ELEMENTS_ORDER = ['Fire', 'Earth', 'Air', 'Water']
        // dominant element in busiest house for gloss color
        const maxHouseEl = maxHouse
          ? Object.entries(maxHouse[1]).sort((a,b)=>b[1]-a[1])[0][0]
          : 'Air'

        return (
          <>
          <div className="birth-chart__summary">
            <div className="birth-chart__summary-column">
              <div className="birth-chart__summary-title">Elements</div>
              <div className="birth-chart__summary-bars">
                {Object.entries(tally).map(([el, n]) => {
                  const isDominant = el === maxEl[0] && n > 0
                  return (
                    <div key={el} className={`birth-chart__bar-row${isDominant ? ' is-dominant' : ''}`} style={{ opacity: n === 0 ? 0.2 : 1 }}>
                      <span className="birth-chart__bar-label" style={{ color: ELEMENT_COLOR[el] }}>{el}</span>
                      <div className="birth-chart__bar-track">
                        <div className="birth-chart__bar-fill" style={{ width: maxEl[1] > 0 ? `${(n / maxEl[1]) * 100}%` : '0%', backgroundColor: ELEMENT_COLOR[el] }} />
                      </div>
                      <span className="birth-chart__bar-count" style={{ color: ELEMENT_COLOR[el] }}>{n}</span>
                    </div>
                  )
                })}
              </div>
              {maxEl[1] > 0 && (
                <div className="birth-chart__summary-gloss" style={{ color: ELEMENT_COLOR[maxEl[0]] }}>
                  Dominant {maxEl[0]} — {ELEMENT_GLOSS[maxEl[0]]}.
                </div>
              )}
            </div>

            <div className="birth-chart__summary-column">
              <div className="birth-chart__summary-title">Modalities</div>
              <div className="birth-chart__summary-bars">
                {Object.entries(modeTally).map(([mode, n]) => {
                  const isDominant = mode === maxMode[0] && n > 0
                  const modeCol = { Cardinal: '#f472b6', Fixed: '#a78bfa', Mutable: '#34d399' }[mode]
                  return (
                    <div key={mode} className={`birth-chart__bar-row${isDominant ? ' is-dominant' : ''}`} style={{ opacity: n === 0 ? 0.2 : 1 }}>
                      <span className="birth-chart__bar-label" style={{ color: modeCol }}>{mode}</span>
                      <div className="birth-chart__bar-track">
                        <div className="birth-chart__bar-fill" style={{ width: maxMode[1] > 0 ? `${(n / maxMode[1]) * 100}%` : '0%', backgroundColor: modeCol }} />
                      </div>
                      <span className="birth-chart__bar-count" style={{ color: modeCol }}>{n}</span>
                    </div>
                  )
                })}
              </div>
              {maxMode[1] > 0 && (
                <div className="birth-chart__summary-gloss" style={{ color: '#9a78c0' }}>
                  Dominant {maxMode[0]} — {MODE_GLOSS[maxMode[0]]}.
                </div>
              )}
            </div>
          </div>

          {maxHouse && (() => {
            const cx = 120, cy = 120, size = 240
            const RING_RADII = { Fire: [84, 100], Earth: [66, 82], Air: [48, 64], Water: [30, 46] }
            const BASE_R  = 100  // outer edge of element rings
            const SIGN_R1 = 102  // sign symbol ring inner
            const SIGN_R2 = 118  // sign symbol ring outer
            const OUTER_R = 118
            const INNER_R = 18
            const GAP_DEG = 1.5

            const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

            function polarToXY(angleDeg, r) {
              const a = (angleDeg - 90) * Math.PI / 180
              return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
            }

            function arc(startDeg, endDeg, r1, r2) {
              const s1 = polarToXY(startDeg, r1), e1 = polarToXY(endDeg, r1)
              const s2 = polarToXY(startDeg, r2), e2 = polarToXY(endDeg, r2)
              const large = endDeg - startDeg > 180 ? 1 : 0
              return `M ${s1[0]} ${s1[1]} A ${r1} ${r1} 0 ${large} 1 ${e1[0]} ${e1[1]} L ${e2[0]} ${e2[1]} A ${r2} ${r2} 0 ${large} 0 ${s2[0]} ${s2[1]} Z`
            }

            // Get sign index for each house cusp
            function cuspSignIdx(h) {
              if (!houseCusps) return (h - 1) % 12
              const lon = houseCusps[h - 1]
              return Math.floor(((lon % 360) + 360) % 360 / 30)
            }

            return (
              <div style={{ marginTop: 16 }}>
                <div className="birth-chart__summary-title" style={{ marginBottom: 8 }}>Houses</div>
                <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>

                  {Array.from({length: 12}, (_, i) => {
                    const h = i + 1
                    const startDeg = i * 30 + GAP_DEG / 2
                    const endDeg   = (i + 1) * 30 - GAP_DEG / 2
                    const midDeg   = i * 30 + 15
                    const elCounts = houseTally[h] || {}
                    const n        = houseTotal(h)
                    const signIdx  = cuspSignIdx(h)
                    const signEl   = SIGN_META[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][signIdx]]?.element ?? 'Air'
                    const signCol  = ELEMENT_COLOR[signEl]

                    const [lx, ly]   = polarToXY(midDeg, 24)
                    const [sx, sy]   = polarToXY(midDeg, 110)

                    return (
                      <g key={h}>
                        {/* base segment */}
                        <path d={arc(startDeg, endDeg, INNER_R, BASE_R)}
                          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />

                        {/* sign band */}
                        <path d={arc(startDeg, endDeg, SIGN_R1, SIGN_R2)}
                          fill={`${signCol}22`} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />

                        {/* element rings */}
                        {n > 0 && ELEMENTS_ORDER.filter(el => elCounts[el] > 0).map(el => {
                          const [r1, r2] = RING_RADII[el]
                          return (
                            <path key={el} d={arc(startDeg, endDeg, r1, r2)}
                              fill={ELEMENT_COLOR[el]} opacity={0.7 + elCounts[el] * 0.08}
                              stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
                          )
                        })}

                        {/* house number in centre zone */}
                        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                          fontSize={h === 1 ? '8' : '7'} fontFamily="monospace" fontWeight={h === 1 ? '900' : '600'}
                          fill={h === 1 ? 'rgba(255,255,255,1)' : n > 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)'}>
                          {h}
                        </text>

                        {/* sign symbol in outer band */}
                        <text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle"
                          fontSize="10" fill={signCol} opacity="0.9">
                          {SIGN_SYMBOLS[signIdx]}
                        </text>

                        {/* planet count — small, between sign band and element rings */}
                        {n > 0 && (() => {
                          const [px, py] = polarToXY(midDeg, 92)
                          return (
                            <text x={px} y={py} textAnchor="middle" dominantBaseline="middle"
                              fontSize="7" fontFamily="monospace" fontWeight="700"
                              fill="rgba(255,255,255,0.6)">
                              {n}
                            </text>
                          )
                        })()}

                        {/* H1 top marker */}
                        {h === 1 && (() => {
                          const [mx, my] = polarToXY(0, OUTER_R + 6)
                          return <circle cx={mx} cy={my} r="2.5" fill="rgba(255,255,255,0.7)" />
                        })()}
                      </g>
                    )
                  })}

                  {/* centre hole */}
                  <circle cx={cx} cy={cy} r={INNER_R - 1} fill="#0e0a1e" />
                </svg>

                <div className="birth-chart__summary-gloss" style={{ color: ELEMENT_COLOR[maxHouseEl], marginTop: 8, textAlign: 'center' }}>
                  {maxHouseCount >= 3 ? 'Stellium' : 'Focus'} in H{maxHouse[0]} ({HOUSE_THEMES[Number(maxHouse[0])]}) — {maxHouseCount} placements.
                </div>
              </div>
            )
          })()}
          </>
        )
      })()}
    </div>
  )
}

// ── Debug placements table ────────────────────────────────────────────────────
function PlacementsTable({ placements }) {
  if (!placements) return null
  return (
    <table style={{ width:'100%', fontSize:11, borderCollapse:'collapse' }}>
      <thead>
        <tr style={{ color:'#7a5898', borderBottom:'1px solid #2a1848' }}>
          <th style={{ textAlign:'left',  padding:'2px 4px' }}>Body</th>
          <th style={{ textAlign:'right', padding:'2px 4px' }}>Longitude</th>
          <th style={{ textAlign:'left',  padding:'2px 4px' }}>Sign</th>
          <th style={{ textAlign:'right', padding:'2px 4px' }}>° in sign</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(placements).map(([planet, p]) => (
          <tr key={planet} style={{ borderBottom:'1px solid #120e20' }}>
            <td style={{ padding:'2px 4px', color:'#e8d4ff' }}>{PLANET_GLYPHS[planet] ?? '·'} {planet}</td>
            <td style={{ textAlign:'right', padding:'2px 4px', color:'#9a78c0', fontFamily:'monospace' }}>{p.longitude.toFixed(2)}°</td>
            <td style={{ padding:'2px 4px', color:'#c8a8f0' }}>{p.symbol} {p.sign}</td>
            <td style={{ textAlign:'right', padding:'2px 4px', color:'#9a78c0', fontFamily:'monospace' }}>{p.degrees.toFixed(1)}°</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function HoroscopeModal({ birthData, onClose }) {
  // mode: 'reading' | 'chart' | 'debug'
  const [mode,       setMode]       = useState('reading')
  const [transitStr, setTransitStr] = useState(() => toInputDate(new Date()))
  const [reading,    setReading]    = useState(() => generateHoroscope(new Date(), birthData))

  useEffect(() => {
    try {
      const transit = new Date(transitStr + 'T12:00:00')
      setReading(generateHoroscope(transit, birthData))
    } catch {}
  }, [transitStr, birthData])

  useEffect(() => {
    const handler = e => {
      if (e.code === 'Escape') onClose()
      if (e.code === 'F1')    setMode(m => m === 'debug' ? 'reading' : 'debug')
      if (e.code === 'KeyC' && e.altKey) setMode(m => m === 'chart' ? 'reading' : 'chart')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const { zodiac, cosmic, moonline, guidance, lucky, gated, _debug } = reading
  const now       = new Date()
  const dateLabel = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

  const titles = { reading: 'The Stars Speak', chart: 'Natal Chart', debug: 'Horoscope Engine' }
  const wide   = mode !== 'reading'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}
           style={wide ? { maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' } : undefined}>

        <div className="modal__header">
          <span className="modal__zodiac">{zodiac.symbol}</span>
          <div>
            <div className="modal__title">{titles[mode]}</div>
            <div className="modal__subtitle">
              {mode === 'debug'
                ? <input type="date" value={transitStr} onChange={e => setTransitStr(e.target.value)}
                    style={{ background:'#1a1030', color:'#c8a8f0', border:'1px solid #4a2878', padding:'2px 6px', fontSize:11 }} />
                : `${dateLabel} · ${zodiac.name}${zodiac.rising ? ` · ↑ ${zodiac.rising}` : ''}`}
            </div>
          </div>
          <span className="modal__zodiac">{zodiac.symbol}</span>
        </div>

        <div className="modal__body">

          {/* ── Reading ── */}
          {mode === 'reading' && (
            <>
              {gated ? (
                <div className="modal__section">
                  <div className="modal__text" style={{ opacity:0.5, fontStyle:'italic' }}>
                    The glass sees no birth, no beginning.<br />
                    It cannot read you yet.<br /><br />
                    Return to the mirror and reveal when you were born.
                  </div>
                </div>
              ) : (
                <>
                  <div className="modal__section">
                    <div className="modal__label">Cosmic Weather</div>
                    <div className="modal__text">{cosmic}</div>
                  </div>
                  <div className="modal__section">
                    <div className="modal__label">The Moon</div>
                    <div className="modal__text">{moonline}</div>
                  </div>
                  <div className="modal__section">
                    <div className="modal__label">Guidance</div>
                    <div className="modal__text">{guidance}</div>
                  </div>
                  <div className="modal__section">
                    <div className="modal__label">Lucky {lucky.element}</div>
                    <div className="modal__text modal__lucky-value">{lucky.value}</div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Birth Chart ── */}
          {mode === 'chart' && (
            <div className="modal__section">
              <BirthChart placements={_debug.natalPlacements} birthData={birthData} reading={reading} mode={mode} houseCusps={_debug.natalHouses} />
            </div>
          )}

          {/* ── Debug ── */}
          {mode === 'debug' && (
            <>
              <div className="modal__section">
                <div className="modal__label">Transit Positions</div>
                <PlacementsTable placements={_debug.transitPlacements} />
              </div>

              <div className="modal__section">
                <div className="modal__label">
                  Natal Positions{birthData?.date
                    ? ` · ${birthData.date}${birthData.time ? ' '+birthData.time : ''}${birthData.city ? ', '+birthData.city.name : ''}`
                    : ' — none'}
                </div>
                <PlacementsTable placements={_debug.natalPlacements} />
              </div>

              <div className="modal__section">
                <div className="modal__label">Transit → Natal Aspects ({_debug.transitNatalAspects.length})</div>
                {_debug.transitNatalAspects.map((asp, i) => (
                  <div key={i} style={{ fontSize:11, color: i < 3 ? '#c8a8f0' : '#5a3870', marginBottom:3, display:'flex', justifyContent:'space-between' }}>
                    <span>
                      {PLANET_GLYPHS[asp.transit] ?? '·'} t.{asp.transit} {asp.aspect.symbol} n.{asp.natal} {PLANET_GLYPHS[asp.natal] ?? '·'}
                      <span style={{ color:'#7a5898', marginLeft:6 }}>{asp.aspect.name}</span>
                    </span>
                    <span style={{ fontFamily:'monospace', color:'#5a3870' }}>{(asp.exactness*100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>

              <div className="modal__section">
                <div className="modal__label">Reading</div>
                {gated
                  ? <div style={{ fontSize:11, color:'#5a3870', fontStyle:'italic' }}>Gated — no birth date.</div>
                  : <>
                      <div className="modal__text" style={{ marginBottom:5, fontSize:12 }}>{cosmic}</div>
                      <div className="modal__text" style={{ marginBottom:5, fontSize:12 }}>{moonline}</div>
                      <div className="modal__text modal__lucky-value" style={{ fontSize:12 }}>{guidance}</div>
                      {_debug.guidanceSource && (
                        <div style={{ fontSize:10, color:'#5a3870', marginTop:4 }}>
                          t.{_debug.guidanceSource.transit} {_debug.guidanceSource.aspect.name} n.{_debug.guidanceSource.natal}
                          {' '}({(_debug.guidanceSource.exactness*100).toFixed(0)}% exact)
                        </div>
                      )}
                    </>
                }
              </div>
            </>
          )}

        </div>

        <div className="modal__footer">
          {mode !== 'chart'   && <button className="modal__close" onClick={() => setMode('chart')}   style={{ marginRight:8, opacity:0.55 }}>Chart — Alt+C</button>}
          {mode !== 'reading' && <button className="modal__close" onClick={() => setMode('reading')} style={{ marginRight:8, opacity:0.55 }}>Reading</button>}
          {mode !== 'debug'   && <button className="modal__close" onClick={() => setMode('debug')}   style={{ marginRight:8, opacity:0.55 }}>Debug — F1</button>}
          <button className="modal__close" onClick={onClose}>Close — Esc</button>
        </div>

      </div>
    </div>
  )
}
