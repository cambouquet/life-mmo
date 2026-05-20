import { useState, useCallback, useRef } from 'react'
import './InteractionPlayground.scss'
import { InteractionPlayground as Playground } from '../../game/interactions/InteractionPlayground.js'
import { InteractionToolbar } from './InteractionToolbar.jsx'
import { InteractionLog } from './InteractionLog.jsx'
import { dispatchInteractionAction } from './interactionDispatcher'

export default function InteractionPlayground({ playerStateRef, worldDataRef, onMovePlayer, onInteract }) {
  const [logs, setLogs] = useState([])
  const [selectedInteraction, setSelectedInteraction] = useState(null)
  const playgroundRef = useRef(null)

  if (!playgroundRef.current) {
    playgroundRef.current = new Playground({ onLog: (entry, allLogs) => setLogs([...allLogs]) })
  }

  const playground = playgroundRef.current
  const executeInteraction = useCallback((action) => {
    dispatchInteractionAction(action, playground, playerStateRef.current, worldDataRef.current)
  }, [playground, playerStateRef, worldDataRef])

  return (
    <div className="interaction-playground">
      <InteractionToolbar selectedInteraction={selectedInteraction} onInteraction={(id) => { setSelectedInteraction(id); executeInteraction(id) }} />
      <InteractionLog logs={logs} />
    </div>
  )
}
