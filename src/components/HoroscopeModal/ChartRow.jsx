import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_GLYPHS, PLANET_NAMES, ELEMENT_COLOR, PLANET_DESC, SIGN_DESC, HOUSE_DESC } from './astroConstants.js'
import { fmtDeg } from './birthChartFormatters.jsx'
import { getDegreeInterpretation } from './degreeInterpretation.js'

export function ChartRow({ planet, displayPlacements, isSelected, onSelect }) {
  const p = displayPlacements[planet]
  const meta = SIGN_META[p.sign]
  const col = ELEMENT_COLOR[meta?.element] ?? '#c8a8f0'
  const isAsc = planet === 'Ascendant'

  const pd = PLANET_DESC[planet]
  const sd = SIGN_DESC[p.sign]
  const hd = p.house ? HOUSE_DESC[p.house] : null

  return (
    <React.Fragment>
      <tr
        className={`birth-chart__row${isAsc ? ' birth-chart__row--asc' : ''}${isSelected ? ' is-selected' : ''}`}
        style={{ color: col }}
        onClick={() => onSelect(isSelected ? null : planet)}
      >
        <td className="birth-chart__glyph">{PLANET_GLYPHS[planet]}</td>
        <td className="birth-chart__planet">{PLANET_NAMES[planet] ?? planet}</td>
        <td className="birth-chart__sign">
          {p.symbol} {p.sign}
        </td>
        <td className="birth-chart__deg">{fmtDeg(p.degrees)}</td>
        {p.house && (
          <td className="birth-chart__house">
            <span className="birth-chart__house-badge" style={{ color: col, borderColor: `${col}55` }}>
              {p.house}
            </span>
          </td>
        )}
        <td className="birth-chart__element-cell">
          <span className="birth-chart__element" style={{ color: col, backgroundColor: `${col}22`, border: `1px solid ${col}44` }}>
            {meta?.element ?? ''}
          </span>
        </td>
      </tr>
      {isSelected && (
        <tr className="birth-chart__inline-detail">
          <td colSpan="6">
            <div className="birth-chart__detail-content" style={{ borderLeftColor: col }}>
              <strong style={{ color: col }}>
                {planet} in {p.sign}
                {hd ? `, ${hd.name}` : ''} — {pd?.summary}, {sd?.short}.
              </strong>
              <br />
              <br />
              <span style={{ opacity: 0.9 }}>
                <em style={{ color: col, fontStyle: 'normal' }}>{planet}: </em>
                {pd?.detail}
              </span>
              <br />
              <br />
              <span style={{ opacity: 0.85 }}>
                <em style={{ color: col, fontStyle: 'normal' }}>
                  {p.symbol} {p.sign}:{' '}
                </em>
                {sd?.long}
              </span>
              <br />
              <br />
              <span style={{ opacity: 0.7 }}>
                <em style={{ fontStyle: 'normal' }}>° {Math.floor(p.degrees)}° in sign: </em>
                {getDegreeInterpretation(p.degrees)}
              </span>
              {hd && (
                <>
                  <br />
                  <br />
                  <span style={{ opacity: 0.8 }}>
                    <em style={{ color: col, fontStyle: 'normal' }}>
                      House {p.house} — {hd.name}:{' '}
                    </em>
                    {hd.short}.
                  </span>
                </>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  )
}
