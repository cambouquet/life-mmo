import React, { useState } from 'react'
import { PLANET_ORDER } from './astroConstants.js'
import { HouseWheel } from '../HouseWheel/HouseWheel.jsx'
import { PrimaryPlacementsPanel } from './PrimaryPlacementsPanel.jsx'
import { ChartRow } from './ChartRow.jsx'
import { Big3Summary } from './Big3Summary.jsx'
import { computeTallies, formatBirthLine } from './chartTallies.js'

export function BirthChart({ placements, birthData, reading, mode, houseCusps }) {
  const [selected, setSelected] = useState(null)

  if (!placements) {
    return (
      <div style={{ color: '#5a3870', fontSize: 12, fontStyle: 'italic', padding: '8px 0' }}>
        No birth data — enter your birth date in the mirror.
      </div>
    )
  }

  const displayPlacements = mode === 'chart' ? placements : reading?._debug?.transitPlacements || placements
  if (!displayPlacements) return null

  const rows = PLANET_ORDER.filter(p => displayPlacements[p])
  computeTallies(rows, displayPlacements)

  const birthLine = formatBirthLine(birthData)

  return (
    <div className="birth-chart">
      <PrimaryPlacementsPanel placements={displayPlacements} />

      {birthLine && <div className="birth-chart__header">{birthLine}</div>}

      <table className="birth-chart__table">
        <tbody>
          {rows.map(planet => (
            <ChartRow key={planet} planet={planet} displayPlacements={displayPlacements} isSelected={selected === planet} onSelect={setSelected} />
          ))}
        </tbody>
      </table>

      <Big3Summary displayPlacements={displayPlacements} rows={rows} />

      {mode === 'chart' && <HouseWheel placements={placements} houseCusps={houseCusps} size={300} />}
    </div>
  )
}
