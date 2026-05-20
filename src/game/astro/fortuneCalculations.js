import { norm } from './ephemerisCore'

export function isAfterSunset(d, latDeg, lngDeg, sunLon) {
  const obliquity = 23.4393 - 3.563e-7 * d
  const rad = Math.PI / 180
  const sunRA = norm(Math.atan2(Math.sin(sunLon * rad) * Math.cos(obliquity * rad), Math.cos(sunLon * rad)) * 180 / Math.PI)
  const GMST = norm(280.46061837 + 360.98564736629 * d)
  const sunHA = norm((GMST + lngDeg) - sunRA)
  return sunHA > 180
}

export function getPartOfFortune(asc, sun, moon, isNight) {
  return isNight ? norm(asc + sun - moon) : norm(asc + moon - sun)
}
