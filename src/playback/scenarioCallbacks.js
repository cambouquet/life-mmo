import { createCommonEditorCallbacks, createCommonColorCallback, createCommonCompleteCallback } from './scenarioCommonCallbacks.js'

export function createMirrorVisitCallbacks(gameRef, recorder, setShowEditor, setEditorPage, setCharColors) {
  const common = createCommonEditorCallbacks(setShowEditor, setEditorPage, recorder)
  return {
    getPlayerPos: () => gameRef.current?.playerPos() ?? { x: 0, y: 0 },
    ...common,
    onColorChange: createCommonColorCallback(setCharColors, recorder),
    onComplete: createCommonCompleteCallback(recorder, 'mirror-visit'),
  }
}

export function createGateRunCallbacks(gameRef, recorder, setShowEditor, setEditorPage, setCharColors) {
  const common = createCommonEditorCallbacks(setShowEditor, setEditorPage, recorder)
  return {
    getPlayerPos: () => gameRef.current?.playerPos() ?? { x: 0, y: 0 },
    ...common,
    onColorChange: createCommonColorCallback(setCharColors, recorder),
    onSetName: (name) => {
      console.action(`✏ Name set — ${name}`)
      try { localStorage.setItem('life-mmo-name', JSON.stringify(name)) } catch {}
    },
    onSaveMirror: (colors, name) => {
      console.action('💾 Mirror saved')
      setCharColors(prev => {
        const merged = { ...prev, ...colors }
        try { localStorage.setItem('life-mmo-colors-v3', JSON.stringify(merged)) } catch {}
        recorder.updateOverlay({ charColors: merged, showEditor: false })
        return merged
      })
      try { localStorage.setItem('life-mmo-name', JSON.stringify(name)) } catch {}
      setShowEditor(false)
      setEditorPage(0)
    },
    onComplete: createCommonCompleteCallback(recorder, 'gate-run'),
  }
}
