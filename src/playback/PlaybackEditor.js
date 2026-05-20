import { jitter, sleep } from './playbackUtils.js'

export class PlaybackEditor {
  constructor(onOpenEditor, onCloseEditor, onScrollEditor, onColorChange, onSetName, onSaveMirror, abortRef) {
    this._openEditor = onOpenEditor
    this._closeEditor = onCloseEditor
    this._scrollEditor = onScrollEditor
    this._colorChange = onColorChange
    this._setName = onSetName
    this._saveMirror = onSaveMirror
    this._abortRef = abortRef
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

  async setName(name) {
    if (this._abortRef.current) return
    console.action(`Setting name to "${name}"`)
    this._setName?.(name)
    await sleep(jitter(300, 0.2))
  }

  async saveMirror(colors, name) {
    if (this._abortRef.current) return
    console.action('Saving mirror (name + colors) and closing')
    this._saveMirror?.(colors, name)
    await sleep(jitter(500, 0.15))
  }
}
