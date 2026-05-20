import React, { useState, useEffect } from 'react'
import { generateHoroscope, SIGN_META } from '../../game/astro/horoscope.js'
import {
  PLANET_GLYPHS, SIGN_GLYPHS, PLANET_NAMES,
  ELEMENT_COLOR
} from './astroConstants.js'
import { toInputDate } from './astroFormatters.js'
import { BirthChart } from './BirthChart.jsx'
import { PlacementsTable } from './PlacementsTable.jsx'
import { MONTHS, MODE_TITLES } from './horoscopeData.js'

export { PLANET_GLYPHS, SIGN_GLYPHS, PLANET_NAMES, ELEMENT_COLOR }

export default function HoroscopeModal({ birthData, onClose }) {
  const [mode,       setMode]       = useState('reading')
  const [transitStr, setTransitStr] = useState(() => toInputDate(new Date()))
  const [reading,    setReading]    = useState(() => generateHoroscope(new Date(), birthData))
  const scrollRef = React.useRef(null)

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

      if (scrollRef.current && (e.code === 'ArrowDown' || e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyS')) {
        const isUp = e.code === 'ArrowUp' || e.code === 'KeyW'
        const amount = isUp ? -40 : 40
        scrollRef.current.scrollBy({ top: amount, behavior: 'auto' })
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const { zodiac, cosmic, moonline, guidance, lucky, gated, _debug } = reading
  const now = new Date()
  const dateLabel = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
  const wide = mode !== 'reading'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} ref={scrollRef}
           style={{ ...wide ? { maxWidth: 520 } : {}, maxHeight: '90vh', overflowY: 'auto' }}>

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

                  {_debug?.natalPlacements && (
                    <div className="modal__section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                      <div className="modal__label" style={{ marginBottom: 12 }}>Your Big Three</div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px 24px',
                        fontSize: '13px',
                        fontFamily: "'JetBrains Mono', monospace"
                      }}>
                        {['Sun', 'Moon', 'Ascendant'].map((key, i) => {
                          const p = _debug.natalPlacements[key]
                          if (!p) return null
                          const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
                          return (
                            <div key={key} style={{ color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '1.2em' }}>{PLANET_GLYPHS[key]}</span>
                              <span style={{ fontWeight: 800 }}>{p.sign} {SIGN_GLYPHS[p.sign]}</span>
                              <span style={{ opacity: 0.8, fontSize: '0.9em' }}>{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
                              <span style={{ opacity: 0.5, fontSize: '0.85em' }}>H{p.house}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ── Birth Chart ── */}
          {mode === 'chart' && (
            <div className="modal__section">
              {_debug?.natalPlacements ? (
                <BirthChart placements={_debug.natalPlacements} birthData={birthData} reading={reading} mode={mode} houseCusps={_debug.natalHouses} />
              ) : (
                <div style={{ color: '#c8a8f0', textAlign: 'center', padding: '20px', opacity: 0.6 }}>
                  Calculating chart...
                </div>
              )}
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
