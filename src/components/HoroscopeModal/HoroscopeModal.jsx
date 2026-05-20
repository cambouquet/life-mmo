import React, { useState, useEffect, useRef } from 'react'
import { generateHoroscope } from '../../game/astro/horoscope.js'
import { toInputDate } from './astroFormatters.js'
import { BirthChart } from './BirthChart.jsx'
import { ReadingSection } from './ReadingSection.jsx'
import { DebugSection } from './DebugSection.jsx'
import { MODE_TITLES } from './horoscopeData.js'
import { useHoroscopeKeyboard } from './useHoroscopeKeyboard.js'
import { isWideMode } from './modalModes.js'

export default function HoroscopeModal({ birthData, onClose }) {
  const [mode, setMode] = useState('reading')
  const [transitStr, setTransitStr] = useState(() => toInputDate(new Date()))
  const [reading, setReading] = useState(() => generateHoroscope(new Date(), birthData))
  const scrollRef = useRef(null)

  useEffect(() => {
    try {
      const transit = new Date(transitStr + 'T12:00:00')
      setReading(generateHoroscope(transit, birthData))
    } catch {}
  }, [transitStr, birthData])

  useHoroscopeKeyboard(scrollRef, setMode, onClose)

  const { zodiac } = reading
  const now = new Date()
  const dateLabel = `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
  const wide = isWideMode(mode)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} ref={scrollRef} style={{ ...wide ? { maxWidth: 520 } : {}, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal__header">
          <span className="modal__zodiac">{zodiac.symbol}</span>
          <div>
            <div className="modal__title">{MODE_TITLES[mode]}</div>
            <div className="modal__subtitle">
              {mode === 'debug' ? (
                <input type="date" value={transitStr} onChange={e => setTransitStr(e.target.value)} style={{ background: '#1a1030', color: '#c8a8f0', border: '1px solid #4a2878', padding: '2px 6px', fontSize: 11 }} />
              ) : (
                `${dateLabel} · ${zodiac.name}${zodiac.rising ? ` · ↑ ${zodiac.rising}` : ''}`
              )}
            </div>
          </div>
          <span className="modal__zodiac">{zodiac.symbol}</span>
        </div>

        <div className="modal__body">
          {mode === 'reading' && <ReadingSection reading={reading} />}

          {mode === 'chart' && (
            <div className="modal__section">
              {reading._debug?.natalPlacements ? (
                <BirthChart placements={reading._debug.natalPlacements} birthData={birthData} reading={reading} mode={mode} houseCusps={reading._debug.natalHouses} />
              ) : (
                <div style={{ color: '#c8a8f0', textAlign: 'center', padding: '20px', opacity: 0.6 }}>
                  Calculating chart...
                </div>
              )}
            </div>
          )}

          {mode === 'debug' && <DebugSection reading={reading} birthData={birthData} />}
        </div>

        <div className="modal__footer">
          {mode !== 'chart' && <button className="modal__close" onClick={() => setMode('chart')} style={{ marginRight: 8, opacity: 0.55 }}>Chart — Alt+C</button>}
          {mode !== 'reading' && <button className="modal__close" onClick={() => setMode('reading')} style={{ marginRight: 8, opacity: 0.55 }}>Reading</button>}
          {mode !== 'debug' && <button className="modal__close" onClick={() => setMode('debug')} style={{ marginRight: 8, opacity: 0.55 }}>Debug — F1</button>}
          <button className="modal__close" onClick={onClose}>Close — Esc</button>
        </div>
      </div>
    </div>
  )
}

export { PLANET_GLYPHS, SIGN_GLYPHS, PLANET_NAMES, ELEMENT_COLOR } from './astroConstants.js'
