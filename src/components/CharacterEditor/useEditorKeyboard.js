import { useRef, useEffect } from 'react'

export function useEditorKeyboard(modalRef, pageSequence, activePage, colorsRef, birthDataOutput, trimmedName, onSave, onClose) {
  const readyRef = useRef(false)

  useEffect(() => {
    readyRef.current = false

    const handleKeyUp = e => {
      if (e.key === ' ' || e.key === 'Enter') readyRef.current = true
    }

    const handleKeyDown = e => {
      if (e.target.tagName === 'INPUT') return

      if (e.key === 'Enter' || e.key === ' ') {
        if (!readyRef.current) return
        e.preventDefault()
        onSave(colorsRef.current, birthDataOutput, trimmedName)
      } else if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const el = modalRef.current
        if (!el) return
        const currentIndex = pageSequence.indexOf(activePage)
        const nextIndex = e.key === 'ArrowRight' ? Math.min(currentIndex + 1, pageSequence.length - 1) : Math.max(currentIndex - 1, 0)
        el.scrollTo({ left: nextIndex * el.clientWidth, behavior: 'smooth' })
      }
    }

    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onSave, onClose, birthDataOutput, trimmedName, activePage, pageSequence, modalRef, colorsRef])
}
