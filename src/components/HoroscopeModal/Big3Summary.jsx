import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, SIGN_GLYPHS, ELEMENT_COLOR, HOUSE_DESC } from './astroConstants.js'

const HOUSE_THEMES_FIXED = {
  1: 'self',
  2: 'resources',
  3: 'mind',
  4: 'home',
  5: 'pleasure',
  6: 'service',
  7: 'partnership',
  8: 'transformation',
  9: 'expansion',
  10: 'career',
  11: 'community',
  12: 'hidden',
}

export function Big3Summary({ displayPlacements, rows }) {
  const big3 = ['Sun', 'Moon', 'Ascendant']
    .map(key => {
      const p = displayPlacements[key]
      if (!p) return null
      const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
      const sGlyph = SIGN_GLYPHS[p.sign] || ''
      const pGlyph = PLANET_GLYPHS[key] || ''
      return (
        <span key={key} style={{ color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '1.25em' }}>{pGlyph}</span>
          <span style={{ fontWeight: 800 }}>
            {p.sign} {sGlyph}
          </span>
          <span style={{ opacity: 0.9, fontSize: '0.95em' }}>
            {Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'
          </span>
          <span style={{ opacity: 0.5, fontSize: '0.85em', fontStyle: 'italic' }}>H{p.house}</span>
        </span>
      )
    })
    .filter(Boolean)

  if (big3.length === 0) return null

  const hTally = {}
  rows.forEach(pName => {
    const p = displayPlacements[pName]
    if (p && p.house) {
      hTally[p.house] = (hTally[p.house] || 0) + 1
    }
  })
  const maxH = Object.entries(hTally).sort((a, b) => b[1] - a[1])[0]
  const maxHCount = maxH ? maxH[1] : 0
  const hId = maxH ? maxH[0] : null

  const stelliumText = hId ? (
    <div
      style={{
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
        borderBottom: '1px solid rgba(255,255,255,0.03)',
      }}
    >
      {maxHCount >= 3 ? 'STELLIUM' : 'FOCUS'} IN HOUSE {hId} (
      {HOUSE_DESC[hId]?.name.toUpperCase() || HOUSE_THEMES_FIXED[hId]?.toUpperCase() || '?'}) — {maxHCount} PLACEMENTS
    </div>
  ) : null

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        gap: '12px',
        padding: '12px 0',
        fontSize: '11px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '20px',
      }}
    >
      {big3}
      {stelliumText}
    </div>
  )
}
