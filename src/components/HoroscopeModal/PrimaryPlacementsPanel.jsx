// Displays Sun, Moon, Ascendant in a grid format with color-coded elements.

import React from 'react'
import { PLANET_GLYPHS, PLANET_NAMES, ELEMENT_COLOR } from './astroConstants.js'
import { SIGN_META } from '../../game/astro/horoscope.js'

export function PrimaryPlacementsPanel({ placements }) {
  return (
    <div style={{ padding: '0 0 24px', borderBottom: '2px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
      <div style={{
        fontSize: '10px',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '12px',
        fontWeight: 700
      }}>Primary Placements</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {['Sun', 'Moon', 'Ascendant'].map(key => {
          const p = placements[key]
          if (!p) return null
          const color = ELEMENT_COLOR[SIGN_META[p.sign]?.element] ?? '#fff'
          return (
            <div key={key} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.03)',
              borderLeft: `3px solid ${color}`,
              borderRadius: '4px'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: color,
                width: '130px'
              }}>
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>
                  {PLANET_GLYPHS[key]}
                </span>
                {PLANET_NAMES[key] ?? key}
              </div>
              <div style={{
                fontSize: '14px',
                fontFamily: "'JetBrains Mono', monospace",
                color: 'rgba(255, 255, 255, 0.95)',
                flex: 1,
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '10px'
              }}>
                <span style={{ opacity: 0.9 }}>{p.sign}</span>
                <span style={{ color: '#fff' }}>{fmtDegreeDisplay(p.degrees)}</span>
                <span style={{ color: color, marginLeft: '12px', fontSize: '11px', fontWeight: 700, background: `${color}22`, padding: '2px 8px', borderRadius: '4px' }}>
                  H{p.house}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function fmtDegreeDisplay(degrees) {
  const d = Math.floor(degrees)
  const m = Math.floor((degrees - d) * 60)
  const s = Math.floor(((degrees - d) * 60 - m) * 60)
  return (
    <span className="coord">
      <span className="coord__deg">{d}</span>
      <span className="coord__unit">°</span>
      <span className="coord__val">{String(m).padStart(2, '0')}</span>
      <span className="coord__unit">'</span>
      <span className="coord__val">{String(s).padStart(2, '0')}</span>
      <span className="coord__unit">"</span>
    </span>
  )
}
