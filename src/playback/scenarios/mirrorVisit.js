// ── Mirror Visit Scenario ─────────────────────────────────────────────────────
// Geometry (verified):
//   Player start: (480, 320) — tile (30, 20)
//   Mirror solid tiles: row 20 (y=320–335), cols 25–26 (x=400–431)
//   MIRROR_CX=416, MIRROR_CY=320
//
// APPROACH: step down first (y=348) to clear solid row, then walk left to center x (416).
//   Moving diagonally from start hits the solid wall at y=320; two steps avoids this.

const STEP_DOWN_X = 480 // Stay at start x while stepping below solid tiles
const STEP_DOWN_Y = 336 // y=336 clears solid row (ends at y=335), closer to mirror

// Position 1: Extremely close to the glass (touching the wall)
const CLOSE_X     = 408 
const CLOSE_Y     = 326 

// Position 2: Stepped back to admire the full reflection
const ADMIRE_X    = 408
const ADMIRE_Y    = 358

// ── Random color helpers ──────────────────────────────────────────────────────

// Convert HSL to a 6-digit hex string (warrior renderer requires hex)
function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const val = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * val).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function randomPalette() {
  const h1 = Math.floor(Math.random() * 360)
  const h2 = (h1 + 120 + Math.floor(Math.random() * 60)) % 360
  const h3 = (h1 + 240 + Math.floor(Math.random() * 60)) % 360
  return {
    hair:   hslToHex(h1, 70 + Math.random() * 25, 40 + Math.random() * 20),
    outfit: hslToHex(h2, 55 + Math.random() * 30, 25 + Math.random() * 20),
    eyes:   hslToHex(h3, 80 + Math.random() * 15, 55 + Math.random() * 15),
  }
}

// ── Scenario ──────────────────────────────────────────────────────────────────

export async function mirrorVisit(engine) {
  const palette = randomPalette()

  // 1. Initial Approach: Walk right up to the glass
  await engine.wait(600)
  await engine.moveTo(STEP_DOWN_X, STEP_DOWN_Y, 10)
  await engine.moveTo(CLOSE_X, CLOSE_Y, 10)
  await engine.face('up')
  await engine.wait(900)

  // 2. Open editor while standing close
  await engine.openMirror()
  await engine.wait(1000)

  // 3. Change colors
  await engine.changeColor('hair',   palette.hair)
  await engine.changeColor('outfit', palette.outfit)
  await engine.changeColor('eyes',   palette.eyes)
  await engine.wait(1200)

  // 4. Close editor
  await engine.closeMirror()
  await engine.wait(600)

  // 5. Step back to admire the transformation
  await engine.moveTo(ADMIRE_X, ADMIRE_Y, 10)
  await engine.face('up')
  await engine.wait(3000)
}
