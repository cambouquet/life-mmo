import React, { useState, useEffect, useRef } from 'react'
import { generateHoroscope } from '../../game/astro/horoscope'
import { toInputDate } from './astroFormatters'
import { BirthChart } from './BirthChart'
import { ReadingSection } from './ReadingSection'
import { DebugSection } from './DebugSection'
import { useHoroscopeKeyboard } from './useHoroscopeKeyboard'
import { isWideMode } from './modalModes'
import { getDateLabel, renderHeader, renderFooter } from './horoscopeRendering'

export default function HoroscopeModal({ birthData, onClose }) {
  const [mode, setMode] = useState('reading')
  const [transitStr, setTransitStr] = useState(() => toInputDate(new Date()))
  const [reading, setReading] = useState(() => generateHoroscope(new Date(), birthData))
  const scrollRef = useRef(null)

  useEffect(() => {
    try {
      setReading(generateHoroscope(new Date(transitStr + 'T12:00:00'), birthData))
    } catch {}
  }, [transitStr, birthData])

  useHoroscopeKeyboard(scrollRef, setMode, onClose)

  const { zodiac } = reading
  const dateLabel = getDateLabel(new Date())
  const wide = isWideMode(mode)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} ref={scrollRef} style={{ ...wide ? { maxWidth: 520 } : {}, maxHeight: '90vh', overflowY: 'auto' }}>
        {renderHeader(zodiac, mode, dateLabel, transitStr, setTransitStr)}
        <div className="modal__body">
          {mode === 'reading' && <ReadingSection reading={reading} />}
          {mode === 'chart' && (
            <div className="modal__section">
              {reading._debug?.natalPlacements ? (
                <BirthChart placements={reading._debug.natalPlacements} birthData={birthData} reading={reading} mode={mode} houseCusps={reading._debug.natalHouses} />
              ) : (
                <div style={{ color: '#c8a8f0', textAlign: 'center', padding: '20px', opacity: 0.6 }}>Calculating chart...</div>
              )}
            </div>
          )}
          {mode === 'debug' && <DebugSection reading={reading} birthData={birthData} />}
        </div>
        {renderFooter(mode, setMode, onClose)}
      </div>
    </div>
  )
}

export { PLANET_GLYPHS, SIGN_GLYPHS, PLANET_NAMES, ELEMENT_COLOR } from './astroConstants'
