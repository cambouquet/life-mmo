// Aspect detection — classical five aspects with standard orbs

export const ASPECT_DEFS = [
  { name: 'Conjunction', symbol: '☌', angle: 0,   orb: 8,  nature: 'intense'    },
  { name: 'Sextile',     symbol: '⚹', angle: 60,  orb: 5,  nature: 'harmonious' },
  { name: 'Square',      symbol: '□', angle: 90,  orb: 7,  nature: 'tense'      },
  { name: 'Trine',       symbol: '△', angle: 120, orb: 8,  nature: 'flowing'    },
  { name: 'Opposition',  symbol: '☍', angle: 180, orb: 8,  nature: 'polarizing' },
]

function separation(a, b) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

// Aspects within a single chart (sky-only reading)
export function findAspects(positions) {
  const bodies  = Object.entries(positions)
  const results = []

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const [nameA, lonA] = bodies[i]
      const [nameB, lonB] = bodies[j]
      const angle = separation(lonA, lonB)

      for (const def of ASPECT_DEFS) {
        const orb = Math.abs(angle - def.angle)
        if (orb <= def.orb) {
          results.push({
            bodyA:     nameA,
            bodyB:     nameB,
            aspect:    def,
            orb:       orb,
            exactness: 1 - orb / def.orb,
          })
        }
      }
    }
  }

  results.sort((a, b) => b.exactness - a.exactness)
  return results
}

// Transit planets aspecting natal planets (personal reading)
// Returns { transit: planetName, natal: planetName, aspect, orb, exactness }
export function findTransitToNatal(transits, natal) {
  const results = []

  for (const [tName, tLon] of Object.entries(transits)) {
    for (const [nName, nLon] of Object.entries(natal)) {
      const angle = separation(tLon, nLon)

      for (const def of ASPECT_DEFS) {
        const orb = Math.abs(angle - def.angle)
        if (orb <= def.orb) {
          results.push({
            transit:   tName,
            natal:     nName,
            aspect:    def,
            orb,
            exactness: 1 - orb / def.orb,
          })
        }
      }
    }
  }

  results.sort((a, b) => b.exactness - a.exactness)
  return results
}
