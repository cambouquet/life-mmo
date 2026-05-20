import { norm, cos_, sin_, eccentricAnomaly, sunGeocentricCoordinates } from './ephemerisCore.js'
import { applyMoonPerturbations } from './moonPerturbations.js'

export function sunLongitude(d) {
  return sunGeocentricCoordinates(d).lon
}

export function moonLongitude(d) {
  const N = norm(125.1228 - 0.0529538083 * d)
  const i = 5.1454
  const offset = 20.33611 - 0.000021 * (d - 2947.66)
  const w = norm(318.0634 + offset + 0.1643573223 * d)
  const e = 0.054900
  const M = norm(115.3654 + 13.0649929509 * d)
  const E = eccentricAnomaly(M, e)
  const xv = cos_(E) - e
  const yv = Math.sqrt(1 - e * e) * sin_(E)
  const v = Math.atan2(yv, xv) * 180 / Math.PI
  const vw = v + w
  const xeclip = cos_(N) * cos_(vw) - sin_(N) * sin_(vw) * cos_(i)
  const yeclip = sin_(N) * cos_(vw) + cos_(N) * sin_(vw) * cos_(i)

  const Ls = sunGeocentricCoordinates(d).lon
  const Lm = norm(N + w + M)
  const Ms = norm(356.0470 + 0.9856002585 * d)
  const D = Lm - Ls
  const F = Lm - N

  let lon = Math.atan2(yeclip, xeclip) * 180 / Math.PI
  lon = applyMoonPerturbations(lon, M, D, F, Ms)
  return norm(lon)
}

export function northNodeLongitude(d) {
  return norm(125.0445 - 0.0529539 * d)
}

export function lilithLongitude(d) {
  return norm(263.4678 + 0.1114041 * d)
}
