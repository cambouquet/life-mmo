export function createCommonEditorCallbacks(setShowEditor, setEditorPage, recorder) {
  return {
    onOpenEditor: () => {
      console.action('⬡ Mirror opened')
      setShowEditor(true)
      setEditorPage(0)
      recorder.updateOverlay({ showEditor: true })
    },
    onCloseEditor: () => {
      console.action('⬡ Mirror closed')
      setShowEditor(false)
      setEditorPage(0)
      recorder.updateOverlay({ showEditor: false })
    },
    onScrollEditor: (p) => setEditorPage(p),
  }
}

export function createCommonColorCallback(setCharColors, recorder) {
  return (key, value) => {
    console.action(`🎨 Color changed — ${key}: ${value}`)
    setCharColors(prev => {
      const next = { ...prev, [key]: value }
      recorder.updateOverlay({ charColors: next })
      return next
    })
  }
}

export function createCommonCompleteCallback(recorder, filename) {
  return () => {
    console.action('✓ Scenario complete — converting in 1.5s')
    setTimeout(() => {
      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      recorder.stop(`${filename}_${ts}.mp4`)
    }, 1500)
  }
}
