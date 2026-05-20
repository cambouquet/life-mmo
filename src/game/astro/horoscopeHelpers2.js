import { getAllPositions, getPlacidusHouses, daysSinceJ2000 } from './ephemeris.js'

export function parseBirthDateTime(birthData) {
  const [yr, mo, dy] = birthData.date.split('-').map(Number)
  const timeSplit = (birthData.time || '12:00').split(':').map(Number)
  const bh = timeSplit[0] || 0; const bm = timeSplit[1] || 0; const bs = timeSplit[2] || 0
  const tzOffset = birthData.city?.tz ?? 0
  return new Date(Date.UTC(yr, mo - 1, dy, bh - tzOffset, bm, bs))
}

export function getNatalData(birthData) {
  const birthUTC = parseBirthDateTime(birthData)
  const location = birthData.city ? { lat: birthData.city.lat, lng: birthData.city.lng } : null
  const rawNatal = getAllPositions(birthUTC, location)
  const natalHouses = location ? getPlacidusHouses(daysSinceJ2000(birthUTC), location.lat, location.lng) : null
  return { birthUTC, location, rawNatal, natalHouses }
}
