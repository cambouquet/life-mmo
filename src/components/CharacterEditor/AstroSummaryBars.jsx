import React from 'react'

export function AstroSummaryBars({ tally, modeTally, maxEl, maxMo }) {
  const ELEMENTS_ORDER = ['Fire', 'Earth', 'Air', 'Water']
  const ELEMENT_COLOR = { Fire: '#f97316', Earth: '#84cc16', Air: '#06b6d4', Water: '#3b82f6' }

  return (
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
  )
}
