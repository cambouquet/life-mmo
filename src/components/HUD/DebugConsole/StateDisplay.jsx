import React from 'react'
import { CopyButton } from './CopyButton'
import { HEADER_STYLE, HEADER_LABEL_STYLE, MODAL_INFO_STYLE, MODAL_LABEL_STYLE, MODAL_TEXT_STYLE, STATE_CONTAINER_STYLE, STATE_ENTRY_STYLE } from './stateDisplayStyles.js'

function formatStateValue(value) {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2)
  }
  return value
}

export function StateDisplay({ stateData, debugText, modalInfo }) {
  return (
    <>
      {stateData && (
        <div style={HEADER_STYLE}>
          <div style={HEADER_LABEL_STYLE}>state</div>
          <CopyButton text={debugText} />
        </div>
      )}

      {modalInfo && (
        <div style={MODAL_INFO_STYLE}>
          <div style={MODAL_LABEL_STYLE}>MODAL:</div>
          <div style={MODAL_TEXT_STYLE}>left:{modalInfo.scrollLeft.toFixed(0)} w:{modalInfo.clientWidth}</div>
        </div>
      )}

      {stateData && (
        <div style={STATE_CONTAINER_STYLE}>
          {Object.entries(stateData).map(([key, value]) => (
            <div key={key} style={STATE_ENTRY_STYLE}>
              <strong>{key}:</strong> {formatStateValue(value)}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
