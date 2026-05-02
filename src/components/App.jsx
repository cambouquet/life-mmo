import { useState, useCallback, useRef } from 'react'
import { useViewportScale }  from '../hooks/useViewportScale.jsx'
import HUD                   from './HUD/HUD.jsx'
import Game                  from './Game/Game.jsx'
import HoroscopeModal        from './HoroscopeModal/HoroscopeModal.jsx'
import DialogModal           from './DialogModal/DialogModal.jsx'
import GuidanceVoice         from './GuidanceVoice/GuidanceVoice.jsx'
import CharacterEditor       from './CharacterEditor/CharacterEditor.jsx'
import RecordButton          from './RecordButton/RecordButton.jsx'
import VideoGallery          from './VideoGallery/VideoGallery.jsx'
import DebugConsole          from './HUD/DebugConsole.jsx'
import { useRecorder }       from '../playback/useRecorder.js'
import { PlaybackEngine }    from '../playback/PlaybackEngine.js'
import { mirrorVisit }       from '../playback/scenarios/mirrorVisit.js'

const LS_COLORS = 'life-mmo-colors-v3'
const LS_BIRTH  = 'life-mmo-birth'
const LS_NAME   = 'life-mmo-name'

const DEFAULT_COLORS = { hair: '#ffffff', skin: '#ffffff', eyes: '#ffffff', outfit: '#ffffff', stick: '#ffffff' }
const DEFAULT_BIRTH = {
  date: '1988-01-27',
  time: '03:55',
  city: { name: 'Paris XIII', country: 'FR', lat: 48.83, lng: 2.36, tz: 1 }
}

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

export default function App() {
  const [facing,        setFacing]        = useState('down')
  const [moving,        setMoving]        = useState(false)
  const [logEntries,    setLogEntries]    = useState([
    '<em>System:</em> Move with WASD.',
    'The torches flicker in the dark.',
    '<em>?</em> enters the dungeon.',
  ])
  const [guidance,      setGuidance]      = useState(null)
  const [showDialog,    setShowDialog]    = useState(false)
  const [showHoroscope, setShowHoroscope] = useState(false)
  const [showEditor,    setShowEditor]    = useState(false)
  const [editorPage,    setEditorPage]    = useState(0)
  const [editorLimited, setEditorLimited] = useState(false)
  const [showGallery,   setShowGallery]   = useState(false)
  const [recordings,    setRecordings]    = useState([])
  const [charColors,    setCharColors]    = useState(() => load(LS_COLORS, DEFAULT_COLORS))
  const [birthData,     setBirthData]     = useState(() => load(LS_BIRTH,  DEFAULT_BIRTH))
  const [charName,      setCharName]      = useState(() => load(LS_NAME,   null))

  const wrapRef        = useViewportScale()
  const gameRef        = useRef(null)
  const uiOverlayRef   = useRef(null)
  const engineRef      = useRef(null)
  const playerStateRef = useRef(null)
  const recorder      = useRecorder({
    onReady: (blob, filename) => {
      const url = URL.createObjectURL(blob)
      setRecordings(prev => [...prev, { id: Date.now(), url, blob, filename, ts: Date.now() }])
      setShowGallery(true)
    }
  })
  const handleStateChange = useCallback(({ facing, moving, log, guidance }) => {
    setFacing(facing)
    setMoving(moving)
    setLogEntries(log)
    setGuidance(guidance ?? null)
  }, [])

  const handleInteract = useCallback((target) => {
    if (showHoroscope) setShowHoroscope(false)
    else if (showEditor) {
      setShowEditor(false)
      setEditorPage(0)
    }
    else if (target === 'mirror1') {
      console.action('Opening Mirror (limited)')
      setEditorLimited(true)
      setShowEditor(true)
      setEditorPage(0)
    }
    else if (target === 'mirror2') {
      console.action('Opening Mirror')
      setEditorLimited(false)
      setShowEditor(true)
      setEditorPage(0)
    }
    else if (target === 'npc' || !showDialog) setShowDialog(true)
  }, [showHoroscope, showDialog, showEditor])

  const handleRecord = useCallback(async () => {
    let stream
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: false })
    } catch (err) {
      console.error('[record] screen capture denied:', err?.message)
      return
    }
    console.action('▶ Record started — scenario: mirrorVisit')
    if (!recorder.start(stream)) return

    const engine = new PlaybackEngine({
      getPlayerPos:  () => gameRef.current?.playerPos() ?? { x: 0, y: 0 },
      onOpenEditor:  () => { 
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
      onScrollEditor: (p) => {
        setEditorPage(p)
      },
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
    })

    engineRef.current = engine
    engine.run(mirrorVisit)
  }, [recorder, charColors, birthData])

  const handleStop = useCallback(() => {
    console.action('■ Recording stopped by user')
    engineRef.current?.abort()
    engineRef.current = null
    recorder.cancel()
    setShowEditor(false)
  }, [recorder])

  return (
    <div className="game-wrap" ref={wrapRef}>
      <HUD facing={facing} moving={moving} logEntries={logEntries} charColors={charColors} />
      {!showEditor && (
        <div className="canvas-wrap">
        <Game
          ref={gameRef}
          onStateChange={handleStateChange}
          onInteract={handleInteract}
          paused={showDialog || showHoroscope}
          charColors={charColors}
          playerStateRef={playerStateRef}
        />
        <div className="ui-overlay" ref={uiOverlayRef}>
          {!showDialog && !showHoroscope && <GuidanceVoice text={guidance} />}

          {showDialog && (
            <DialogModal
              onClose={() => setShowDialog(false)}
              onHoroscope={() => { setShowDialog(false); setShowHoroscope(true) }}
            />
          )}

          {showHoroscope && <HoroscopeModal birthData={birthData} onClose={() => setShowHoroscope(false)} />}
        </div>
        </div>
      )}

      {showEditor && (
        <CharacterEditor
          initialColors={charColors}
          initialBirthData={birthData}
          initialName={charName}
          scrollPage={editorPage}
          limited={editorLimited}
          onClose={() => {
            console.action('Closing Mirror')
            setShowEditor(false)
            setEditorPage(0)
            setEditorLimited(false)
          }}
          onChange={(next) => {
            const keys = Object.keys(next)
            const changed = keys.find(k => next[k] !== charColors[k])
            if (changed) console.action(`Changing ${changed} to ${next[changed]}`)
            setCharColors(next)
          }}
          onSave={(colors, data, name) => {
            console.action('Saving character data')
            setCharColors(colors)
            setBirthData(data)
            if (name != null) {
              setCharName(name)
              try { localStorage.setItem(LS_NAME, JSON.stringify(name)) } catch {}
            }
            try { localStorage.setItem(LS_COLORS, JSON.stringify(colors)) } catch {}
            try { if (data) localStorage.setItem(LS_BIRTH, JSON.stringify(data)) } catch {}
            setShowEditor(false)
            setEditorPage(0)
            setEditorLimited(false)
          }}
        />
      )}
      <div className="hint">WASD to move &nbsp;·&nbsp; SPACE to jump &nbsp;·&nbsp; SHIFT to interact</div>
      <DebugConsole />
      <RecordButton
        status={recorder.status}
        progress={recorder.progress}
        recordingCount={recordings.length}
        onRecord={handleRecord}
        onStop={handleStop}
        onOpenGallery={() => setShowGallery(true)}
      />
      {showGallery && (
        <VideoGallery
          videos={recordings}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  )
}
