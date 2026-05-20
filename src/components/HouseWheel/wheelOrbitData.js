export const ORBITS = [
  { id: 'Sun',           r: 30 },
  { id: 'Moon',          r: 37 },
  { id: 'Mercury',       r: 44 },
  { id: 'Venus',         r: 51 },
  { id: 'Mars',          r: 58 },
  { id: 'NorthNode',     r: 65 },
  { id: 'Jupiter',       r: 72 },
  { id: 'Saturn',        r: 79 },
  { id: 'Chiron',        r: 86 },
  { id: 'Uranus',        r: 93 },
  { id: 'Neptune',       r: 100 },
  { id: 'Pluto',         r: 107 },
  { id: 'Lilith',        r: 114 },
  { id: 'PartOfFortune', r: 121 },
]

export const PLANET_RINGS = ORBITS.reduce((acc, o) => ({ ...acc, [o.id]: o.r }), {})
