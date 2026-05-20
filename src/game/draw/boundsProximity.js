import { PROX_RADIUS } from './boundsConstants.js'

export function calculateProximity(pcx, pcy, rx, ry, rw, rh) {
  const insideRoom = pcx >= rx && pcx <= rx + rw && pcy >= ry && pcy <= ry + rh
  const distTop    = pcy - ry
  const distBottom = (ry + rh) - pcy
  const distLeft   = pcx - rx
  const distRight  = (rx + rw) - pcx

  const prox = (dist) => {
    if (!insideRoom) return 0
    return Math.max(0, 1 - dist / PROX_RADIUS)
  }

  return {
    pTop: prox(distTop),
    pBottom: prox(distBottom),
    pLeft: prox(distLeft),
    pRight: prox(distRight)
  }
}
