import { useState, useCallback, useRef } from 'react'
import './InteractionPlayground.scss'
import { InteractionPlayground as Playground } from '../../game/interactions/InteractionPlayground.js'

export default function InteractionPlayground({ playerStateRef, worldDataRef, onMovePlayer, onInteract }) {
  const [logs, setLogs] = useState([])
  const [input, setInput] = useState('')
  const [selectedInteraction, setSelectedInteraction] = useState(null)
  const playgroundRef = useRef(null)
  const logsEndRef = useRef(null)

  // Initialize playground
  if (!playgroundRef.current) {
    playgroundRef.current = new Playground({
      onLog: (entry, allLogs) => {
        setLogs([...allLogs])
      }
    })
  }

  const playground = playgroundRef.current

  const executeInteraction = useCallback((action) => {
    const player = playerStateRef.current
    const world = worldDataRef.current

    try {
      switch (action) {
        case 'inspect-player':
          playground.inspectPlayer(player, world)
          break
        case 'inspect-world':
          playground.inspectWorld(world)
          break
        case 'check-proximity':
          playground.checkProximity(player, world)
          break
        case 'verify-state':
          playground.verifyGameState(player, world)
          break
        case 'scan-collisions':
          playground.scanCollisionsAround(player, world)
          break
        case 'help':
          playground.help()
          break
        case 'clear':
          playground.clear()
          break
        default:
          playground.log('Unknown interaction', 'error')
      }
    } catch (error) {
      playground.log(`Error: ${error.message}`, 'error')
    }
  }, [playground, playerStateRef, worldDataRef])

  // Scroll to bottom when logs update
  useState(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const interactions = [
    {
      id: 'inspect-player',
      label: 'Inspect Player',
      description: 'View player position, facing, velocity',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M 6 20c0-4 2.7-7 6-7s6 3 6 7" />
        </svg>
      )
    },
    {
      id: 'inspect-world',
      label: 'Inspect World',
      description: 'View world structure and object positions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      id: 'check-proximity',
      label: 'Check Proximity',
      description: 'Find nearby interactive objects',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 4v3M20 12h-3M12 20v-3M4 12h3" />
        </svg>
      )
    },
    {
      id: 'scan-collisions',
      label: 'Scan Collisions',
      description: 'Find collision tiles around player',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6h3v3H6zM15 6h3v3h-3zM6 15h3v3H6zM15 15h3v3h-3z" />
          <rect x="3" y="3" width="18" height="18" />
        </svg>
      )
    },
    {
      id: 'verify-state',
      label: 'Verify Game State',
      description: 'Full game state health check',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    },
    {
      id: 'help',
      label: 'Help',
      description: 'Show available interactions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      )
    },
    {
      id: 'clear',
      label: 'Clear Log',
      description: 'Clear interaction history',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      )
    }
  ]

  return (
    <div className="interaction-playground">
      <div className="interaction-playground__header">
        <h3>Game Interactions</h3>
      </div>

      <div className="interaction-playground__content">
        <div className="interaction-playground__buttons">
          {interactions.map(interaction => (
            <button
              key={interaction.id}
              className={`interaction-playground__button ${selectedInteraction === interaction.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedInteraction(interaction.id)
                executeInteraction(interaction.id)
              }}
              title={interaction.description}
            >
              {interaction.icon}
              {interaction.label}
            </button>
          ))}
        </div>

        <div className="interaction-playground__log">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`interaction-playground__log-entry log-${log.type}`}
            >
              <span className="interaction-playground__log-time">{log.timestamp}</span>
              <span className="interaction-playground__log-message">{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  )
}
