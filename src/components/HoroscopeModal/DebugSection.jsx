import React from 'react'
import { PLANET_GLYPHS } from './astroConstants.js'
import { PlacementsTable } from './PlacementsTable.jsx'

export function DebugSection({ reading, birthData }) {
  const { _debug, gated, cosmic, moonline, guidance } = reading

  return (
    <>
      <div className="modal__section">
        <div className="modal__label">Transit Positions</div>
        <PlacementsTable placements={_debug.transitPlacements} />
      </div>

      <div className="modal__section">
        <div className="modal__label">
          Natal Positions
          {birthData?.date ? ` · ${birthData.date}${birthData.time ? ' ' + birthData.time : ''}${birthData.city ? ', ' + birthData.city.name : ''}` : ' — none'}
        </div>
        <PlacementsTable placements={_debug.natalPlacements} />
      </div>

      <div className="modal__section">
        <div className="modal__label">Transit → Natal Aspects ({_debug.transitNatalAspects.length})</div>
        {_debug.transitNatalAspects.map((asp, i) => (
          <div key={i} style={{ fontSize: 11, color: i < 3 ? '#c8a8f0' : '#5a3870', marginBottom: 3, display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {PLANET_GLYPHS[asp.transit] ?? '·'} t.{asp.transit} {asp.aspect.symbol} n.{asp.natal} {PLANET_GLYPHS[asp.natal] ?? '·'}
              <span style={{ color: '#7a5898', marginLeft: 6 }}>{asp.aspect.name}</span>
            </span>
            <span style={{ fontFamily: 'monospace', color: '#5a3870' }}>{(asp.exactness * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      <div className="modal__section">
        <div className="modal__label">Reading</div>
        {gated ? (
          <div style={{ fontSize: 11, color: '#5a3870', fontStyle: 'italic' }}>Gated — no birth date.</div>
        ) : (
          <>
            <div className="modal__text" style={{ marginBottom: 5, fontSize: 12 }}>
              {cosmic}
            </div>
            <div className="modal__text" style={{ marginBottom: 5, fontSize: 12 }}>
              {moonline}
            </div>
            <div className="modal__text modal__lucky-value" style={{ fontSize: 12 }}>
              {guidance}
            </div>
            {_debug.guidanceSource && (
              <div style={{ fontSize: 10, color: '#5a3870', marginTop: 4 }}>
                t.{_debug.guidanceSource.transit} {_debug.guidanceSource.aspect.name} n.{_debug.guidanceSource.natal} ({(_debug.guidanceSource.exactness * 100).toFixed(0)}% exact)
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
