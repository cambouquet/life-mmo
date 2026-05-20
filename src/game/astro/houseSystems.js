import { norm } from './ephemerisCore.js'
import { ascendantLongitude, midheavenLongitude } from './angularPoints.js'
import { solveCusp } from './placidusUtils.js'

export function getPlacidusHouses(d, latDeg, lngDeg) {
  const eps  = 23.4393 - 3.563e-7 * d
  const GMST = norm(280.46061837 + 360.98564736629 * d)
  const RAMC = norm(GMST + lngDeg)

  const asc = ascendantLongitude(d, latDeg, lngDeg)
  const mc  = midheavenLongitude(d, lngDeg)

  const h11 = solveCusp(RAMC + 30.0,  1/3.0, mc + 30, eps, latDeg)
  const h12 = solveCusp(RAMC + 60.0,  2/3.0, mc + 60, eps, latDeg)
  const h2  = solveCusp(RAMC + 120.0, 2/3.0, asc + 30, eps, latDeg)
  const h3  = solveCusp(RAMC + 150.0, 1/3.0, asc + 60, eps, latDeg)

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
