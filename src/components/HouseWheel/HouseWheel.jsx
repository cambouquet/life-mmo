import React, { useState } from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'

const ELEMENT_COLOR = { Fire: '#fb923c', Earth: '#86efac', Air: '#fef08a', Water: '#60a5fa' }

const PLANET_GLYPHS = { Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂', Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Pluto:'♇', Chiron:'⚷', NorthNode:'☊', SouthNode:'☋', Lilith:'⚸', Ascendant:'Asc', Descendant:'Dsc', Midheaven:'MC', IC:'IC', Vertex:'Vx', PartOfFortune:'⊕' }
const PLANET_NAMES  = { NorthNode:'North Node', SouthNode:'South Node', PartOfFortune:'Part of Fortune', IC: 'Imum Coeli', Ascendant: 'Ascendant', Midheaven: 'Midheaven' }
const PLANET_ORDER  = ['Sun','Ascendant','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','Chiron','NorthNode','SouthNode','Lilith','Descendant','Midheaven','IC','Vertex','PartOfFortune']

const SIGN_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']

const ORBITS = [
  { id: 'Sun',           r: 30 },
  { id: 'Moon',          r: 37 },
  { id: 'Mercury',       r: 44 },
  { id: 'Venus',         r: 51 },
  { id: 'Mars',          r: 58 },
  { id: 'NorthNode',     r: 65 },
  { id: 'Jupiter',       r: 72 },
  { id: 'Saturn',        r: 79 },
  { id: 'Chiron',        r: 86 },
  { id: 'Uranus',        r: 93 },
  { id: 'Neptune',       r: 100 },
  { id: 'Pluto',         r: 107 },
  { id: 'Lilith',        r: 114 },
  { id: 'PartOfFortune', r: 121 },
]
const PLANET_RINGS = ORBITS.reduce((acc, o) => ({ ...acc, [o.id]: o.r }), {})

export const HOUSE_THEMES = {
  1:'self', 2:'resources', 3:'mind', 4:'home', 5:'pleasure',
  6:'service', 7:'partnership', 8:'transformation', 9:'expansion',
  10:'career', 11:'community', 12:'hidden'
}
const HOUSE_NAMES = {
  1:'House of Self', 2:'House of Resources', 3:'House of Mind', 4:'House of Home',
  5:'House of Pleasure', 6:'House of Service', 7:'House of Partnership',
  8:'House of Transformation', 9:'House of Expansion', 10:'House of Career',
  11:'House of Community', 12:'House of the Hidden'
}
const HOUSE_LONG = {
  1:"Defines the ego, self-image, and your natural approach to the world.",
  2:"Governs material security, earnable income, and self-worth.",
  3:"Rules the logical mind, siblings, and how you exchange information daily.",
  4:"Represents your roots, family history, and inner sense of security.",
  5:"The sector of self-expression, artistic pursuits, and risk-taking.",
  6:"Focuses on service to others, physical well-being, and work habits.",
  7:"Rules one-to-one connections, contracts, and what you seek in a companion.",
  8:"The house of profound change, intimacy, shared wealth, and the occult.",
  9:"Governs the quest for meaning, higher education, and travel.",
  10:"Represents your highest achievements and professional reputation.",
  11:"Focuses on networking, humanitarian efforts, and long-term hopes.",
  12:"The sector of secrets, dreams, karma, and dissolution of the ego.",
}
const SIGN_DESC_LONG = {
  Aries:"Aries sharpens energy into impulse and initiative. There is speed, directness, and a need to be first.",
  Taurus:"Taurus slows energy into something steady and embodied. There is persistence, sensuality, and a need for security.",
  Gemini:"Gemini disperses energy across ideas and connections. There is wit, restlessness, and a need to communicate.",
  Cancer:"Cancer turns energy inward and protective. There is empathy, memory, and a need to belong and nurture.",
  Leo:"Leo channels energy into self-expression and generosity. There is pride, creativity, and a need to be seen.",
  Virgo:"Virgo focuses energy into analysis and refinement. There is discernment, humility, and a need to be useful.",
  Libra:"Libra distributes energy between self and other. There is grace, indecision, and a need for fairness.",
  Scorpio:"Scorpio concentrates energy into transformation. There is power, suspicion, and a need to uncover what is hidden.",
  Sagittarius:"Sagittarius expands energy toward meaning and horizon. There is optimism, excess, and a need for truth.",
  Capricorn:"Capricorn structures energy into long-term achievement. There is patience, control, and a need to build something lasting.",
  Aquarius:"Aquarius breaks energy away from convention. There is brilliance, coldness, and a need to serve a larger idea.",
  Pisces:"Pisces dissolves energy into the boundless. There is compassion, escapism, and a need to transcend the ordinary.",
}
const PLANET_SUMMARY = {
  Sun:"Your core self — who you are becoming.", Moon:"Your inner world — how you feel and need.",
  Mercury:"Your mind — how you think and speak.", Venus:"Your heart — what you love and desire.",
  Mars:"Your drive — how you act and fight.", Jupiter:"Your growth — where life opens up.",
  Saturn:"Your discipline — where you are tested.", Uranus:"Your rebellion — where you break the mould.",
  Neptune:"Your dissolution — where you dream.", Pluto:"Your transformation — death and rebirth.",
  Chiron:"Your wound — and your path to healing.", NorthNode:"Your destiny — soul direction.",
  SouthNode:"Your past — the karma you were born with.", Lilith:"Your shadow — raw instinct.",
  Ascendant:"Your mask — how others first see you.", Descendant:"Your mirror — what you seek.",
  Midheaven:"Your calling — how you are seen in the world.", IC:"Your roots — what sustains you.",
  Vertex:"Your fate point — destined encounters.", PartOfFortune:"Your joy — where circumstance aligns.",
}

// ── Main component ────────────────────────────────────────────────────────────
// Props:
//   placements — object from enrichPlacements() (has .longitude, .sign, .degrees, .house)
//   houseCusps — array[12] of ecliptic longitudes from getPlacidusHouses()
//   size       — optional SVG size in px (default 300)
export function HouseWheel({ placements, houseCusps, size = 300, hideStellium }) {
  const [hovered,     setHovered]     = useState(null)
  const [lockedPoint, setLockedPoint] = useState(null)

  if (!placements) return null

  // All radii are in SVG units (viewBox 300×300), rendered size handled by SVG scaling
  const cx = 150, cy = 150
  const BASE_R   = 122  // inner edge of house band (just outside outermost orbit r=121)
  const HOUSE_R1 = 126  // house number band inner
  const HOUSE_R2 = 138  // house number band outer  (+12)
  const SIGN_R1  = 143  // sign band inner           (+5 gap)
  const SIGN_R2  = 158  // sign band outer           (+15)
  const INNER_R  = 20
  const GAP_DEG  = 1.0

  function polarToXY(angleDeg, r) {
    const a = (angleDeg - 90) * Math.PI / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }

  function arc(startDeg, endDeg, r1, r2) {
    if ([startDeg, endDeg, r1, r2].some(isNaN)) return ''
    const s1 = polarToXY(startDeg, r1), e1 = polarToXY(endDeg, r1)
    const s2 = polarToXY(startDeg, r2), e2 = polarToXY(endDeg, r2)
    // Handle arcs that cross the 0 line or are near it
    const delta = (endDeg - startDeg + 360) % 360
    const large = delta > 180 ? 1 : 0
    return `M ${s1[0]} ${s1[1]} A ${r1} ${r1} 0 ${large} 1 ${e1[0]} ${e1[1]} L ${e2[0]} ${e2[1]} A ${r2} ${r2} 0 ${large} 0 ${s2[0]} ${s2[1]} Z`
  }

  const rows = PLANET_ORDER.filter(p => placements[p])
  const ascLong = houseCusps ? houseCusps[0] : 0

  // House tally for gloss
  const houseTally = {}
  for (const p of rows) {
    const pd = placements[p]
    if (pd?.house) {
      const h = pd.house
      const el = SIGN_META[pd.sign]?.element
      if (!houseTally[h]) houseTally[h] = {}
      if (el) houseTally[h][el] = (houseTally[h][el] || 0) + 1
    }
  }
  const houseTotal = h => houseTally[h] ? Object.values(houseTally[h]).reduce((s,v)=>s+v,0) : 0
  const maxHouseEntry = Object.entries(houseTally).sort((a,b) =>
    Object.values(b[1]).reduce((s,v)=>s+v,0) - Object.values(a[1]).reduce((s,v)=>s+v,0)
  )[0]
  const maxHouseCount = maxHouseEntry ? Object.values(maxHouseEntry[1]).reduce((s,v)=>s+v,0) : 0
  const maxHouseEl = maxHouseEntry
    ? Object.entries(maxHouseEntry[1]).sort((a,b)=>b[1]-a[1])[0][0]
    : 'Air'

  const getInterpretation = pName => {
    const pd = placements[pName]
    if (!pd) return ''
    const deg   = Math.floor(pd.degrees)
    const decan = deg <= 9 ? '1st decan' : deg <= 19 ? '2nd decan' : '3rd decan'
    const hName = HOUSE_NAMES[pd.house] ?? `House ${pd.house}`
    const hLong = HOUSE_LONG[pd.house] ?? ''
    const sMeta = SIGN_META[pd.sign]
    const sLong = SIGN_DESC_LONG[pd.sign] ?? pd.sign
    return `${pName} in ${pd.sign} at ${deg}° (${decan}), ${hName}. ${sLong} ${hLong}`
  }

  return (
    <div className="house-wheel-container" style={{ 
      position: 'relative', 
      padding: '20px', 
      margin: '0 auto',
      width: 'fit-content'
    }}>
      <svg width={size} height={size} viewBox="0 0 300 300"
           style={{ display:'block', margin:'0 auto', overflow:'visible' }}>

        {/* orbit guide tracks */}
        {ORBITS.map(o => (
          <circle key={o.id} cx={cx} cy={cy} r={o.r}
            fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        ))}

        {/* centre deco */}
        <circle cx={cx} cy={cy} r="30"
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5" strokeDasharray="2,2" />
        <circle cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.15)" />

        {/* sign ring */}
        {SIGN_NAMES.map((signName, sigIdx) => {
          const signCol  = ELEMENT_COLOR[SIGN_META[signName]?.element] ?? '#fff'
          const sStart   = (((sigIdx * 30) - ascLong + 360) % 360) + GAP_DEG / 2
          const sEnd     = sStart + 30 - GAP_DEG
          const sMid     = sStart + 15
          const [sx, sy] = polarToXY(sMid, (SIGN_R1 + SIGN_R2) / 2)
          const isHov    = hovered?.type === 'sign' && hovered.id === signName
          return (
            <g key={signName}
               onMouseEnter={() => setHovered({ type:'sign', id:signName, label:signName, desc:SIGN_DESC_LONG[signName], color:signCol })}
               onMouseLeave={() => setHovered(null)}
               style={{ cursor:'default' }}>
              <path d={arc(sStart, sEnd, SIGN_R1, SIGN_R2)}
                fill={isHov ? `${signCol}66` : `${signCol}33`}
                stroke={isHov ? `${signCol}ff` : `${signCol}66`}
                strokeWidth={isHov ? '1.5' : '1'}
 />
              <text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle"
                fontSize="6.5" fill="rgba(255,255,255,0.9)" fontWeight="800">
                {signName}
              </text>
            </g>
          )
        })}

        {/* house slices */}
        {Array.from({length:12}, (_,i) => {
          const h = i + 1
          const hStartRaw = houseCusps && !isNaN(houseCusps[i])         ? houseCusps[i]                  - ascLong : i * 30
          const hEndRaw   = houseCusps && !isNaN(houseCusps[i===11?0:i+1]) ? houseCusps[i===11?0:i+1] - ascLong : (i+1) * 30
          const startDeg  = ((hStartRaw + 360) % 360) + GAP_DEG / 2
          const endDeg    = ((hEndRaw < hStartRaw ? hEndRaw + 360 : hEndRaw) % 720) - GAP_DEG / 2
          const midDeg    = (startDeg + (endDeg < startDeg ? endDeg + 360 : endDeg)) / 2
          const n         = houseTotal(h)
          const housePlanets = rows.filter(pn => placements[pn]?.house === h)
          const isHov     = hovered?.type === 'house' && hovered.id === h

          return (
            <g key={h}
               onMouseEnter={() => setHovered({ type:'house', id:h, label:`House ${h}`, theme:HOUSE_THEMES[h], desc:HOUSE_LONG[h] })}
               onMouseLeave={() => setHovered(null)}
               style={{ cursor:'default' }}>

              <path d={arc(startDeg, endDeg, INNER_R, BASE_R)}
                fill={isHov ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)'}
                stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

              <path d={arc(startDeg, endDeg, HOUSE_R1, HOUSE_R2)}
                fill={isHov ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}
                stroke={isHov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)'}
                strokeWidth="1.2" />

              {housePlanets.map(pName => {
                const pd   = placements[pName]
                const col  = ELEMENT_COLOR[SIGN_META[pd.sign]?.element] ?? '#fff'
                const ringR = PLANET_RINGS[pName] || 50
                const pDeg  = (pd.longitude - ascLong + 360) % 360
                const [px, py] = polarToXY(pDeg, ringR)
                const isPHov = hovered?.type === 'planet' && hovered.id === pName
                return (
                  <g key={pName}
                     onMouseEnter={e => { e.stopPropagation(); setHovered({ type:'planet', id:pName, label:PLANET_NAMES[pName] ?? pName, summary:PLANET_SUMMARY[pName], glyph:PLANET_GLYPHS[pName], color:col }) }}
                     onMouseLeave={() => setHovered(null)}
                     onClick={e => { e.stopPropagation(); setLockedPoint(lockedPoint === pName ? null : pName) }}
                     style={{ cursor:'pointer' }}>
                    <circle cx={px} cy={py} r={isPHov ? 7 : 5}
                      fill={`${col}${isPHov ? '33' : '15'}`}
                      stroke={`${col}${isPHov ? '66' : '33'}`}
                      strokeWidth={isPHov ? '1.5' : '0.5'} />
                    <text x={px} y={py} textAnchor="middle" dominantBaseline="middle"
                      fontSize={isPHov ? 10 : 8} fill={col} fontWeight="900" style={{ pointerEvents:'none' }}>
                      {PLANET_GLYPHS[pName]}
                    </text>
                  </g>
                )
              })}

              {(() => {
                const [hx, hy] = polarToXY(midDeg, (HOUSE_R1 + HOUSE_R2) / 2)
                return (
                  <text x={hx} y={hy} textAnchor="middle" dominantBaseline="middle"
                    fontSize="7" fontFamily="monospace" fontWeight="800"
                    fill={n > 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'}>
                    {h}
                  </text>
                )
              })()}

              {h === 1 && (() => {
                const [mx, my] = polarToXY(0, SIGN_R2 + 4)
                return <circle cx={mx} cy={my} r="2.5" fill="rgba(255,255,255,0.5)" />
              })()}
            </g>
          )
        })}

        <circle cx={cx} cy={cy} r="10" fill="#0e0a1e" />
      </svg>

      {/* fixed-height tooltip area — always reserves space so Stellium never shifts */}
      <div style={{ position:'relative', height: 110, marginTop: 10 }}>
        {(lockedPoint || hovered) && (() => {
          const active = lockedPoint
            ? { type:'planet', id:lockedPoint, label:PLANET_NAMES[lockedPoint] ?? lockedPoint, glyph:PLANET_GLYPHS[lockedPoint],
                color: ELEMENT_COLOR[SIGN_META[placements[lockedPoint]?.sign]?.element] ?? '#fff',
                desc: getInterpretation(lockedPoint), locked:true }
            : hovered
          return (
            <div style={{
              position:'absolute', top:0, left:0, right:0,
              padding:'10px 14px',
              background: active.locked ? 'rgba(14,10,30,0.96)' : 'rgba(14,10,30,0.92)',
              border: active.locked ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius:6, zIndex:10,
              color:'#e8d4ff', fontFamily:'inherit',
            }}>
              {active.locked && (
                <div onClick={() => setLockedPoint(null)}
                     style={{ position:'absolute', top:6, right:10, cursor:'pointer', fontSize:11, color:'rgba(255,255,255,0.4)' }}>✕</div>
              )}
              {active.type === 'planet' ? (<>
                <div style={{ color:active.color, fontWeight:700, fontSize:13, marginBottom:4 }}>{active.glyph} {active.label}</div>
                <div style={{ fontSize:11, color:'rgba(232,212,255,0.8)', lineHeight:'1.5' }}>
                  {active.locked ? active.desc : active.summary}
                </div>
              </>) : active.type === 'sign' ? (<>
                <div style={{ color:active.color, fontWeight:700, fontSize:13, marginBottom:4 }}>{active.label}</div>
                <div style={{ fontSize:11, color:'rgba(232,212,255,0.8)', lineHeight:'1.4' }}>{active.desc}</div>
              </>) : (<>
                <div style={{ color:'#e8d4ff', fontWeight:700, fontSize:13, marginBottom:4 }}>{HOUSE_NAMES[active.id]}</div>
                <div style={{ fontSize:11, color:'rgba(232,212,255,0.8)', lineHeight:'1.4' }}>{active.desc}</div>
              </>)}
            </div>
          )
        })()}
      </div>

      {!hideStellium && maxHouseEntry && (
        <div style={{ fontSize:11, fontStyle:'italic', color:ELEMENT_COLOR[maxHouseEl], marginTop:12, textAlign:'center', opacity:0.8 }}>
          {maxHouseCount >= 3 ? 'Stellium' : 'Focus'} in H{maxHouseEntry[0]} ({HOUSE_THEMES[Number(maxHouseEntry[0])]}) — {maxHouseCount} placements.
        </div>
      )}
    </div>
  )
}
