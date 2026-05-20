import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, SIGN_GLYPHS, ELEMENT_COLOR } from '../HoroscopeModal/astroConstants.js'
import { HOUSE_THEMES } from '../HouseWheel/HouseWheel.jsx'

export function AstroSummary({ natalPlacements }) {
  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  const modeTally = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  Object.values(natalPlacements).forEach(p => {
    const meta = SIGN_META[p.sign]
    if (meta) {
      if (meta.element) tally[meta.element]++
      if (meta.mode) modeTally[meta.mode]++
    }
  })
  const maxEl = Object.entries(tally).sort((a,b) => b[1]-a[1])[0]
  const maxMo = Object.entries(modeTally).sort((a,b) => b[1]-a[1])[0]
  const hTally = {}
  Object.values(natalPlacements).forEach(p => {
    if (p.house) hTally[p.house] = (hTally[p.house] || 0) + 1
  })
  const maxH = Object.entries(hTally).sort((a,b) => b[1] - a[1])[0]
  const ELEMENTS_ORDER = ['Fire', 'Earth', 'Air', 'Water']
  const sunP = natalPlacements['Sun']
  const moonP = natalPlacements['Moon']
  const ascP = natalPlacements['Ascendant']

  return (
    <div className="char-editor-summary">
      <div className="char-editor-summary__planets">
        <div className="char-editor-summary__row">
          {[['Sun', sunP], ['Moon', moonP]].map(([key, p]) => {
            if (!p) return null
            const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
            return (
              <span key={key} className="char-editor-summary__planet" style={{ color }}>
                <span className="char-editor-summary__glyph">{PLANET_GLYPHS[key]}</span>
                <span className="char-editor-summary__sign">{p.sign} {SIGN_GLYPHS[p.sign]}</span>
                <span className="char-editor-summary__deg">{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
              </span>
            )
          })}
        </div>
        <div className="char-editor-summary__row">
          {[['Asc', ascP]].map(([key, p]) => {
            if (!p) return null
            const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
            return (
              <span key={key} className="char-editor-summary__planet" style={{ color }}>
                <span className="char-editor-summary__glyph">{PLANET_GLYPHS['Ascendant']}</span>
                <span className="char-editor-summary__sign">{p.sign} {SIGN_GLYPHS[p.sign]}</span>
                <span className="char-editor-summary__deg">{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
              </span>
            )
          })}
        </div>
      </div>
      {maxH && (
        <div className="char-editor-summary__stellium">
          {maxH[1] >= 3 ? 'Stellium' : 'Focus'} in H{maxH[0]} ({HOUSE_THEMES[maxH[0]] || ''}) — {maxH[1]} placements.
        </div>
      )}
      <div className="char-editor-summary__grid">
        <div className="char-editor-summary__col">
          {ELEMENTS_ORDER.map(el => {
            const n = tally[el]
            return (
              <div key={el} className="char-editor-summary__bar-row" style={{ opacity: n === 0 ? 0.2 : 1 }}>
                <span className="char-editor-summary__bar-label" style={{ color: ELEMENT_COLOR[el], fontWeight: el === maxEl[0] && n > 0 ? 700 : 400 }}>{el.slice(0,4).toUpperCase()}</span>
                <div className="char-editor-summary__bar-track">
                  <div className="char-editor-summary__bar-fill" style={{ width: maxEl[1] > 0 ? `${(n/maxEl[1])*100}%` : '0%', background: ELEMENT_COLOR[el] }} />
                </div>
                <span className="char-editor-summary__bar-num" style={{ color: ELEMENT_COLOR[el] }}>{n}</span>
              </div>
            )
          })}
        </div>
        <div className="char-editor-summary__col">
          {[['Cardinal','#f472b6'],['Fixed','#a78bfa'],['Mutable','#34d399']].map(([mode, modeCol]) => {
            const n = modeTally[mode]
            return (
              <div key={mode} className="char-editor-summary__bar-row" style={{ opacity: n === 0 ? 0.2 : 1 }}>
                <span className="char-editor-summary__bar-label" style={{ color: modeCol, fontWeight: mode === maxMo[0] && n > 0 ? 700 : 400 }}>{mode.slice(0,4).toUpperCase()}</span>
                <div className="char-editor-summary__bar-track">
                  <div className="char-editor-summary__bar-fill" style={{ width: maxMo[1] > 0 ? `${(n/maxMo[1])*100}%` : '0%', background: modeCol }} />
                </div>
                <span className="char-editor-summary__bar-num" style={{ color: modeCol }}>{n}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
