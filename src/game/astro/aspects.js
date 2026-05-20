export const ASPECT_DEFS = [
  { name: 'Conjunction', symbol: '☌', angle: 0,   orb: 8,  nature: 'intense'    },
  { name: 'Sextile',     symbol: '⚹', angle: 60,  orb: 5,  nature: 'harmonious' },
  { name: 'Square',      symbol: '□', angle: 90,  orb: 7,  nature: 'tense'      },
  { name: 'Trine',       symbol: '△', angle: 120, orb: 8,  nature: 'flowing'    },
  { name: 'Opposition',  symbol: '☍', angle: 180, orb: 8,  nature: 'polarizing' },
]

import { separation, findMatchingAspects } from './aspectsMatcher.js'

export function findAspects(positions) {
  const bodies  = Object.entries(positions)
  const results = []

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const [nameA, lonA] = bodies[i]
      const [nameB, lonB] = bodies[j]
      const angle = separation(lonA, lonB)
      const matches = findMatchingAspects(angle)
      results.push(...matches.map(m => ({ bodyA: nameA, bodyB: nameB, ...m })))
    }
  }

  results.sort((a, b) => b.exactness - a.exactness)
  return results
}

export function findTransitToNatal(transits, natal) {
  const results = []

  for (const [tName, tLon] of Object.entries(transits)) {
    for (const [nName, nLon] of Object.entries(natal)) {
      const angle = separation(tLon, nLon)
      const matches = findMatchingAspects(angle)
      results.push(...matches.map(m => ({ transit: tName, natal: nName, ...m })))
    }
  }

  results.sort((a, b) => b.exactness - a.exactness)
  return results
}
