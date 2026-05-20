import { useCallback } from 'react'
import { PlaybackEngine } from '../playback/PlaybackEngine.js'
import { mirrorVisit } from '../playback/scenarios/mirrorVisit.js'
import { gateRun } from '../playback/scenarios/gateRun.js'
import { createMirrorVisitCallbacks, createGateRunCallbacks } from '../playback/scenarioCallbacks.js'

async function getDisplayStream() {
  try {
    return await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: false })
  } catch (err) {
    console.error('[record] screen capture denied:', err?.message)
    return null
  }
}

export function useRecordingScenarios(recorder, gameRef, engineRef, setShowEditor, setEditorPage, setCharColors) {
  const handleRecord = useCallback(async () => {
    console.action('▶ Record started — scenario: mirrorVisit')
    const stream = await getDisplayStream()
    if (!stream || !recorder.start(stream)) return

    const engine = new PlaybackEngine(createMirrorVisitCallbacks(gameRef, recorder, setShowEditor, setEditorPage, setCharColors))
    engineRef.current = engine
    engine.run(mirrorVisit)
  }, [recorder, gameRef, engineRef, setShowEditor, setEditorPage, setCharColors])

  const handleRecordGate = useCallback(async () => {
    console.action('▶ Record started — scenario: gateRun')
    const stream = await getDisplayStream()
    if (!stream || !recorder.start(stream)) return

    const engine = new PlaybackEngine(createGateRunCallbacks(gameRef, recorder, setShowEditor, setEditorPage, setCharColors))
    engineRef.current = engine
    engine.run(gateRun)
  }, [recorder, gameRef, engineRef, setShowEditor, setEditorPage, setCharColors])

  const handleStop = useCallback(() => {
    console.action('■ Recording stopped by user')
    engineRef.current?.abort()
    engineRef.current = null
    recorder.cancel()
    setShowEditor(false)
  }, [recorder, engineRef, setShowEditor])

  return { handleRecord, handleRecordGate, handleStop }
}
