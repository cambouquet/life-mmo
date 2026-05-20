// Debug table showing raw ecliptic longitudes for all bodies in a chart.

import React from 'react'
import { PLANET_GLYPHS } from './astroConstants.js'

export function PlacementsTable({ placements }) {
  if (!placements) return null

  return (
    <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ color: '#7a5898', borderBottom: '1px solid #2a1848' }}>
          <th style={{ textAlign: 'left',  padding: '2px 4px' }}>Body</th>
          <th style={{ textAlign: 'right', padding: '2px 4px' }}>Longitude</th>
          <th style={{ textAlign: 'left',  padding: '2px 4px' }}>Sign</th>
          <th style={{ textAlign: 'right', padding: '2px 4px' }}>° in sign</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(placements).map(([planet, p]) => (
          <tr key={planet} style={{ borderBottom: '1px solid #120e20' }}>
            <td style={{ padding: '2px 4px', color: '#e8d4ff' }}>
              {PLANET_GLYPHS[planet] ?? '·'} {planet}
            </td>
            <td style={{ textAlign: 'right', padding: '2px 4px', color: '#9a78c0', fontFamily: 'monospace' }}>
              {p.longitude.toFixed(2)}°
            </td>
            <td style={{ padding: '2px 4px', color: '#c8a8f0' }}>
              {p.symbol} {p.sign}
            </td>
            <td style={{ textAlign: 'right', padding: '2px 4px', color: '#9a78c0', fontFamily: 'monospace' }}>
              {p.degrees.toFixed(1)}°
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
