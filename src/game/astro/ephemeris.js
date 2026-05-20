import { norm } from './ephemerisCore.js'
import { sunLongitude, moonLongitude, mercuryLongitude, venusLongitude, marsLongitude, jupiterLongitude, saturnLongitude, uranusLongitude, neptuneLongitude, plutoLongitude, chironLongitude, northNodeLongitude, lilithLongitude } from './planetLongitudes.js'
import { ascendantLongitude, midheavenLongitude } from './angularPoints.js'
import { getPlacidusHouses, getHouseNumber } from './houseSystems.js'
import { longitudeToSign, longitudeToSymbol, degreesInSign } from './zodiacSigns.js'
import { isAfterSunset, getPartOfFortune } from './fortuneCalculations.js'

export function daysSinceJ2000(date) {
  return date.getTime() / 86400000 + 2440587.5 - 2451545.0
}

export { longitudeToSign, longitudeToSymbol, degreesInSign }

export function getAllPositions(date, location = null) {
  const d = daysSinceJ2000(date)
  const sun = sunLongitude(d)
  const moon = moonLongitude(d)
  const positions = {
    Sun: sun,
    Moon: moon,
    Mercury: mercuryLongitude(d),
    Venus: venusLongitude(d),
    Mars: marsLongitude(d),
    Jupiter: jupiterLongitude(d),
    Saturn: saturnLongitude(d),
    Uranus: uranusLongitude(d),
    Neptune: neptuneLongitude(d),
    Pluto: plutoLongitude(d),
    Chiron: chironLongitude(d),
    NorthNode: northNodeLongitude(d),
    Lilith: lilithLongitude(d),
  }

  if (location) {
    const asc = ascendantLongitude(d, location.lat, location.lng)
    const mc = midheavenLongitude(d, location.lng)
    positions.Ascendant = asc
    positions.Descendant = norm(asc + 180)
    positions.Midheaven = mc
    positions.IC = norm(mc + 180)
    const isNight = isAfterSunset(d, location.lat, location.lng, sun)
    positions.PartOfFortune = getPartOfFortune(asc, sun, moon, isNight)
  }
  return positions
}

export { getPlacidusHouses, getHouseNumber }
