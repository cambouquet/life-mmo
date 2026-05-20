import { simulateKey } from '../game/input.jsx'

export function jitter(base, spread = 0.08) {
  return base + (Math.random() * 2 - 1) * spread * base
}

export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export function releaseAll() {
  for (const k of ['KeyA', 'KeyD', 'KeyW', 'KeyS', 'Space']) simulateKey(k, false)
}

export async function walkTo(getPos, targetX, targetY, threshold, abortRef) {
  const TICK = 50
  let stuckCounter = 0
  let lastX = 0
  let lastY = 0

  while (true) {
    if (abortRef.current) {
      releaseAll()
      return
    }

    const { x, y } = getPos()
    const dx = targetX - x
    const dy = targetY - y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist <= threshold) {
      releaseAll()
      return
    }

    if (Math.abs(x - lastX) < 1 && Math.abs(y - lastY) < 1) {
      stuckCounter++
    } else {
      stuckCounter = 0
    }
    lastX = x
    lastY = y

    if (stuckCounter > 8) {
      console.warn("Automation stuck, stopping movement.")
      releaseAll()
      return
    }

    const moveH = Math.abs(dx) > threshold / 1.5
    const moveV = Math.abs(dy) > threshold / 1.5

    simulateKey('KeyA', moveH && dx < 0)
    simulateKey('KeyD', moveH && dx > 0)
    simulateKey('KeyW', moveV && dy < 0)
    simulateKey('KeyS', moveV && dy > 0)

    await sleep(TICK)
  }
}
