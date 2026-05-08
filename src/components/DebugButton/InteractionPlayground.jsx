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
      label: '👤 Inspect Player',
      description: 'View player position, facing, velocity'
    },
    {
      id: 'inspect-world',
      label: '🌍 Inspect World',
      description: 'View world structure and object positions'
    },
    {
      id: 'check-proximity',
      label: '📍 Check Proximity',
      description: 'Find nearby interactive objects'
    },
    {
      id: 'scan-collisions',
      label: '🧱 Scan Collisions',
      description: 'Find collision tiles around player'
    },
    {
      id: 'verify-state',
      label: '✓ Verify Game State',
      description: 'Full game state health check'
    },
    {
      id: 'help',
      label: '❓ Help',
      description: 'Show available interactions'
    },
    {
      id: 'clear',
      label: '🗑 Clear Log',
      description: 'Clear interaction history'
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
