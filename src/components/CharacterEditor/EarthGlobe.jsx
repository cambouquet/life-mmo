import React from 'react'

export function EarthGlobe({ city, size = 120, style }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4

  const centerLat = city ? city.lat * Math.PI / 180 : 0
  const centerLng = city ? city.lng * Math.PI / 180 : 0

  function project(lat, lng) {
    const φ = lat * Math.PI / 180
    const λ = lng * Math.PI / 180
    const dλ = λ - centerLng
    const cosC = Math.sin(centerLat) * Math.sin(φ) + Math.cos(centerLat) * Math.cos(φ) * Math.cos(dλ)
    if (cosC < 0) return null
    const x = cx + r * Math.cos(φ) * Math.sin(dλ)
    const y = cy - r * (Math.cos(centerLat) * Math.sin(φ) - Math.sin(centerLat) * Math.cos(φ) * Math.cos(dλ))
    return [x, y]
  }

  function latLine(lat, steps = 72) {
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const lng = -180 + (i / steps) * 360
      const p = project(lat, lng)
      if (p) pts.push(p)
      else if (pts.length > 1) break
    }
    if (pts.length < 2) return null
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  }

  function lngLine(lng, steps = 72) {
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const lat = -90 + (i / steps) * 180
      const p = project(lat, lng)
      if (p) pts.push(p)
    }
    if (pts.length < 2) return null
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  }

  const latLines  = [-60, -30, 0, 30, 60].map(l => latLine(l)).filter(Boolean)
  const lngLines  = [-120, -60, 0, 60, 120, 180].map(l => lngLine(l)).filter(Boolean)
  const dotPos    = city ? project(city.lat, city.lng) : null

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', ...style }}>
      <defs>
        <radialGradient id="globe-grad" cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="rgba(80,40,160,0.7)" />
          <stop offset="100%" stopColor="rgba(8,4,24,0.95)" />
        </radialGradient>
        <clipPath id="globe-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      <circle cx={cx} cy={cy} r={r} fill="url(#globe-grad)" />

      <g clipPath="url(#globe-clip)" stroke="rgba(168,85,247,0.18)" strokeWidth="0.6" fill="none">
        {latLines.map((d, i) => <path key={`lat${i}`} d={d} />)}
        {lngLines.map((d, i) => <path key={`lng${i}`} d={d} />)}
      </g>

      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(168,85,247,0.35)" strokeWidth="1" />

      {dotPos && <>
        <circle cx={dotPos[0]} cy={dotPos[1]} r={3.5} fill="rgba(168,85,247,0.3)" />
        <circle cx={dotPos[0]} cy={dotPos[1]} r={2}   fill="#c084fc" />
        <circle cx={dotPos[0]} cy={dotPos[1]} r={4.5} fill="none" stroke="rgba(192,132,252,0.5)" strokeWidth="0.8" />
      </>}
    </svg>
  )
}
