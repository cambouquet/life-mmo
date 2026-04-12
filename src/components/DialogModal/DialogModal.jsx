import { useState, useEffect, useRef, useCallback } from 'react'
import { DIALOG }   from '../../game/dialog.jsx'
import { drawNpc }  from '../../game/draw/npc.jsx'
export default function DialogModal({ onClose, onHoroscope }) {
  const [nodeKey,  setNodeKey]  = useState('greeting')
  const [focused,  setFocused]  = useState(0)
  const portraitRef    = useRef(null)
  const choiceRefs     = useRef([])
  const ignoreInputRef = useRef(true)   // swallow the key that opened the dialog
  const node = DIALOG[nodeKey]

  // Reset focus to first choice when node changes
  useEffect(() => { setFocused(0) }, [nodeKey])

  // Keep DOM focus in sync
  useEffect(() => {
    choiceRefs.current[focused]?.focus()
  }, [focused, nodeKey])

  // Animated portrait
  useEffect(() => {
    const canvas = portraitRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    let phase = 0
    let last  = performance.now()
    let rafId
    const animate = (ts) => {
      phase += (ts - last) / 1000 * 4.5
      last   = ts
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawNpc(ctx, 0, 0, phase)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleChoice = useCallback((choice) => {
    if      (choice.action === 'close')     onClose()
    else if (choice.action === 'horoscope') onHoroscope()
    else if (choice.next)                   setNodeKey(choice.next)
  }, [onClose, onHoroscope])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Shift' || e.key === ' ') {
        if (ignoreInputRef.current) { ignoreInputRef.current = false; return }
      }
      const len = node.choices.length
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault()
        setFocused(f => (f + 1) % len)
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault()
        setFocused(f => (f - 1 + len) % len)
      } else if (e.code === 'Enter' || e.key === ' ' || e.key === 'Shift') {
        e.preventDefault()
        handleChoice(node.choices[focused])
      }
    }
    window.addEventListener('keyup', onKey)
    return () => window.removeEventListener('keyup', onKey)
  }, [node, focused, handleChoice, onClose])

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
            <button
              key={i}
              ref={el => choiceRefs.current[i] = el}
              className={`dialog__choice${i === focused ? ' dialog__choice--focused' : ''}`}
              onClick={() => handleChoice(ch)}
              onMouseEnter={() => setFocused(i)}
            >
              {ch.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
