import { heliocentricPosition, sunGeocentricCoordinates, toGeocentricLongitude } from './ephemerisCore.js'
import { HELIOCENTRIC_ORBITS } from './heliocentricOrbits.js'

function computePlanetLongitude(d, orbitKey, w_offset = 0) {
  const orbit = HELIOCENTRIC_ORBITS[orbitKey]
  const omega = orbit.omega + w_offset
  const { x, y } = heliocentricPosition(d,
    orbit.Omega, orbit.omegaDot,
    orbit.i, orbit.iDot,
    omega, orbit.omegaDot2,
    orbit.a,
    orbit.e, orbit.eDot,
    orbit.L, orbit.n
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function mercuryLongitude(d) { return computePlanetLongitude(d, 'mercury', 2.439) }
export function venusLongitude(d) { return computePlanetLongitude(d, 'venus', 2.3562) }
export function marsLongitude(d) { return computePlanetLongitude(d, 'mars', 0.77747) }
export function jupiterLongitude(d) { return computePlanetLongitude(d, 'jupiter', 0.0443) }
export function saturnLongitude(d) { return computePlanetLongitude(d, 'saturn', -0.11062) }
export function uranusLongitude(d) { return computePlanetLongitude(d, 'uranus') }
export function neptuneLongitude(d) { return computePlanetLongitude(d, 'neptune') }
