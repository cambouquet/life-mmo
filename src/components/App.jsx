import { useState, useCallback } from 'react'
import { useViewportScale }  from '../hooks/useViewportScale.jsx'
import HUD                   from './HUD/HUD.jsx'
import Game                  from './Game/Game.jsx'
import HoroscopeModal        from './HoroscopeModal/HoroscopeModal.jsx'
import DialogModal           from './DialogModal/DialogModal.jsx'
import GuidanceVoice         from './GuidanceVoice/GuidanceVoice.jsx'
import CharacterEditor       from './CharacterEditor/CharacterEditor.jsx'

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
  const [charColors,    setCharColors]    = useState({
    hair: '#6030d0',
    skin: '#f8c898',
    eyes: '#8040e8',
    outfit: '#4a1090',
    stick: '#60a8ff'
  })

  const wrapRef = useViewportScale()

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

  return (
    <div className="game-wrap" ref={wrapRef}>
      <HUD facing={facing} moving={moving} logEntries={logEntries} charColors={charColors} />
      <div className="canvas-wrap">
        <Game
          onStateChange={handleStateChange}
          onInteract={handleInteract}
          paused={showDialog || showHoroscope || showEditor}
          charColors={charColors}
        />
        {!showDialog && !showHoroscope && !showEditor && <GuidanceVoice text={guidance} />}
      </div>
      <div className="hint">WASD to move &nbsp;·&nbsp; SPACE to jump &nbsp;·&nbsp; SHIFT to interact</div>
      {showEditor && (
        <CharacterEditor
          initialColors={charColors}
          onClose={() => setShowEditor(false)}
          onChange={setCharColors}
          onSave={(colors) => {
            setCharColors(colors)
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
      {showHoroscope && <HoroscopeModal onClose={() => setShowHoroscope(false)} />}
    </div>
  )
}
