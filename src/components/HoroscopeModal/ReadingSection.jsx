import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, SIGN_GLYPHS, ELEMENT_COLOR } from './astroConstants.js'

export function ReadingSection({ reading }) {
  const { zodiac, cosmic, moonline, guidance, lucky, gated, _debug } = reading

  if (gated) {
    return (
      <div className="modal__section">
        <div className="modal__text" style={{ opacity: 0.5, fontStyle: 'italic' }}>
          The glass sees no birth, no beginning.
          <br />
          It cannot read you yet.
          <br />
          <br />
          Return to the mirror and reveal when you were born.
        </div>
      </div>
    )
  }

  return (
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
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 24px',
              fontSize: '13px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {['Sun', 'Moon', 'Ascendant'].map(key => {
              const p = _debug.natalPlacements[key]
              if (!p) return null
              const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
              return (
                <div key={key} style={{ color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.2em' }}>{PLANET_GLYPHS[key]}</span>
                  <span style={{ fontWeight: 800 }}>
                    {p.sign} {SIGN_GLYPHS[p.sign]}
                  </span>
                  <span style={{ opacity: 0.8, fontSize: '0.9em' }}>
                    {Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'
                  </span>
                  <span style={{ opacity: 0.5, fontSize: '0.85em' }}>H{p.house}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
