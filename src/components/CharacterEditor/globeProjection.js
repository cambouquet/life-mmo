export function createProjection(centerLat, centerLng, cx, cy, r) {
  return function project(lat, lng) {
    const φ = lat * Math.PI / 180
    const λ = lng * Math.PI / 180
    const dλ = λ - centerLng
    const cosC = Math.sin(centerLat) * Math.sin(φ) + Math.cos(centerLat) * Math.cos(φ) * Math.cos(dλ)
    if (cosC < 0) return null
    const x = cx + r * Math.cos(φ) * Math.sin(dλ)
    const y = cy - r * (Math.cos(centerLat) * Math.sin(φ) - Math.sin(centerLat) * Math.cos(φ) * Math.cos(dλ))
    return [x, y]
  }
}

export function makeLatLine(lat, project, steps = 72) {
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

export function makeLngLine(lng, project, steps = 72) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const lat = -90 + (i / steps) * 180
    const p = project(lat, lng)
    if (p) pts.push(p)
  }
  if (pts.length < 2) return null
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
}
