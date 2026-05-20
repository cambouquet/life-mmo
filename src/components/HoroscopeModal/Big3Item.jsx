import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, SIGN_GLYPHS, ELEMENT_COLOR } from './astroConstants.js'

export function Big3Item({ placements, name }) {
  const p = placements[name]
  if (!p) return null
  const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
  const sGlyph = SIGN_GLYPHS[p.sign] || ''
  const pGlyph = PLANET_GLYPHS[name] || ''
  return (
    <span style={{ color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '1.25em' }}>{pGlyph}</span>
      <span style={{ fontWeight: 800 }}>{p.sign} {sGlyph}</span>
      <span style={{ opacity: 0.9, fontSize: '0.95em' }}>{Math.floor(p.degrees)}°{Math.floor((p.degrees % 1) * 60)}'</span>
      <span style={{ opacity: 0.5, fontSize: '0.85em', fontStyle: 'italic' }}>H{p.house}</span>
    </span>
  )
}
