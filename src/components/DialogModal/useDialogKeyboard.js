import { useEffect, useRef } from 'react'

export function useDialogKeyboard(node, focused, setFocused, handleChoice, onClose) {
  const ignoreInputRef = useRef(true)

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
  }, [node, focused, setFocused, handleChoice, onClose])
}
