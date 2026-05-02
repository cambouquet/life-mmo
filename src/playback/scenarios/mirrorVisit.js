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

// Position 1: Stepped back to admire the full reflection (Looking up)
const ADMIRE_X    = 416
const ADMIRE_Y    = 370

// Position 2: Extremely close to the glass (touching the wall)
const CLOSE_X     = 416 
const CLOSE_Y     = 340 

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

  // 1. Initial Approach: Walk to the "admire" position first
  // We MUST step down (y=348+) to clear the solid mirror tiles at y=320-335
  await engine.wait(300)
  const start = engine.getPlayerPos()
  
  // Step 1: Move diagonally to below the mirror's x-center
  // Using moderate threshold (10) for reliability
  await engine.moveTo(ADMIRE_X, start.y + 40, 10) 
  // Step 2: Move up slightly to the admire spot
  await engine.moveTo(ADMIRE_X, ADMIRE_Y, 10)
  await engine.face('up')
  await engine.wait(800)

  // 2. Walk close to the mirror
  await engine.moveTo(CLOSE_X, CLOSE_Y, 12)
  await engine.face('up')
  await engine.wait(500)

  // 3. Open editor
  await engine.openMirror()
  await engine.wait(600)

  // 4. Change colors
  await engine.changeColor('hair',   palette.hair)
  await engine.changeColor('outfit', palette.outfit)
  await engine.changeColor('eyes',   palette.eyes)
  await engine.wait(800)

  // 5. Scroll to chart
  await engine.scrollEditor(1)
  await engine.wait(1500)

  // 6. Scroll back and close
  await engine.scrollEditor(0)
  await engine.wait(600)
  await engine.closeMirror()
  await engine.wait(400)

  // 7. Final step back to admire
  await engine.moveTo(ADMIRE_X, ADMIRE_Y, 12)
  await engine.face('up')
  await engine.wait(1500)
}
