import { TILE } from './constants.jsx'

export function tileAt(map, px, py) {
  const c = Math.floor(px / TILE)
  const r = Math.floor(py / TILE)
  if (r < 0 || r >= map.length || c < 0 || c >= (map[0]?.length ?? 0)) return 1
  return map[r][c]
}

export function solidAt(map, px, py) {
  const t = tileAt(map, px, py)
  // 1=wall, 3=table, 4=mirror, 5=void gap — 6=door opening (passable)
  return t === 1 || t === 3 || t === 4 || t === 5
}

/** Mutates player; returns the new facing string (or null if unchanged). */
export function movePlayer(player, map, dx, dy, dt, speed) {
  const margin = 2
  const step   = speed * dt
  const nx     = player.x + dx * step
  const ny     = player.y + dy * step
  const L      = nx + margin
  const R      = nx + player.w - margin - 1
  const T      = ny + margin
  const B      = ny + player.h - margin - 1

  if (dx !== 0) {
    const checkX = dx > 0 ? R : L
    if (!solidAt(map, checkX, T) && !solidAt(map, checkX, B)) {
      player.x = nx
    }
  }
  if (dy !== 0) {
    const checkY = dy > 0 ? B : T
    if (!solidAt(map, L, checkY) && !solidAt(map, R, checkY)) {
      player.y = ny
    }
  }
}
