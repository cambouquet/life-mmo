// ── Mirror Visit Scenario ─────────────────────────────────────────────────────
// Geometry (verified):
//   Player start: (480, 320) — tile (30, 20)
//   Mirror solid tiles: row 20 (y=320–335), cols 25–26 (x=400–431)
//   MIRROR_CX=416, MIRROR_CY=320
//
// APPROACH: walk left from player start (480,320) toward mirror, stop at x=450
//   Mirror solid cols end at x=431. x=450, y=320 → dist to centre (416,320) = 34px
//   Just outside 32px trigger but close — use threshold=20 so we stop at ~450 which is fine.
//   Actually use x=450: dist = 34px. 450 is safe from collision (ends at 431).
//   We just need to be near the trigger (32px). 450 with threshold 15 is good.

const APPROACH_X = 450
const APPROACH_Y = 328 // Align closer to the vertical center of the mirror

const FRONT_X    = 416 // Exact horizontal center of the mirror
const FRONT_Y    = 346 // Step back more clearly to align with the mirror floor line

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

  // 1. Walk right-side of mirror (same row, stops before solid wall)
  await engine.wait(600)
  await engine.moveTo(APPROACH_X, APPROACH_Y, 15) // Relaxed threshold
  await engine.wait(700)

  // 2. Open editor
  await engine.openMirror()
  await engine.wait(900)

  // 3. Change colors one by one
  await engine.changeColor('hair',   palette.hair)
  await engine.changeColor('outfit', palette.outfit)
  await engine.changeColor('eyes',   palette.eyes)
  await engine.wait(1000)

  // 4. Close editor
  await engine.closeMirror()
  await engine.wait(400)

  // 5. Move directly in front of mirror (below it) to admire the reflection
  await engine.moveTo(FRONT_X, FRONT_Y, 10) // Relaxed threshold
  await engine.face('up')
  await engine.wait(2800)
}
