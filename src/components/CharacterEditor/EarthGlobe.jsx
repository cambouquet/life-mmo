import { createProjection, makeLatLine, makeLngLine } from './globeProjection'

export function EarthGlobe({ city, size = 120, style }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4
  const centerLat = city ? city.lat * Math.PI / 180 : 0
  const centerLng = city ? city.lng * Math.PI / 180 : 0
  const project = createProjection(centerLat, centerLng, cx, cy, r)
  const latLines = [-60, -30, 0, 30, 60].map(l => makeLatLine(l, project)).filter(Boolean)
  const lngLines = [-120, -60, 0, 60, 120, 180].map(l => makeLngLine(l, project)).filter(Boolean)
  const dotPos = city ? project(city.lat, city.lng) : null

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', ...style }}>
      <defs>
        <radialGradient id="globe-grad" cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(80,40,160,0.7)" />
          <stop offset="100%" stopColor="rgba(8,4,24,0.95)" />
        </radialGradient>
        <clipPath id="globe-clip"><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="url(#globe-grad)" />
      <g clipPath="url(#globe-clip)" stroke="rgba(168,85,247,0.18)" strokeWidth="0.6" fill="none">
        {latLines.map((d, i) => <path key={`lat${i}`} d={d} />)}
        {lngLines.map((d, i) => <path key={`lng${i}`} d={d} />)}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(168,85,247,0.35)" strokeWidth="1" />
      {dotPos && <>
        <circle cx={dotPos[0]} cy={dotPos[1]} r={3.5} fill="rgba(168,85,247,0.3)" />
        <circle cx={dotPos[0]} cy={dotPos[1]} r={2} fill="#c084fc" />
        <circle cx={dotPos[0]} cy={dotPos[1]} r={4.5} fill="none" stroke="rgba(192,132,252,0.5)" strokeWidth="0.8" />
      </>}
    </svg>
  )
}
