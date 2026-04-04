import { useState, useCallback, useEffect, useRef } from 'react'
import HUD  from './HUD/HUD.jsx'
import Game from './Game/Game.jsx'

export default function App() {
  const [facing,     setFacing]     = useState('down')
  const [moving,     setMoving]     = useState(false)
  const [logEntries, setLogEntries] = useState([
    '<em>System:</em> Move with WASD.',
    'The torches flicker in the dark.',
    '<em>Kami</em> enters the dungeon.',
  ])

  const wrapRef = useRef(null)

  // Viewport fit: scale the entire game-wrap to fit the window
  useEffect(() => {
    function fit() {
      const totalH = 64 + 224 * 3 + 40
      const totalW = 320 * 3
      const s = Math.min(
        1,
        (window.innerHeight * 0.97) / totalH,
        (window.innerWidth  * 0.98) / totalW
      )
      if (wrapRef.current) {
        wrapRef.current.style.transform = `scale(${s})`
      }
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const handleStateChange = useCallback(({ facing, moving, log }) => {
    setFacing(facing)
    setMoving(moving)
    setLogEntries(log)
  }, [])

  return (
    <div className="game-wrap" ref={wrapRef}>
      <HUD facing={facing} moving={moving} logEntries={logEntries} />
      <Game onStateChange={handleStateChange} />
      <div className="hint">WASD / ARROW KEYS to move</div>
    </div>
  )
}
