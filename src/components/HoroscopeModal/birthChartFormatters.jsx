import React from 'react'

export function fmtDeg(decimal) {
  const d = Math.floor(decimal)
  const m = Math.floor((decimal - d) * 60)
  const s = Math.floor(((decimal - d) * 60 - m) * 60)
  return (
    <span className="coord">
      <span className="coord__deg">{d}</span>
      <span className="coord__unit">°</span>
      <span className="coord__val">{String(m).padStart(2, '0')}</span>
      <span className="coord__unit">'</span>
      <span className="coord__val">{String(s).padStart(2, '0')}</span>
      <span className="coord__unit">"</span>
    </span>
  )
}
