import { useState, useCallback } from 'react'
import { useViewportScale }  from '../hooks/useViewportScale.jsx'
import HUD                   from './HUD/HUD.jsx'
import Game                  from './Game/Game.jsx'
import HoroscopeModal        from './HoroscopeModal/HoroscopeModal.jsx'

export default function App() {
  const [facing,        setFacing]        = useState('down')
  const [moving,        setMoving]        = useState(false)
  const [logEntries,    setLogEntries]    = useState([
    '<em>System:</em> Move with WASD.',
    'The torches flicker in the dark.',
    '<em>Kami</em> enters the dungeon.',
  ])
  const [showHoroscope, setShowHoroscope] = useState(false)

  const wrapRef = useViewportScale()

  const handleStateChange = useCallback(({ facing, moving, log }) => {
    setFacing(facing)
    setMoving(moving)
    setLogEntries(log)
  }, [])

  const handleInteract = useCallback(() => setShowHoroscope(v => !v), [])

  return (
    <div className="game-wrap" ref={wrapRef}>
      <HUD facing={facing} moving={moving} logEntries={logEntries} />
      <Game
        onStateChange={handleStateChange}
        onInteract={handleInteract}
        paused={showHoroscope}
      />
      <div className="hint">WASD to move &nbsp;·&nbsp; SPACE to jump &nbsp;·&nbsp; SHIFT to interact</div>
      {showHoroscope && <HoroscopeModal onClose={() => setShowHoroscope(false)} />}
    </div>
  )
}
