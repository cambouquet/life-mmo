// Placidus house system — the most accurate for psychological astrology.
// Returns array of 12 ecliptic longitudes [H1..H12] where H1 = Ascendant, H10 = Midheaven.

import { norm, rad, sin_, cos_ } from './ephemerisCore.js'
import { ascendantLongitude, midheavenLongitude } from './angularPoints.js'

// Placidus: each intermediate cusp is where a degree of the ecliptic spends
// 1/3 (for H11/H9) or 2/3 (for H12/H8) of its semiarc above/below horizon.
export function getPlacidusHouses(d, latDeg, lngDeg) {
  const eps  = 23.4393 - 3.563e-7 * d
  const GMST = norm(280.46061837 + 360.98564736629 * d)
  const RAMC = norm(GMST + lngDeg)

  const asc = ascendantLongitude(d, latDeg, lngDeg)
  const mc  = midheavenLongitude(d, lngDeg)

  // Iterative cusp solver using semidurnal arc correction.
  function solveCusp(RAMC_target, f, guess) {
    let L = guess
    for (let i = 0; i < 80; i++) {
      const dec = Math.asin(sin_(eps) * sin_(L)) * 180 / Math.PI
      const tanDec = Math.tan(rad(dec))
      const tanLat = Math.tan(rad(latDeg))
      if (Math.abs(tanDec * tanLat) > 1) break // polar edge case
      const RA = norm(RAMC_target + f * Math.asin(tanDec * tanLat) * 180 / Math.PI)
      const L_new = norm(Math.atan2(sin_(RA) * cos_(eps) + tanDec * sin_(eps), cos_(RA)) * 180 / Math.PI)
      if (Math.abs(norm(L_new - L + 180) - 180) < 0.0001) { L = L_new; break }
      L = 0.5 * L + 0.5 * L_new
    }
    return L
  }

  const h11 = solveCusp(RAMC + 30.0,  1/3.0, mc + 30)
  const h12 = solveCusp(RAMC + 60.0,  2/3.0, mc + 60)
  const h2  = solveCusp(RAMC + 120.0, 2/3.0, asc + 30)
  const h3  = solveCusp(RAMC + 150.0, 1/3.0, asc + 60)

  const ic  = norm(mc + 180)
  const dsc = norm(asc + 180)

  return [
    asc,            // H1 (Ascendant)
    h2,             // H2
    h3,             // H3
    ic,             // H4 (Imum Coeli)
    norm(h11 + 180),// H5
    norm(h12 + 180),// H6
    dsc,            // H7 (Descendant)
    norm(h2 + 180), // H8
    norm(h3 + 180), // H9
    mc,             // H10 (Midheaven)
    h11,            // H11
    h12,            // H12
  ]
}

// Determine which house a given ecliptic longitude falls into.
export function getHouseNumber(lon, cusps) {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i]
    const end   = cusps[(i + 1) % 12]
    // Handle wrap-around at 0° (Aries/Pisces boundary)
    if (start <= end ? (lon >= start && lon < end) : (lon >= start || lon < end)) {
      return i + 1
    }
  }
  return 1
}
