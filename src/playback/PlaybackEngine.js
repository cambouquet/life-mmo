import { releaseAll } from './playbackUtils.js'
import { PlaybackMovement } from './PlaybackMovement.js'
import { PlaybackEditor } from './PlaybackEditor.js'

export class PlaybackEngine {
  constructor({ getPlayerPos, onOpenEditor, onCloseEditor, onColorChange, onScrollEditor, onSetName, onSaveMirror, onComplete }) {
    this._abortRef = { current: false }
    this._running = false
    this._onComplete = onComplete
    this.movement = new PlaybackMovement(getPlayerPos, this._abortRef)
    this.editor = new PlaybackEditor(onOpenEditor, onCloseEditor, onScrollEditor, onColorChange, onSetName, onSaveMirror, this._abortRef)
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

  getPlayerPos() {
    return this.movement.getPlayerPos()
  }

  async moveTo(x, y, threshold = 10) {
    return this.movement.moveTo(x, y, threshold)
  }

  async wait(ms) {
    return this.movement.wait(ms)
  }

  async openMirror() {
    return this.editor.openMirror()
  }

  async closeMirror() {
    return this.editor.closeMirror()
  }

  async scrollEditor(pageIndex) {
    return this.editor.scrollEditor(pageIndex)
  }

  async changeColor(colorKey, hexValue) {
    return this.editor.changeColor(colorKey, hexValue)
  }

  async setName(name) {
    return this.editor.setName(name)
  }

  async saveMirror(colors, name) {
    return this.editor.saveMirror(colors, name)
  }

  async face(direction) {
    return this.movement.face(direction)
  }
}
