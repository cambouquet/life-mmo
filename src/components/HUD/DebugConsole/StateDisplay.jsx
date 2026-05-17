import React from 'react'
import { CopyButton } from './CopyButton'

export function StateDisplay({ stateData, debugText, modalInfo }) {
  return (
    <>
      {/* State display header */}
      {stateData && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div
            style={{
              fontSize: '9px',
              color: '#a1a1aa',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            state
          </div>
          <CopyButton text={debugText} />
        </div>
      )}

      {/* Modal scroll state */}
      {modalInfo && (
        <div
          style={{
            padding: '4px 6px',
            background: 'rgba(168, 85, 247, 0.08)',
            borderRadius: '3px',
            fontSize: '10px',
            marginBottom: '4px',
          }}
        >
          <div style={{ color: '#c084fc', fontSize: '9px', fontWeight: 'bold', marginBottom: '2px' }}>
            MODAL:
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#a1a1aa', lineHeight: '1.3' }}>
            left:{modalInfo.scrollLeft.toFixed(0)} w:{modalInfo.clientWidth}
          </div>
        </div>
      )}

      {/* State display */}
      {stateData && (
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#c084fc',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            lineHeight: '1.4',
            marginBottom: '8px',
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {Object.entries(stateData).map(([key, value]) => {
            let displayValue = value
            if (typeof value === 'object' && value !== null) {
              displayValue = JSON.stringify(value, null, 2)
            }
            return (
              <div key={key} style={{ marginBottom: '4px' }}>
                <strong>{key}:</strong> {displayValue}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
