import { norm, cos_, sin_, eccentricAnomaly, heliocentricPosition, sunGeocentricCoordinates, toGeocentricLongitude } from './ephemerisCore.js'

export function plutoLongitude(d) {
  const N = norm(110.30347 + 1.3131804e-5 * d)
  const i = 17.14175
  const w = norm(113.76329 + 4.2685 + 1.1022e-5 * d)
  const e = 0.24880766
  const M = norm(14.82353 + 0.00397506 * d)
  const E = eccentricAnomaly(M, e)
  const a = 39.48168677
  const xv = a * (cos_(E) - e)
  const yv = a * Math.sqrt(1 - e * e) * sin_(E)
  const v  = Math.atan2(yv, xv) * 180 / Math.PI
  const vw = v + w
  const xh = xv * (cos_(N) * cos_(vw) - sin_(N) * sin_(vw) * cos_(i)) + yv * (-cos_(N) * sin_(vw) - sin_(N) * cos_(vw) * cos_(i))
  const yh = xv * (sin_(N) * cos_(vw) + cos_(N) * sin_(vw) * cos_(i)) + yv * (-sin_(N) * sin_(vw) + cos_(N) * cos_(vw) * cos_(i))
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(xh, yh, xs, ys)
}

export function chironLongitude(d) {
  const { x, y } = heliocentricPosition(d,
    209.370,  0.0,
      6.932,  0.0,
    339.198,  0.0,
    13.6486,
      0.38457, 0.0,
     22.735,  0.019568
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}
