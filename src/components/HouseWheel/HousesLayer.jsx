import React from 'react'
import { HouseSlice } from './HouseSlice.jsx'

export function HousesLayer({
  placements,
  houseCusps,
  ascLong,
  rows,
  hovered,
  lockedPoint,
  setHovered,
  setLockedPoint,
  polarToXY,
  arc,
  getInterpretation,
  houseTotal,
}) {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1
        const housePlanets = rows.filter(pn => placements[pn]?.house === h)
        return (
          <HouseSlice
            key={h}
            houseNumber={h}
            placements={placements}
            houseCusps={houseCusps}
            ascLong={ascLong}
            hovered={hovered}
            lockedPoint={lockedPoint}
            setHovered={setHovered}
            setLockedPoint={setLockedPoint}
            polarToXY={polarToXY}
            arc={arc}
            getInterpretation={getInterpretation}
            houseTotal={houseTotal}
            housePlanets={housePlanets}
          />
        )
      })}
    </>
  )
}
