import React from 'react'
import { Big3Item } from './Big3Item.jsx'
import { Big3Stellium } from './Big3Stellium.jsx'
import { calculateHouseTally } from './big3SummaryCalcs.js'

export function Big3Summary({ displayPlacements, rows }) {
  const big3 = ['Sun', 'Moon', 'Ascendant']
    .map(key => <Big3Item key={key} placements={displayPlacements} name={key} />)
    .filter(Boolean)

  if (big3.length === 0) return null

  const { hId, maxHCount } = calculateHouseTally(displayPlacements, rows)

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', gap: '12px', padding: '12px 0', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
      {big3}
      <Big3Stellium hId={hId} maxHCount={maxHCount} />
    </div>
  )
}
