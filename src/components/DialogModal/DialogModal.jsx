import { useState, useEffect, useRef, useCallback } from 'react'
import { DIALOG } from '../../game/dialog.jsx'
import { useDialogPortrait } from './useDialogPortrait'
import { useDialogKeyboard } from './useDialogKeyboard'
import { DialogChoice } from './DialogChoice'

export default function DialogModal({ onClose, onHoroscope }) {
  const [nodeKey, setNodeKey] = useState('greeting')
  const [focused, setFocused] = useState(0)
  const choiceRefs = useRef([])
  const portraitRef = useDialogPortrait()
  const node = DIALOG[nodeKey]

  useEffect(() => { setFocused(0) }, [nodeKey])

  useEffect(() => {
    choiceRefs.current[focused]?.focus()
  }, [focused, nodeKey])

  const handleChoice = useCallback((choice) => {
    if (choice.action === 'close') onClose()
    else if (choice.action === 'horoscope') onHoroscope()
    else if (choice.next) setNodeKey(choice.next)
  }, [onClose, onHoroscope])

  useDialogKeyboard(node, focused, setFocused, handleChoice, onClose)

  return (
    <div className="modal-overlay">
      <div className="modal dialog">
        <div className="dialog__header">
          <canvas ref={portraitRef} className="dialog__portrait" width="16" height="16" />
          <div className="dialog__npc-name">Lyra</div>
        </div>
        <div className="dialog__speech">{node.npc}</div>
        <div className="dialog__choices">
          {node.choices.map((ch, i) => (
            <DialogChoice
              key={i}
              ref={el => choiceRefs.current[i] = el}
              choice={ch}
              isFocused={i === focused}
              index={i}
              onChoice={handleChoice}
              onMouseEnter={setFocused}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
