import { useMemo } from 'react'
import { getAllPositions, getPlacidusHouses, getHouseNumber, longitudeToSign, longitudeToSymbol, degreesInSign, daysSinceJ2000 } from '../../game/astro/ephemeris'
import { SIGN_META } from '../../game/astro/horoscope'

export function useNatalChart(hasDate, chartDate, chartTime, birthCity) {
  return useMemo(() => {
    if (!hasDate) return { natalPlacements: null, houseCusps: null }
    try {
      const birthUTC = new Date(Date.UTC(chartDate.year, chartDate.month - 1, chartDate.day, chartDate.hour - (birthCity?.tz ?? 0), chartDate.minute || 0, 0))
      const placements = {}
      const rawNatal = getAllPositions(birthUTC, birthCity ? { lat: birthCity.lat, lng: birthCity.lng } : null)
      const cusps = birthCity ? getPlacidusHouses(daysSinceJ2000(birthUTC), birthCity.lat, birthCity.lng) : null
      for (const [planet, lon] of Object.entries(rawNatal)) {
        const sign = longitudeToSign(lon)
        placements[planet] = {
          longitude: lon,
          sign,
          symbol: longitudeToSymbol(lon),
          degrees: degreesInSign(lon),
          element: SIGN_META[sign]?.element ?? '?',
          house: cusps ? getHouseNumber(lon, cusps) : null,
        }
      }
      return { natalPlacements: placements, houseCusps: cusps }
    } catch {
      return { natalPlacements: null, houseCusps: null }
    }
  }, [hasDate, chartDate, chartTime, birthCity])
}
