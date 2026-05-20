export function norm(deg) { return ((deg % 360) + 360) % 360 }
export function rad(deg)  { return deg * Math.PI / 180 }
export function cos_(d)   { return Math.cos(rad(d)) }
export function sin_(d)   { return Math.sin(rad(d)) }
export function tan_(d)   { return Math.tan(rad(d)) }

export function eccentricAnomaly(M, e) {
  let E = M + (180 / Math.PI) * e * sin_(M) * (1 + e * cos_(M))
  for (let i = 0; i < 15; i++) {
    const dE = (M - E + (180 / Math.PI) * e * sin_(E)) / (1 - e * cos_(E))
    E += dE
    if (Math.abs(dE) < 1e-8) break
  }
  return E
}

export function heliocentricPosition(d, N0, N1, i0, i1, w0, w1, a, e0, e1, M0, M1) {
  const N = norm(N0 + N1 * d)
  const i = i0 + i1 * d
  const w = norm(w0 + w1 * d)
  const e = e0 + e1 * d
  const M = norm(M0 + M1 * d)
  const E = eccentricAnomaly(M, e)
  const xv = a * (cos_(E) - e)
  const yv = a * Math.sqrt(1 - e * e) * sin_(E)
  const v = Math.atan2(yv, xv) * 180 / Math.PI
  const r = Math.sqrt(xv * xv + yv * yv)
  const vw = v + w
  return {
    x: r * (cos_(N) * cos_(vw) - sin_(N) * sin_(vw) * cos_(i)),
    y: r * (sin_(N) * cos_(vw) + cos_(N) * sin_(vw) * cos_(i)),
  }
}

export function sunGeocentricCoordinates(d) {
  const offset = 1.518044 + 0.0000078 * (d - 2947.66)
  const w = norm(282.9404 + offset + 4.70935e-5 * d)
  const e = 0.016709 - 1.151e-9 * d
  const M = norm(356.0470 + 0.9856002585 * d)
  const E = eccentricAnomaly(M, e)
  const xv = cos_(E) - e
  const yv = Math.sqrt(1 - e * e) * sin_(E)
  const v = Math.atan2(yv, xv) * 180 / Math.PI
  const r = Math.sqrt(xv * xv + yv * yv)
  const lon = norm(v + w)
  return { xs: r * cos_(lon), ys: r * sin_(lon), lon, r }
}

// Convert heliocentric coordinates to geocentric ecliptic longitude.
export function toGeocentricLongitude(xh, yh, xs, ys) {
  return norm(Math.atan2(yh + ys, xh + xs) * 180 / Math.PI)
}
