import { PLANET_GLYPHS, PLANET_NAMES, ELEMENT_COLOR } from './astroConstants'
import { fmtDeg } from './birthChartFormatters.jsx'

export function ChartRowHeading({ planet, p, col, isAsc, isSelected, onSelect, meta }) {
  return (
    <tr
      className={`birth-chart__row${isAsc ? ' birth-chart__row--asc' : ''}${isSelected ? ' is-selected' : ''}`}
      style={{ color: col }}
      onClick={() => onSelect(isSelected ? null : planet)}
    >
      <td className="birth-chart__glyph">{PLANET_GLYPHS[planet]}</td>
      <td className="birth-chart__planet">{PLANET_NAMES[planet] ?? planet}</td>
      <td className="birth-chart__sign">{p.symbol} {p.sign}</td>
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
  )
}
