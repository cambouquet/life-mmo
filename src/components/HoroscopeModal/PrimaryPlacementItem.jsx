import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, PLANET_NAMES, ELEMENT_COLOR } from './astroConstants.js'
import { fmtDegreeDisplay } from './degreeFormatter.jsx'

export function PrimaryPlacementItem({ name, placement }) {
  if (!placement) return null
  const color = ELEMENT_COLOR[SIGN_META[placement.sign]?.element] ?? '#fff'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${color}`, borderRadius: '4px' }}>
      <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '12px', color: color, width: '130px' }}>
        <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{PLANET_GLYPHS[name]}</span>
        {PLANET_NAMES[name] ?? name}
      </div>
      <div style={{ fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255, 255, 255, 0.95)', flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
        <span style={{ opacity: 0.9 }}>{placement.sign}</span>
        <span style={{ color: '#fff' }}>{fmtDegreeDisplay(placement.degrees)}</span>
        <span style={{ color: color, marginLeft: '12px', fontSize: '11px', fontWeight: 700, background: `${color}22`, padding: '2px 8px', borderRadius: '4px' }}>H{placement.house}</span>
      </div>
    </div>
  )
}
