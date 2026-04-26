import { useState, useEffect } from 'react'
import { generateHoroscope, SIGN_META } from '../../game/astro/horoscope.js'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const PLANET_GLYPHS = { Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂', Jupiter:'♃', Saturn:'♄', Ascendant:'↑' }
const PLANET_ORDER  = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Ascendant']

const ELEMENT_COLOR = { Fire:'#fb923c', Earth:'#86efac', Air:'#7dd3fc', Water:'#a78bfa' }

function toInputDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function fmtDeg(decimal) {
  const d = Math.floor(decimal)
  const m = Math.floor((decimal - d) * 60)
  return `${d}°${String(m).padStart(2, '0')}'`
}

// ── Birth Chart view ──────────────────────────────────────────────────────────
function BirthChart({ placements, birthData }) {
  if (!placements) {
    return (
      <div style={{ color:'#5a3870', fontSize:12, fontStyle:'italic', padding:'8px 0' }}>
        No birth data — enter your birth date in the mirror.
      </div>
    )
  }

  const tally = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  const modeTally = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  const rows = PLANET_ORDER.filter(p => placements[p])

  for (const p of rows) {
    const meta = SIGN_META[placements[p].sign]
    if (meta) { tally[meta.element]++; modeTally[meta.mode]++ }
  }

  const birthLine = [
    birthData?.date ? new Date(birthData.date + 'T12:00:00').toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : null,
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
            const p    = placements[planet]
            const meta = SIGN_META[p.sign]
            const col  = ELEMENT_COLOR[meta?.element] ?? '#c8a8f0'
            const isAsc = planet === 'Ascendant'
            return (
              <tr key={planet} className={`birth-chart__row${isAsc ? ' birth-chart__row--asc' : ''}`}>
                <td className="birth-chart__glyph" style={{ color: col }}>
                  {PLANET_GLYPHS[planet]}
                </td>
                <td className="birth-chart__planet">{planet}</td>
                <td className="birth-chart__sign" style={{ color: col }}>
                  {p.symbol} {p.sign}
                </td>
                <td className="birth-chart__deg">{fmtDeg(p.degrees)}</td>
                <td className="birth-chart__element" style={{ color: col }}>
                  {meta?.element ?? ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="birth-chart__summary">
        {Object.entries(tally).filter(([,n]) => n > 0).map(([el, n]) => (
          <span key={el} style={{ color: ELEMENT_COLOR[el] }}>{el} {n}</span>
        ))}
        <span className="birth-chart__summary-sep">·</span>
        {Object.entries(modeTally).filter(([,n]) => n > 0).map(([mode, n]) => (
          <span key={mode} style={{ color:'#7a5898' }}>{mode} {n}</span>
        ))}
      </div>
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
              <BirthChart placements={_debug.natalPlacements} birthData={birthData} />
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
