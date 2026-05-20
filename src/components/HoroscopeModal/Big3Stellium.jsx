import React from 'react'
import { HOUSE_DESC } from './astroConstants.js'
import { HOUSE_THEMES_FIXED } from './big3SummaryCalcs.js'

export function Big3Stellium({ hId, maxHCount }) {
  if (!hId) return null
  return (
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
  )
}
