import React from 'react'
import { PrimaryPlacementItem } from './PrimaryPlacementItem.jsx'

export function PrimaryPlacementsPanel({ placements }) {
  return (
    <div style={{ padding: '0 0 24px', borderBottom: '2px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 700 }}>Primary Placements</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {['Sun', 'Moon', 'Ascendant'].map(key => (
          <PrimaryPlacementItem key={key} name={key} placement={placements[key]} />
        ))}
      </div>
    </div>
  )
}
