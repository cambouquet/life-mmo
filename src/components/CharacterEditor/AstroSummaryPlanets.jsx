import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, SIGN_GLYPHS, ELEMENT_COLOR } from '../HoroscopeModal/astroConstants.js'

export function AstroSummaryPlanets({ sunP, moonP, ascP }) {
  const renderPlanet = (key, p) => {
    if (!p) return null
    const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
    return (
      <span key={key} className="char-editor-summary__planet" style={{ color }}>
        <span className="char-editor-summary__glyph">{PLANET_GLYPHS[key]}</span>
        <span className="char-editor-summary__sign">{p.sign} {SIGN_GLYPHS[p.sign]}</span>
        <span className="char-editor-summary__deg">{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
      </span>
    )
  }

  return (
    <div className="char-editor-summary__planets">
      <div className="char-editor-summary__row">
        {renderPlanet('Sun', sunP)}
        {renderPlanet('Moon', moonP)}
      </div>
      <div className="char-editor-summary__row">
        {ascP ? renderPlanet('Asc', ascP) : null}
      </div>
    </div>
  )
}
