import React, { useState } from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { HouseWheel } from '../HouseWheel/HouseWheel.jsx'
import {
  PLANET_GLYPHS, SIGN_GLYPHS, PLANET_NAMES, PLANET_ORDER,
  PLANET_DESC, SIGN_DESC, HOUSE_DESC, ELEMENT_COLOR
} from './astroConstants.js'
import { PrimaryPlacementsPanel } from './PrimaryPlacementsPanel.jsx'

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

export function BirthChart({ placements, birthData, reading, mode, houseCusps }) {
  const [selected, setSelected] = useState(null)
  const [hovered,  setHovered]  = useState(null)
  const [lockedPoint, setLockedPoint] = useState(null)

  if (!placements) {
    return (
      <div style={{ color:'#5a3870', fontSize:12, fontStyle:'italic', padding:'8px 0' }}>
        No birth data — enter your birth date in the mirror.
      </div>
    )
  }

  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  const modeTally = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  const houseTally = {}

  const displayPlacements = mode === 'chart' ? placements : (reading?._debug?.transitPlacements || placements)
  if (!displayPlacements) return null

  const rows = PLANET_ORDER.filter(p => displayPlacements[p])

  for (const p of rows) {
    const pData = displayPlacements[p]
    if (!pData) continue
    const meta = SIGN_META[pData.sign]
    if (meta) {
      tally[meta.element] = (tally[meta.element] || 0) + 1
      modeTally[meta.mode] = (modeTally[meta.mode] || 0) + 1
    }
    if (pData.house) {
      const h = pData.house
      if (!houseTally[h]) houseTally[h] = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
      if (meta) houseTally[h][meta.element] = (houseTally[h][meta.element] || 0) + 1
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
      <PrimaryPlacementsPanel placements={displayPlacements} />

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
        const big3 = ['Sun', 'Moon', 'Ascendant'].map(key => {
          const p = displayPlacements[key]
          if (!p) return null
          const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
          const sGlyph = SIGN_GLYPHS[p.sign] || ''
          const pGlyph = PLANET_GLYPHS[key] || ''
          return (
            <span key={key} style={{ color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.25em' }}>{pGlyph}</span>
              <span style={{ fontWeight: 800 }}>{p.sign} {sGlyph}</span>
              <span style={{ opacity: 0.9, fontSize: '0.95em' }}>{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
              <span style={{ opacity: 0.5, fontSize: '0.85em', fontStyle: 'italic' }}>H{p.house}</span>
            </span>
          )
        }).filter(Boolean)

        const hTally = {}
        rows.forEach(pName => {
          const p = displayPlacements[pName]
          if (p && p.house) {
            hTally[p.house] = (hTally[p.house] || 0) + 1
          }
        })
        const maxH = Object.entries(hTally).sort((a,b) => b[1] - a[1])[0]
        const maxHCount = maxH ? maxH[1] : 0
        const hId = maxH ? maxH[0] : null

        const HOUSE_THEMES_FIXED = {
          1: 'self', 2: 'resources', 3: 'mind', 4: 'home', 5: 'pleasure',
          6: 'service', 7: 'partnership', 8: 'transformation', 9: 'expansion',
          10: 'career', 11: 'community', 12: 'hidden'
        }

        const stelliumText = hId ? (
          <div style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '10px',
            fontStyle: 'italic',
            letterSpacing: '0.8px',
            background: 'rgba(255,255,255,0.03)',
            padding: '4px 0',
            borderTop: '1px solid rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.03)'
          }}>
            {maxHCount >= 3 ? 'STELLIUM' : 'FOCUS'} IN HOUSE {hId} ({HOUSE_DESC[hId]?.name.toUpperCase() || HOUSE_THEMES_FIXED[hId]?.toUpperCase() || '?'}) — {maxHCount} PLACEMENTS
          </div>
        ) : null

        if (big3.length === 0) return null

        return (
          <div style={{
            padding: '16px 0',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '24px', rowGap: '12px', justifyContent: 'center', fontSize: '13px' }}>
              {big3.reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, <span key={`sep-${i}`} style={{ opacity: 0.2 }}>•</span>, curr], [])}
            </div>
            {stelliumText}
          </div>
        )
      })()}

      {(() => {
        const maxEl   = Object.entries(tally).length > 0 ? Object.entries(tally).sort((a,b) => b[1]-a[1])[0] : ['Air', 0]
        const maxMode = Object.entries(modeTally).length > 0 ? Object.entries(modeTally).sort((a,b) => b[1]-a[1])[0] : ['Cardinal', 0]
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
        })[0] || ["1", { Fire:0, Earth:0, Air:0, Water:0 }]
        const maxHouseCount = maxHouse ? Object.values(maxHouse[1]).reduce((s,v)=>s+v,0) : 1
        const ELEMENTS_ORDER = ['Fire', 'Earth', 'Air', 'Water']
        const maxHouseEl = (maxHouse && maxHouse[1] && Object.entries(maxHouse[1]).length > 0)
          ? Object.entries(maxHouse[1]).sort((a,b)=>b[1]-a[1])[0][0]
          : 'Air'

        return (
          <div className="birth-chart__footer">
            <div className="birth-chart__summary">
            <div className="birth-chart__summary-column">
              <div className="birth-chart__summary-title">Elements</div>
              <div className="birth-chart__summary-bars">
                {ELEMENTS_ORDER.map(el => {
                  const n = tally[el] || 0
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
                {['Cardinal', 'Fixed', 'Mutable'].map(mode => {
                  const n = modeTally[mode] || 0
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

          {placements && houseCusps && (
            <HouseWheel placements={displayPlacements} houseCusps={houseCusps} size={300} />
          )}
        </div>
        )
      })()}
    </div>
  )
}
