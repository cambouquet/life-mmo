import React from 'react'
import { HOUSE_THEMES } from '../HouseWheel/HouseWheel.jsx'
import { AstroSummaryPlanets } from './AstroSummaryPlanets.jsx'
import { AstroSummaryBars } from './AstroSummaryBars.jsx'
import { calculateElementTally, calculateModeTally, calculateHouseTally, getMax } from './astroSummaryCalcs.js'

export function AstroSummary({ natalPlacements }) {
  const tally = calculateElementTally(natalPlacements)
  const modeTally = calculateModeTally(natalPlacements)
  const hTally = calculateHouseTally(natalPlacements)
  const maxEl = getMax(tally)
  const maxMo = getMax(modeTally)
  const maxH = getMax(hTally)

  return (
    <div className="char-editor-summary">
      <AstroSummaryPlanets sunP={natalPlacements['Sun']} moonP={natalPlacements['Moon']} ascP={natalPlacements['Ascendant']} />
      {maxH && (
        <div className="char-editor-summary__stellium">
          {maxH[1] >= 3 ? 'Stellium' : 'Focus'} in H{maxH[0]} ({HOUSE_THEMES[maxH[0]] || ''}) — {maxH[1]} placements.
        </div>
      )}
      <AstroSummaryBars tally={tally} modeTally={modeTally} maxEl={maxEl} maxMo={maxMo} />
    </div>
  )
}
