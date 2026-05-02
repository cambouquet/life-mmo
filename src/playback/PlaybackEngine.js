import { simulateKey } from '../game/input.jsx'

function jitter(base, spread = 0.08) {
  return base + (Math.random() * 2 - 1) * spread * base
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function releaseAll() {
  for (const k of ['KeyA', 'KeyD', 'KeyW', 'KeyS', 'Space']) simulateKey(k, false)
}

async function walkTo(getPos, targetX, targetY, threshold, abortRef) {
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

    // Stuck detection: if we haven't moved significantly in 200ms
    if (Math.abs(x - lastX) < 1 && Math.abs(y - lastY) < 1) {
      stuckCounter++
    } else {
      stuckCounter = 0
    }
    lastX = x
    lastY = y

    if (stuckCounter > 8) { // Stuck for ~400ms
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

export class PlaybackEngine {
  constructor({ getPlayerPos, onOpenEditor, onCloseEditor, onColorChange, onScrollEditor, onComplete }) {
    this._getPos        = getPlayerPos
    this._openEditor    = onOpenEditor
    this._closeEditor   = onCloseEditor
    this._colorChange   = onColorChange
    this._scrollEditor  = onScrollEditor
    this._onComplete    = onComplete
    this._running       = false
    this._abortRef      = { current: false }
  }

  abort() {
    this._abortRef.current = true
    releaseAll()
  }

  async run(scenario) {
    if (this._running) return
    this._running = true
    this._abortRef.current = false
    try {
      await scenario(this)
    } finally {
      this._running = false
      releaseAll()
      if (!this._abortRef.current) this._onComplete?.()
    }
  }

  async moveTo(x, y, threshold = 10) {
    if (this._abortRef.current) return
    console.action(`Moving to (${x}, ${y})`)
    await walkTo(this._getPos, x, y, threshold, this._abortRef)
    if (!this._abortRef.current) await sleep(jitter(120, 0.3))
  }

  async wait(ms) {
    if (this._abortRef.current) return
    console.action(`Waiting ${ms}ms`)
    await sleep(jitter(ms, 0.05))
  }

  async openMirror() {
    if (this._abortRef.current) return
    console.action("Opening Mirror")
    this._openEditor()
    await sleep(jitter(600, 0.15))
  }

  async closeMirror() {
    if (this._abortRef.current) return
    console.action("Closing Mirror")
    this._closeEditor()
    await sleep(jitter(400, 0.15))
  }

  async scrollEditor(pageIndex) {
    if (this._abortRef.current) return
    console.action(`Scrolling editor to page ${pageIndex}`)
    this._scrollEditor?.(pageIndex)
    await sleep(jitter(1200, 0.2))
  }

  async changeColor(colorKey, hexValue) {
    if (this._abortRef.current) return
    console.action(`Changing ${colorKey} to ${hexValue}`)
    await sleep(jitter(180, 0.3))
    this._colorChange(colorKey, hexValue)
    await sleep(jitter(80, 0.3))
  }

  async face(direction) {
    if (this._abortRef.current) return
    const map = { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
    const code = map[direction]
    if (!code) return
    simulateKey(code, true)
    await sleep(jitter(60, 0.3))
    simulateKey(code, false)
    await sleep(jitter(80, 0.3))
  }
}
