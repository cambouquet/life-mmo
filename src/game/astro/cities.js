// Major world cities with coordinates and standard UTC offset (no DST)
export const CITIES = [
  // North America
  { name: 'New York',        country: 'US', lat:  40.71, lng:  -74.01, tz: -5 },
  { name: 'Los Angeles',     country: 'US', lat:  34.05, lng: -118.24, tz: -8 },
  { name: 'Chicago',         country: 'US', lat:  41.88, lng:  -87.63, tz: -6 },
  { name: 'Houston',         country: 'US', lat:  29.76, lng:  -95.37, tz: -6 },
  { name: 'Phoenix',         country: 'US', lat:  33.45, lng: -112.07, tz: -7 },
  { name: 'San Francisco',   country: 'US', lat:  37.77, lng: -122.42, tz: -8 },
  { name: 'Seattle',         country: 'US', lat:  47.61, lng: -122.33, tz: -8 },
  { name: 'Miami',           country: 'US', lat:  25.77, lng:  -80.19, tz: -5 },
  { name: 'Boston',          country: 'US', lat:  42.36, lng:  -71.06, tz: -5 },
  { name: 'Denver',          country: 'US', lat:  39.74, lng: -104.99, tz: -7 },
  { name: 'Toronto',         country: 'CA', lat:  43.65, lng:  -79.38, tz: -5 },
  { name: 'Montreal',        country: 'CA', lat:  45.50, lng:  -73.57, tz: -5 },
  { name: 'Vancouver',       country: 'CA', lat:  49.25, lng: -123.12, tz: -8 },
  { name: 'Mexico City',     country: 'MX', lat:  19.43, lng:  -99.13, tz: -6 },

  // South America
  { name: 'São Paulo',       country: 'BR', lat: -23.55, lng:  -46.63, tz: -3 },
  { name: 'Rio de Janeiro',  country: 'BR', lat: -22.91, lng:  -43.17, tz: -3 },
  { name: 'Buenos Aires',    country: 'AR', lat: -34.60, lng:  -58.38, tz: -3 },
  { name: 'Santiago',        country: 'CL', lat: -33.46, lng:  -70.65, tz: -4 },
  { name: 'Bogotá',          country: 'CO', lat:   4.71, lng:  -74.07, tz: -5 },
  { name: 'Lima',            country: 'PE', lat: -12.05, lng:  -77.04, tz: -5 },

  // Europe
  { name: 'London',          country: 'GB', lat:  51.51, lng:   -0.13, tz:  0 },
  { name: 'Paris',           country: 'FR', lat:  48.86, lng:    2.35, tz:  1 },
  { name: 'Paris XIII',      country: 'FR', lat:  48.83, lng:    2.36, tz:  1 },
  { name: 'Berlin',          country: 'DE', lat:  52.52, lng:   13.41, tz:  1 },
  { name: 'Madrid',          country: 'ES', lat:  40.42, lng:   -3.70, tz:  1 },
  { name: 'Rome',            country: 'IT', lat:  41.90, lng:   12.50, tz:  1 },
  { name: 'Amsterdam',       country: 'NL', lat:  52.37, lng:    4.90, tz:  1 },
  { name: 'Brussels',        country: 'BE', lat:  50.85, lng:    4.35, tz:  1 },
  { name: 'Vienna',          country: 'AT', lat:  48.21, lng:   16.37, tz:  1 },
  { name: 'Warsaw',          country: 'PL', lat:  52.23, lng:   21.01, tz:  1 },
  { name: 'Prague',          country: 'CZ', lat:  50.08, lng:   14.44, tz:  1 },
  { name: 'Stockholm',       country: 'SE', lat:  59.33, lng:   18.07, tz:  1 },
  { name: 'Oslo',            country: 'NO', lat:  59.91, lng:   10.75, tz:  1 },
  { name: 'Copenhagen',      country: 'DK', lat:  55.68, lng:   12.57, tz:  1 },
  { name: 'Helsinki',        country: 'FI', lat:  60.17, lng:   24.94, tz:  2 },
  { name: 'Athens',          country: 'GR', lat:  37.98, lng:   23.73, tz:  2 },
  { name: 'Lisbon',          country: 'PT', lat:  38.72, lng:   -9.14, tz:  0 },
  { name: 'Zurich',          country: 'CH', lat:  47.38, lng:    8.54, tz:  1 },
  { name: 'Budapest',        country: 'HU', lat:  47.50, lng:   19.04, tz:  1 },
  { name: 'Bucharest',       country: 'RO', lat:  44.43, lng:   26.10, tz:  2 },
  { name: 'Kyiv',            country: 'UA', lat:  50.45, lng:   30.52, tz:  2 },
  { name: 'Minsk',           country: 'BY', lat:  53.90, lng:   27.57, tz:  3 },

  // Russia & Central Asia
  { name: 'Moscow',          country: 'RU', lat:  55.75, lng:   37.62, tz:  3 },
  { name: 'Saint Petersburg',country: 'RU', lat:  59.93, lng:   30.32, tz:  3 },
  { name: 'Almaty',          country: 'KZ', lat:  43.24, lng:   76.89, tz:  6 },

  // Middle East & Africa
  { name: 'Istanbul',        country: 'TR', lat:  41.01, lng:   28.95, tz:  3 },
  { name: 'Cairo',           country: 'EG', lat:  30.04, lng:   31.24, tz:  2 },
  { name: 'Dubai',           country: 'AE', lat:  25.20, lng:   55.27, tz:  4 },
  { name: 'Tel Aviv',        country: 'IL', lat:  32.09, lng:   34.79, tz:  2 },
  { name: 'Riyadh',          country: 'SA', lat:  24.69, lng:   46.72, tz:  3 },
  { name: 'Tehran',          country: 'IR', lat:  35.69, lng:   51.39, tz:  3 },
  { name: 'Nairobi',         country: 'KE', lat:  -1.29, lng:   36.82, tz:  3 },
  { name: 'Lagos',           country: 'NG', lat:   6.52, lng:    3.38, tz:  1 },
  { name: 'Johannesburg',    country: 'ZA', lat: -26.20, lng:   28.04, tz:  2 },
  { name: 'Casablanca',      country: 'MA', lat:  33.59, lng:   -7.62, tz:  0 },
  { name: 'Addis Ababa',     country: 'ET', lat:   9.03, lng:   38.74, tz:  3 },

  // South & Southeast Asia
  { name: 'Mumbai',          country: 'IN', lat:  19.08, lng:   72.88, tz:  5 },
  { name: 'Delhi',           country: 'IN', lat:  28.66, lng:   77.23, tz:  5 },
  { name: 'Bangalore',       country: 'IN', lat:  12.97, lng:   77.59, tz:  5 },
  { name: 'Kolkata',         country: 'IN', lat:  22.57, lng:   88.36, tz:  5 },
  { name: 'Karachi',         country: 'PK', lat:  24.86, lng:   67.01, tz:  5 },
  { name: 'Dhaka',           country: 'BD', lat:  23.72, lng:   90.41, tz:  6 },
  { name: 'Bangkok',         country: 'TH', lat:  13.75, lng:  100.52, tz:  7 },
  { name: 'Jakarta',         country: 'ID', lat:  -6.21, lng:  106.85, tz:  7 },
  { name: 'Singapore',       country: 'SG', lat:   1.35, lng:  103.82, tz:  8 },
  { name: 'Kuala Lumpur',    country: 'MY', lat:   3.14, lng:  101.69, tz:  8 },
  { name: 'Manila',          country: 'PH', lat:  14.60, lng:  120.98, tz:  8 },
  { name: 'Ho Chi Minh City',country: 'VN', lat:  10.82, lng:  106.63, tz:  7 },

  // East Asia
  { name: 'Tokyo',           country: 'JP', lat:  35.69, lng:  139.69, tz:  9 },
  { name: 'Osaka',           country: 'JP', lat:  34.69, lng:  135.50, tz:  9 },
  { name: 'Beijing',         country: 'CN', lat:  39.91, lng:  116.39, tz:  8 },
  { name: 'Shanghai',        country: 'CN', lat:  31.23, lng:  121.47, tz:  8 },
  { name: 'Hong Kong',       country: 'HK', lat:  22.32, lng:  114.17, tz:  8 },
  { name: 'Seoul',           country: 'KR', lat:  37.57, lng:  126.98, tz:  9 },
  { name: 'Taipei',          country: 'TW', lat:  25.03, lng:  121.57, tz:  8 },

  // Oceania
  { name: 'Sydney',          country: 'AU', lat: -33.87, lng:  151.21, tz: 10 },
  { name: 'Melbourne',       country: 'AU', lat: -37.81, lng:  144.96, tz: 10 },
  { name: 'Brisbane',        country: 'AU', lat: -27.47, lng:  153.03, tz: 10 },
  { name: 'Auckland',        country: 'NZ', lat: -36.87, lng:  174.77, tz: 12 },
]

export function searchCities(query) {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return CITIES.filter(c =>
    c.name.toLowerCase().startsWith(q) ||
    c.name.toLowerCase().includes(' ' + q) ||
    c.country.toLowerCase() === q
  ).slice(0, 7)
}
