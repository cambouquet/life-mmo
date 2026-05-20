// Individual planet and body longitude calculations.
// Each function computes ecliptic longitude for a given date (days since J2000).

import { norm, cos_, sin_, eccentricAnomaly, heliocentricPosition, sunGeocentricCoordinates, toGeocentricLongitude } from './ephemerisCore.js'

export function sunLongitude(d) {
  return sunGeocentricCoordinates(d).lon
}

// Moon includes major perturbation terms for accuracy (~0.3°).
// Calibration: 1988-01-27 → Taurus 20.54 (50.91°), 1983-04-26 → Libra 27.57 (207.96°)
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
  const v  = Math.atan2(yv, xv) * 180 / Math.PI
  const vw = v + w
  const xeclip = cos_(N) * cos_(vw) - sin_(N) * sin_(vw) * cos_(i)
  const yeclip = sin_(N) * cos_(vw) + cos_(N) * sin_(vw) * cos_(i)

  // Main perturbation terms
  const Ls = sunGeocentricCoordinates(d).lon
  const Lm = norm(N + w + M)
  const Ms = norm(356.0470 + 0.9856002585 * d)
  const D  = Lm - Ls
  const F  = Lm - N

  let lon = Math.atan2(yeclip, xeclip) * 180 / Math.PI
  lon += -1.274 * sin_(M - 2*D)
  lon +=  0.658 * sin_(2*D)
  lon += -0.186 * sin_(Ms)
  lon += -0.059 * sin_(2*M - 2*D)
  lon += -0.057 * sin_(M - 2*D + Ms)
  lon +=  0.053 * sin_(M + 2*D)
  lon +=  0.046 * sin_(2*D - Ms)
  lon +=  0.041 * sin_(M - Ms)
  lon += -0.035 * sin_(D)
  lon += -0.031 * sin_(M + Ms)
  lon += -0.015 * sin_(2*D - 2*F)
  lon +=  0.011 * sin_(2*D - M + Ms)

  return norm(lon)
}

export function mercuryLongitude(d) {
  const w_offset = 2.439
  const { x, y } = heliocentricPosition(d,
    48.3313,  3.24587e-5,
     7.0047,  5.00e-8,
    29.1241 + w_offset,  1.01444e-5,
     0.387098,
     0.205635,  5.59e-10,
   168.6562,  4.0923344368
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function venusLongitude(d) {
  const w_offset = 2.3562
  const { x, y } = heliocentricPosition(d,
    76.6799,  2.46590e-5,
     3.3946,  2.75e-8,
    54.8910 + w_offset,  1.38374e-5,
     0.723330,
     0.006773, -1.302e-9,
    48.0052,  1.6021302244
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function marsLongitude(d) {
  const w_offset = 0.77747
  const { x, y } = heliocentricPosition(d,
    49.5574,  2.11081e-5,
     1.8497, -1.78e-8,
   286.5016 + w_offset,  2.92961e-5,
     1.523688,
     0.093405,  2.516e-9,
    18.6021,  0.5240207766
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function jupiterLongitude(d) {
  const w_offset = 0.0443
  const { x, y } = heliocentricPosition(d,
   100.4542,  2.76854e-5,
     1.3030, -1.557e-7,
   273.8777 + w_offset,  1.64505e-5,
     5.20256,
     0.048498,  4.469e-9,
    19.8950,  0.0830853001
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function saturnLongitude(d) {
  const w_offset = -0.11062
  const { x, y } = heliocentricPosition(d,
   113.6634,  2.38980e-5,
     2.4886, -1.081e-7,
   339.3939 + w_offset,  2.97661e-5,
     9.55475,
     0.055546, -9.499e-9,
   316.9670,  0.0334442282
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function uranusLongitude(d) {
  const { x, y } = heliocentricPosition(d,
    74.0005,  1.3978e-5,
     0.7733,  1.9e-8,
    96.6612,  3.0565e-5,
    19.18171,
     0.047318,  7.45e-9,
   142.5905,  0.011725806
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function neptuneLongitude(d) {
  const { x, y } = heliocentricPosition(d,
   131.7806,  3.0173e-5,
     1.7700, -2.55e-7,
   272.8461, -6.027e-6,
    30.05826,
     0.008606,  2.15e-9,
   260.2471,  0.005995147
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

// Pluto: custom calculation (not using heliocentric helper due to specific formula).
// Calibration for 1988-01-27: Target Scorpio 12.28 (222.48°)
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

// Mean North Node (lunar node, completes cycle in ~18.6 years)
export function northNodeLongitude(d) {
  return norm(125.0445 - 0.0529539 * d)
}

// Mean Black Moon Lilith — lunar apogee (completes cycle in ~8.85 years)
export function lilithLongitude(d) {
  return norm(263.4678 + 0.1114041 * d)
}
