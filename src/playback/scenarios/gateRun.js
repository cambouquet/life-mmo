// ── Gate Run Scenario ─────────────────────────────────────────────────────────
// Geometry (world pixels, TILE=16):
//   Player spawn:  x=119, y=112  (pcStartX = MIRROR_CX-9 = 119, pcStartR=7 → y=112)
//   Mirror 1:      mirrorC=7, mirrorR=1  → solid tiles rows 1-2 (y=16..47), cols 7-8 (x=112..143)
//                  MIRROR_CX=128, MIRROR_CY=32 (center of the 2×2 tile block)
//   Closest floor below mirror: row 3 (y=48), so approach y ≈ 50
//   Door:          DOOR_C=15, DOOR_R=6, DOOR_H=2
//                  DOOR_WX = 15*16+8 = 248, DOOR_WY = (6+1)*16 = 112
//   Mid-room starts at MID_START=20, so x=320 is past the gap

// Stand one row below the mirror solid tiles — row 3 starts at y=48
const MIRROR_APPROACH_X = 119   // same column as spawn, body center lands on mirror center
const MIRROR_APPROACH_Y = 50    // row 3 (y=48–63), just under the mirror

// Door / gate positions
const DOOR_APPROACH_X = 215  // left of the door wall (col 13–14 area)
const DOOR_Y          = 104  // DOOR_R=6 → y=96; center of 2-tile door = row 6.5 → y=104

// Past the void gap, into the mid-room corridor
const THROUGH_GATE_X  = 345
const THROUGH_GATE_Y  = DOOR_Y

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const DEMO_NAMES = ['Lyra', 'Oryn', 'Sael', 'Vex', 'Nira', 'Caen', 'Thea', 'Rook']

function randomName() {
  return DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)]
}

// ── Scenario ──────────────────────────────────────────────────────────────────

export async function gateRun(engine) {
  const palette = randomPalette()
  const name    = randomName()

  await engine.wait(300)

  // 1. Walk to the mirror
  // Move up toward mirror from spawn (x=119, y=112) — go directly north then align
  await engine.moveTo(MIRROR_APPROACH_X, MIRROR_APPROACH_Y, 8)
  await engine.face('up')
  await engine.wait(600)

  // 2. Open mirror
  await engine.openMirror()

  // 3. Enter a name
  await engine.setName(name)
  await engine.wait(500)

  // 4. Click random colors
  await engine.changeColor('hair',   palette.hair)
  await engine.changeColor('outfit', palette.outfit)
  await engine.changeColor('eyes',   palette.eyes)
  await engine.wait(700)

  // 5. Save & exit mirror — wait long enough for React state to propagate
  //    (doorUnlockedRef won't be true until nameSetRef + colorsSetRef are both true)
  await engine.saveMirror(palette, name)
  await engine.wait(800)

  // 6. Walk toward the gate (right wall of left room)
  await engine.moveTo(DOOR_APPROACH_X, DOOR_Y, 10)
  await engine.face('right')
  await engine.wait(600)

  // 7. Cross the gates — walk into the corridor and through
  await engine.moveTo(THROUGH_GATE_X, THROUGH_GATE_Y, 10)
  await engine.wait(800)
}
