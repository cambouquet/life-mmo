import { PLANET_DESC, SIGN_DESC, HOUSE_DESC } from './astroConstants'
import { getDegreeInterpretation } from './degreeInterpretation'

export function ChartRowDetail({ planet, p, col, hd }) {
  const pd = PLANET_DESC[planet]
  const sd = SIGN_DESC[p.sign]

  return (
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
  )
}
