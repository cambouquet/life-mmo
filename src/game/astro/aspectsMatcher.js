import { ASPECT_DEFS } from './aspects.js'

export function separation(a, b) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

export function findMatchingAspects(angle) {
  const results = []
  for (const def of ASPECT_DEFS) {
    const orb = Math.abs(angle - def.angle)
    if (orb <= def.orb) {
      results.push({ aspect: def, orb, exactness: 1 - orb / def.orb })
    }
  }
  return results
}
