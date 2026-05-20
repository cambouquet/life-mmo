import { CITIES } from './citiesData.js'

export { CITIES }

export function searchCities(query) {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return CITIES.filter(c =>
    c.name.toLowerCase().startsWith(q) ||
    c.name.toLowerCase().includes(' ' + q) ||
    c.country.toLowerCase() === q
  ).slice(0, 7)
}
