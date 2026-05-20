export function createMirrorVisitCallbacks(gameRef, recorder, setShowEditor, setEditorPage, setCharColors) {
  return {
    getPlayerPos: () => gameRef.current?.playerPos() ?? { x: 0, y: 0 },
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
    onColorChange: (key, value) => {
      console.action(`🎨 Color changed — ${key}: ${value}`)
      setCharColors(prev => {
        const next = { ...prev, [key]: value }
        recorder.updateOverlay({ charColors: next })
        return next
      })
    },
    onComplete: () => {
      console.action('✓ Scenario complete — converting in 1.5s')
      setTimeout(() => {
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
        recorder.stop(`mirror-visit_${ts}.mp4`)
      }, 1500)
    },
  }
}

export function createGateRunCallbacks(gameRef, recorder, setShowEditor, setEditorPage, setCharColors) {
  return {
    getPlayerPos: () => gameRef.current?.playerPos() ?? { x: 0, y: 0 },
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
    onColorChange: (key, value) => {
      console.action(`🎨 Color changed — ${key}: ${value}`)
      setCharColors(prev => {
        const next = { ...prev, [key]: value }
        recorder.updateOverlay({ charColors: next })
        return next
      })
    },
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
    onComplete: () => {
      console.action('✓ Scenario complete — converting in 1.5s')
      setTimeout(() => {
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
        recorder.stop(`gate-run_${ts}.mp4`)
      }, 1500)
    },
  }
}
