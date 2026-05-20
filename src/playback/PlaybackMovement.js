import { jitter, sleep, walkTo } from './playbackUtils.js'

export class PlaybackMovement {
  constructor(getPlayerPos, abortRef) {
    this._getPos = getPlayerPos
    this._abortRef = abortRef
  }

  getPlayerPos() {
    return this._getPos()
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

  async face(direction) {
    if (this._abortRef.current) return
    const map = { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
    const code = map[direction]
    if (!code) return
    await sleep(jitter(60, 0.3))
    await sleep(jitter(80, 0.3))
  }
}
