import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { ELEMENT_COLOR, HOUSE_DESC } from './astroConstants.js'
import { ChartRowHeading } from './ChartRowHeading'
import { ChartRowDetail } from './ChartRowDetail'

export function ChartRow({ planet, displayPlacements, isSelected, onSelect }) {
  const p = displayPlacements[planet]
  const meta = SIGN_META[p.sign]
  const col = ELEMENT_COLOR[meta?.element] ?? '#c8a8f0'
  const isAsc = planet === 'Ascendant'
  const hd = p.house ? HOUSE_DESC[p.house] : null

  return (
    <React.Fragment>
      <ChartRowHeading
        planet={planet}
        p={p}
        col={col}
        isAsc={isAsc}
        isSelected={isSelected}
        onSelect={onSelect}
        meta={meta}
      />
      {isSelected && (
        <tr className="birth-chart__inline-detail">
          <td colSpan="6">
            <ChartRowDetail planet={planet} p={p} col={col} hd={hd} />
          </td>
        </tr>
      )}
    </React.Fragment>
  )
}
