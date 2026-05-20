import { useState, useCallback, useRef } from 'react'
import './InteractionPlayground.scss'
import { InteractionPlayground as Playground } from '../../game/interactions/InteractionPlayground.js'
import { InteractionToolbar } from './InteractionToolbar.jsx'
import { InteractionLog } from './InteractionLog.jsx'
import { INTERACTIONS } from './interactionsList.jsx'

export default function InteractionPlayground({ playerStateRef, worldDataRef, onMovePlayer, onInteract }) {
  const [logs, setLogs] = useState([])
  const [selectedInteraction, setSelectedInteraction] = useState(null)
  const playgroundRef = useRef(null)

  if (!playgroundRef.current) {
    playgroundRef.current = new Playground({
      onLog: (entry, allLogs) => { setLogs([...allLogs]) }
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

  const handleInteraction = (interactionId) => {
    setSelectedInteraction(interactionId)
    executeInteraction(interactionId)
  }

  return (
    <div className="interaction-playground">
      <InteractionToolbar selectedInteraction={selectedInteraction} onInteraction={handleInteraction} />
      <InteractionLog logs={logs} />
    </div>
  )
}
