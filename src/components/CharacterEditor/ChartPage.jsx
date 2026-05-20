import React from 'react'
import { HouseWheelWithInfo } from '../HouseWheel/HouseWheel.jsx'
import { AstroSummary } from './AstroSummary.jsx'

export function ChartPage({ natalPlacements, houseCusps, birthDate, onBirthDateChange, birthTime, onBirthTimeChange }) {
  if (!natalPlacements) return <div className="char-editor-loading">Loading chart...</div>

  return (
    <>
      <div className="char-editor-chart-wheel">
        <HouseWheelWithInfo
          placements={natalPlacements}
          houseCusps={houseCusps}
          hideStellium
          birthDate={birthDate}
          onBirthDateChange={onBirthDateChange}
          birthTime={birthTime}
          onBirthTimeChange={onBirthTimeChange}
          size={200}
        />
      </div>
      <div className="char-editor-chart-summary">
        <AstroSummary natalPlacements={natalPlacements} />
      </div>
    </>
  )
}
