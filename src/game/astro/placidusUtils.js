import { norm, rad, sin_, cos_ } from './ephemerisCore.js'

export function solveCusp(RAMC_target, f, guess, eps, latDeg) {
  let L = guess
  for (let i = 0; i < 80; i++) {
    const dec = Math.asin(sin_(eps) * sin_(L)) * 180 / Math.PI
    const tanDec = Math.tan(rad(dec))
    const tanLat = Math.tan(rad(latDeg))
    if (Math.abs(tanDec * tanLat) > 1) break
    const RA = norm(RAMC_target + f * Math.asin(tanDec * tanLat) * 180 / Math.PI)
    const L_new = norm(Math.atan2(sin_(RA) * cos_(eps) + tanDec * sin_(eps), cos_(RA)) * 180 / Math.PI)
    if (Math.abs(norm(L_new - L + 180) - 180) < 0.0001) { L = L_new; break }
    L = 0.5 * L + 0.5 * L_new
  }
  return L
}
