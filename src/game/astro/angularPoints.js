// Ascendant, Midheaven, and Vertex calculations.
// These are the angles of the ecliptic relative to observer's horizon and meridian.

import { norm, rad, cos_, sin_, tan_ } from './ephemerisCore.js'

// Ascendant: sign rising on the eastern horizon at birth.
export function ascendantLongitude(d, latDeg, lngDeg) {
  const obliquity = 23.4393 - 3.563e-7 * d
  const GMST = norm(280.46061837 + 360.98564736629 * d)
  const LST  = norm(GMST + lngDeg)
  return norm(
    Math.atan2(cos_(LST), -(sin_(LST) * cos_(obliquity) + tan_(latDeg) * sin_(obliquity))) * 180 / Math.PI
  )
}

// Midheaven (MC): sign on the meridian at birth.
export function midheavenLongitude(d, lngDeg) {
  const obliquity = 23.4393 - 3.563e-7 * d
  const GMST = norm(280.46061837 + 360.98564736629 * d)
  const LST  = norm(GMST + lngDeg)
  return norm(Math.atan2(sin_(LST), cos_(LST) * cos_(obliquity)) * 180 / Math.PI)
}

// Vertex: sensitive point on the west prime vertical.
// Iterative solver: find ecliptic longitude on the prime vertical.
export function vertexLongitude(d, latDeg, lngDeg) {
  const eps  = 23.4393 - 3.563e-7 * d
  const GMST = norm(280.46061837 + 360.98564736629 * d)
  const RAMC = norm(GMST + lngDeg)

  let L = norm(RAMC + 90)
  for (let i = 0; i < 60; i++) {
    const dec = Math.asin(sin_(eps) * sin_(L)) * 180 / Math.PI
    const cosH = Math.tan(rad(dec)) / Math.tan(rad(latDeg))
    if (Math.abs(cosH) > 1) { L = norm(L + 5); continue }
    const H_west = 360 - Math.acos(cosH) * 180 / Math.PI
    const RA = norm(RAMC - H_west)
    const L_new = norm(Math.atan2(sin_(RA) * cos_(eps) + Math.tan(rad(dec)) * sin_(eps), cos_(RA)) * 180 / Math.PI)
    if (Math.abs(L_new - L) < 0.0001) break
    L = 0.7 * L + 0.3 * L_new
  }
  return norm(L + 180)  // anti-vertex → vertex
}
