import { useState, useCallback, useRef } from 'react'
import { useViewportScale }  from '../hooks/useViewportScale.jsx'
import HUD                   from './HUD/HUD.jsx'
import Game                  from './Game/Game.jsx'
import HoroscopeModal        from './HoroscopeModal/HoroscopeModal.jsx'
import DialogModal           from './DialogModal/DialogModal.jsx'
import GuidanceVoice         from './GuidanceVoice/GuidanceVoice.jsx'
import CharacterEditor       from './CharacterEditor/CharacterEditor.jsx'
import RecordButton          from './RecordButton/RecordButton.jsx'
import DebugConsole          from './HUD/DebugConsole.jsx'
import { useRecorder }       from '../playback/useRecorder.js'
import { PlaybackEngine }    from '../playback/PlaybackEngine.js'
import { mirrorVisit }       from '../playback/scenarios/mirrorVisit.js'

const LS_COLORS = 'life-mmo-colors'
const LS_BIRTH  = 'life-mmo-birth'

const DEFAULT_COLORS = { hair: '#6030d0', skin: '#f8c898', eyes: '#8040e8', outfit: '#4a1090', stick: '#60a8ff' }
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
    '<em>Kami</em> enters the dungeon.',
  ])
  const [guidance,      setGuidance]      = useState(null)
  const [showDialog,    setShowDialog]    = useState(false)
  const [showHoroscope, setShowHoroscope] = useState(false)
  const [showEditor,    setShowEditor]    = useState(false)
  const [charColors,    setCharColors]    = useState(() => load(LS_COLORS, DEFAULT_COLORS))
  const [birthData,     setBirthData]     = useState(() => load(LS_BIRTH,  DEFAULT_BIRTH))

  const wrapRef       = useViewportScale()
  const gameRef       = useRef(null)
  const uiOverlayRef  = useRef(null)
  const engineRef     = useRef(null)
  const recorder      = useRecorder()
  const handleStateChange = useCallback(({ facing, moving, log, guidance }) => {
    setFacing(facing)
    setMoving(moving)
    setLogEntries(log)
    setGuidance(guidance ?? null)
  }, [])

  const handleInteract = useCallback((target) => {
    if (showHoroscope) setShowHoroscope(false)
    else if (showEditor) setShowEditor(false)
    else if (target === 'mirror') setShowEditor(true)
    else if (target === 'npc' || !showDialog) setShowDialog(true)
  }, [showHoroscope, showDialog, showEditor])

  const handleRecord = useCallback(async () => {
    console.action('▶ Record started — scenario: mirrorVisit')
    const canvas = gameRef.current?.canvas()
    if (!canvas) { console.error('handleRecord: canvas not found'); return }

    recorder.start(canvas, uiOverlayRef.current)

    const engine = new PlaybackEngine({
      getPlayerPos:  () => gameRef.current?.playerPos() ?? { x: 0, y: 0 },
      onOpenEditor:  () => { console.action('⬡ Mirror opened'); setShowEditor(true) },
      onCloseEditor: () => { console.action('⬡ Mirror closed'); setShowEditor(false) },
      onColorChange: (key, value) => {
        console.action(`🎨 Color changed — ${key}: ${value}`)
        setCharColors(prev => ({ ...prev, [key]: value }))
      },
      onComplete: () => {
        console.action('✓ Scenario complete — converting in 1.5s')
        setTimeout(() => recorder.stop('mirror-visit.mp4'), 1500)
      },
    })

    engineRef.current = engine
    engine.run(mirrorVisit)
  }, [recorder])

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
      <div className="canvas-wrap">
        <Game
          ref={gameRef}
          onStateChange={handleStateChange}
          onInteract={handleInteract}
          paused={showDialog || showHoroscope || showEditor}
          charColors={charColors}
        />
        <div className="ui-overlay" ref={uiOverlayRef}>
          {!showDialog && !showHoroscope && !showEditor && <GuidanceVoice text={guidance} />}

          {showEditor && (
            <CharacterEditor
              initialColors={charColors}
              initialBirthData={birthData}
              onClose={() => setShowEditor(false)}
              onChange={setCharColors}
              onSave={(colors, data) => {
                setCharColors(colors)
                setBirthData(data)
                try { localStorage.setItem(LS_COLORS, JSON.stringify(colors)) } catch {}
                try { if (data) localStorage.setItem(LS_BIRTH, JSON.stringify(data)) } catch {}
                setShowEditor(false)
              }}
            />
          )}

          {showDialog && (
            <DialogModal
              onClose={() => setShowDialog(false)}
              onHoroscope={() => { setShowDialog(false); setShowHoroscope(true) }}
            />
          )}

          {showHoroscope && <HoroscopeModal birthData={birthData} onClose={() => setShowHoroscope(false)} />}
        </div>
      </div>
      <div className="hint">WASD to move &nbsp;·&nbsp; SPACE to jump &nbsp;·&nbsp; SHIFT to interact</div>
      <DebugConsole />
      <RecordButton
        status={recorder.status}
        progress={recorder.progress}
        onRecord={handleRecord}
        onStop={handleStop}
      />
    </div>
  )
}
