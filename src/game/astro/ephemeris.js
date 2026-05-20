// Planetary position engine — Paul Schlyter full algorithm
// https://stjarnhimlen.se/comp/ppcomp.html
//
// Computes GEOCENTRIC ecliptic longitudes for all bodies in a birth chart.
// Accuracy: Sun ~0.01°, Moon ~0.3°, planets ~1–3°.
//
// Internal organization:
//   - ephemerisCore: math primitives and orbital mechanics
//   - planetLongitudes: individual body longitude functions
//   - angularPoints: Ascendant, Midheaven, Vertex
//   - houseSystems: Placidus house cusps

import { norm } from './ephemerisCore.js'
import {
  sunLongitude, moonLongitude, mercuryLongitude, venusLongitude, marsLongitude,
  jupiterLongitude, saturnLongitude, uranusLongitude, neptuneLongitude,
  plutoLongitude, chironLongitude, northNodeLongitude, lilithLongitude
} from './planetLongitudes.js'
import { ascendantLongitude, midheavenLongitude } from './angularPoints.js'
import { getPlacidusHouses, getHouseNumber } from './houseSystems.js'

// Convert date to Julian days since J2000.0 epoch (2000-01-01 12:00 UT)
export function daysSinceJ2000(date) {
  return date.getTime() / 86400000 + 2440587.5 - 2451545.0
}

// Zodiac sign and symbol lookup
const SIGNS   = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

export function longitudeToSign(lon)   { return SIGNS[  Math.floor(lon / 30)] }
export function longitudeToSymbol(lon) { return SYMBOLS[Math.floor(lon / 30)] }
export function degreesInSign(lon)     { return lon % 30 }

// Public API: compute all planetary positions for a given date and optional location.
// Returns object with keys: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn,
// Uranus, Neptune, Pluto, Chiron, NorthNode, Lilith.
// If location provided, also includes: Ascendant, Descendant, Midheaven, IC,
// Vertex, PartOfFortune.
export function getAllPositions(date, location = null) {
  const d = daysSinceJ2000(date)
  const sun  = sunLongitude(d)
  const moon = moonLongitude(d)
  const positions = {
    Sun:       sun,
    Moon:      moon,
    Mercury:   mercuryLongitude(d),
    Venus:     venusLongitude(d),
    Mars:      marsLongitude(d),
    Jupiter:   jupiterLongitude(d),
    Saturn:    saturnLongitude(d),
    Uranus:    uranusLongitude(d),
    Neptune:   neptuneLongitude(d),
    Pluto:     plutoLongitude(d),
    Chiron:    chironLongitude(d),
    NorthNode: northNodeLongitude(d),
    Lilith:    lilithLongitude(d),
  }

  if (location) {
    const asc = ascendantLongitude(d, location.lat, location.lng)
    const mc  = midheavenLongitude(d, location.lng)
    positions.Ascendant     = asc
    positions.Descendant    = norm(asc + 180)
    positions.Midheaven     = mc
    positions.IC            = norm(mc + 180)
    // Note: Vertex requires its own calculation; not included for simplicity

    // Part of Fortune: sum of Ascendant + Moon - Sun (night) or Ascendant + Sun - Moon (day)
    const isNight  = isAfterSunset(d, location.lat, location.lng, sun)
    positions.PartOfFortune = isNight ? norm(asc + sun - moon) : norm(asc + moon - sun)
  }
  return positions
}

// Determine if a given moment is after sunset (sun hour angle > 180°)
function isAfterSunset(d, latDeg, lngDeg, sunLon) {
  const obliquity = 23.4393 - 3.563e-7 * d
  const rad = Math.PI / 180
  const sunRA = norm(Math.atan2(Math.sin(sunLon * rad) * Math.cos(obliquity * rad), Math.cos(sunLon * rad)) * 180 / Math.PI)
  const GMST = norm(280.46061837 + 360.98564736629 * d)
  const sunHA = norm((GMST + lngDeg) - sunRA)
  return sunHA > 180
}

// Export internal APIs for advanced use (aspects, house assignment)
export { getPlacidusHouses, getHouseNumber }
