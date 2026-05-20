import React from 'react'
import { GatedMessage } from './GatedMessage'
import { BigThreeDisplay } from './BigThreeDisplay'

export function ReadingSection({ reading }) {
  const { cosmic, moonline, guidance, lucky, gated, _debug } = reading

  if (gated) return <GatedMessage />

  return (
    <>
      <div className="modal__section">
        <div className="modal__label">Cosmic Weather</div>
        <div className="modal__text">{cosmic}</div>
      </div>
      <div className="modal__section">
        <div className="modal__label">The Moon</div>
        <div className="modal__text">{moonline}</div>
      </div>
      <div className="modal__section">
        <div className="modal__label">Guidance</div>
        <div className="modal__text">{guidance}</div>
      </div>
      <div className="modal__section">
        <div className="modal__label">Lucky {lucky.element}</div>
        <div className="modal__text modal__lucky-value">{lucky.value}</div>
      </div>
      {_debug?.natalPlacements && <BigThreeDisplay natalPlacements={_debug.natalPlacements} />}
    </>
  )
}
